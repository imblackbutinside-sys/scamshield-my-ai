# ScamShield MY — Implementation History

> **Full development timeline** from initial research to functional deployment. This document serves as the technical implementation log for the ScamShield MY hackathon project.

---

## Phase 1: Research & Problem Definition
**Period:** Early April 2026

### Objective
Develop a lightweight, cross-device AI-powered web application for scam and fraud detection, tailored for a national AI hackathon and the Malaysian demographic.

### Research Findings
During the early research phase, the team identified key challenges:

1. **Accessibility Gap:** Existing scam detection tools are either too complex or require high-end devices. Many Malaysian scam victims are elderly with older smartphones.
2. **Language Barrier:** Most tools only support English. Malaysian victims communicate in Malay, Mandarin, Tamil, and Arabic.
3. **API Key Exposure Risk:** Web apps that call AI APIs directly from the frontend expose sensitive keys in browser DevTools.
4. **False Positive Problem:** Naive phone number checkers often flag legitimate Malaysian numbers (`+601x`, `+603`) as scams.

### Key Design Decisions Made
- Build as a **web app** (no installation required, cross-device compatible)
- Use a **hybrid architecture** — avoid 100% AI dependency for cost and speed
- Implement a **backend API Gateway** to protect AI keys
- Apply **anti-false-positive rules** specific to Malaysian phone number patterns

### Input Methods Evaluated
| Method | Decision | Reason |
|---|---|---|
| Direct email/WhatsApp integration | ❌ Rejected | Privacy concerns, platform restrictions |
| Browser extension | ❌ Rejected | Requires installation, not cross-device |
| Copy-paste text input | ✅ Adopted | Universal, works on all devices |
| Bot-based forwarding | ⚠️ Deferred | High complexity for hackathon timeline |

---

## Phase 2: Architecture Design
**Period:** Early-Mid April 2026

### System Architecture Chosen: Hybrid 3-Layer Engine

After evaluating several approaches, the team adopted a cascading verification engine to balance speed, cost, and accuracy:

```
User Input → Frontend (HTML/JS) → MuleRouter API Gateway (Node.js/Express)
                                          │
                                  ┌───────▼────────┐
                                  │  LAYER 0        │ Rule-based (~0.001s)
                                  │  Obfuscation    │
                                  └───────┬────────┘
                                          │ (pass)
                                  ┌───────▼────────┐
                                  │  LAYER 1        │ Local DB (~0.001s)
                                  │  CSV Database   │
                                  └───────┬────────┘
                                          │ (no match)
                                  ┌───────▼────────┐
                                  │  LAYER 2        │ Groq AI (~2.5s)
                                  │  LLaMA-3 NLP   │
                                  └───────┬────────┘
                                          │
                                  Output: SAFE / SUSPICIOUS / SCAM
```

### MuleRouter API Gateway Pattern
Inspired by MuleSoft's API gateway pattern, `server.js` acts as a **secure middleware router** that:
- Receives requests from the frontend
- Applies Layer 0 (Obfuscation) and Layer 1 (DB lookup) internally
- Forwards to Groq API only when needed (Layer 2)
- Returns structured JSON responses to frontend
- **Never exposes the API key to the client**

### Technology Stack Finalized
| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Vanilla HTML/CSS/JS | Lightweight, no build tools, works on old browsers |
| Styling | Custom CSS (glassmorphism) | Premium look without framework overhead |
| Backend | Node.js + Express | Fast, lightweight, widely understood |
| AI Engine | Groq LLaMA-3.3-70B-Versatile | Free tier available, fast inference (~2.5s) |
| Database | CSV files in-memory (Map/Set) | O(1) lookup, no DB server cost |
| Icons | Ionicons 7 | CDN-loaded, no build step |
| Fonts | Google Fonts (Inter, Outfit) | Professional typography |

---

## Phase 3: Dataset Integration
**Period:** Mid April 2026

### Datasets Selected

#### URLHaus (Phishing/Malware URLs)
- **Source:** https://urlhaus.abuse.ch/
- **Records:** 10,673 confirmed phishing/malware URLs
- **Format:** CSV (`url`, `threat`, `tags` columns)
- **Storage:** Loaded into `Map<url, {threat, tags}>` on server startup
- **Lookup speed:** O(1) hash map

#### SMS Spam Collection (UCI)
- **Source:** UCI Machine Learning Repository
- **Records:** 642 spam text messages
- **Format:** CSV (`v1` = label, `v2` = message text)
- **Storage:** Loaded into `Set<string>` (lowercase trimmed)
- **Matching:** Substring matching with minimum length threshold (>20 chars)

### Loading Implementation
```javascript
// URLHaus — O(1) Map lookup
const maliciousUrls = new Map(); // url -> { threat, tags }

// SMS Spam — Set membership check
const spamMessages = new Set(); // spam text (lowercase)

// Loaded on startup via csv-parser streams
function loadDatasets() { ... }
loadDatasets();
```

---

## Phase 4: Layer 0 — URL Obfuscation Engine
**Period:** Mid April 2026

### Academic Basis
Based on peer-reviewed research:
> Madamidola, O.A., Ngobigha, F., & Ez-zizi, A. (2025). *Detecting new obfuscated malware variants: A lightweight and interpretable machine learning approach.* Intelligent Systems with Applications, 25(6), 200472.

### 8 Obfuscation Patterns Implemented

| # | Technique | Implementation |
|---|---|---|
| 1 | URL Shortener | String match against known shorteners list |
| 2 | IP as domain | Regex: `/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/` |
| 3 | Punycode/Homograph | Regex: `/xn--/` |
| 4 | Nested subdomains (>4 levels) | URL parse → split by `.` → count |
| 5 | Redirect parameters | URL parse → check `?url=`, `?redirect=`, `?goto=` |
| 6 | Brand lookalike domain | Regex per brand (paypal, google, amazon, maybank, cimb) |
| 7 | Excessive URL length (>200 chars) | `inputData.length > 200` |
| 8 | Percent-encoding (>5 occurrences) | Count `/(%[0-9a-fA-F]{2})/g` matches |

---

## Phase 5: AI Fallback — Layer 2 (LLaMA-3 Integration)
**Period:** Mid April 2026

### Provider Decision: Groq API
After evaluating OpenAI, Anthropic, Google Gemini, and Groq:
- **Groq** selected for its **free tier** and **fastest inference speed** (~2.5s for 70B model)
- Model: `llama-3.3-70b-versatile`
- Response format: `json_object` (forced structured output)

### MuleRouter API Gateway Integration Pattern
The API call is made **entirely on the server**, never from the frontend:

```javascript
// server.js → Groq API call (hidden from frontend)
const groqPayload = {
    model: "llama-3.3-70b-versatile",
    messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ],
    temperature: 0.1,
    max_tokens: 500,
    response_format: { type: "json_object" }
};
```

### Structured AI Output
The AI is always prompted to return:
```json
{
  "status": "SCAM | SAFE | SUSPICIOUS",
  "reason": "Explanation in selected language",
  "action": "Recommended action in selected language"
}
```

---

## Phase 6: Multilingual Support (i18n)
**Period:** Mid-Late April 2026

### 5 Languages Implemented
All UI labels, button text, placeholders, loading messages, and AI prompts are localized for:
- 🇲🇾 Malay (Bahasa Malaysia) — **Default**
- 🇬🇧 English
- 🇨🇳 Mandarin (中文)
- 🇮🇳 Tamil (தமிழ்)
- 🇸🇦 Arabic (عربي)

### Implementation: `app.js` i18n Object
```javascript
const UI_LANG = {
    'Malay': { subtitle: '...', tabUrl: '...', scanBtn: 'IMBAS SEKARANG', ... },
    'English': { subtitle: '...', tabUrl: '...', scanBtn: 'SCAN NOW', ... },
    'Mandarin': { ... },
    'Tamil': { ... },
    'Arabic': { ... }
};
```

### Backend Translation
The `lang` parameter is passed to `server.js` via the API request, allowing:
- Database responses to be formatted in the chosen language
- AI system prompts to instruct LLaMA-3 to respond in the chosen language

---

## Phase 7: Anti-False-Positive Phone Number Rules
**Period:** Late April 2026

### Problem
Early testing revealed that a naive AI implementation would flag legitimate Malaysian numbers as scams. This would destroy user trust.

### PhoneGuard Framework (Inspired by karthikrao121, Kaggle 2025)
Rules enforced in the AI system prompt:

```
- Malaysian mobiles: +601x (Maxis, Celcom, Digi, U Mobile) → SAFE by default
- Malaysian landlines: +603 (KL), +604 (Penang), +605 (Perak) → SAFE
- ONLY flag SCAM for: spoofed +0 prefix, repeated digits (+60000000000),
  or known scammer patterns
- If genuinely unsure → SUSPICIOUS (NOT SCAM)
```

---

## Phase 8: UI/UX Design & Visual Polish
**Period:** Late April 2026

### Design System
- **Theme:** Dark mode glassmorphism
- **Colors:** Navy (`#0f172a`), Neon Blue (`#0ea5e9`), Signal Green (`#10b981`), Alert Red (`#ef4444`), Amber (`#f59e0b`)
- **Typography:** Inter (body), Outfit (headings/logo)
- **Effects:** Animated floating blobs, spinner loader, slide-up result animation, button hover lift

### UI Bug Fixes Applied
| Issue | Fix Applied |
|---|---|
| Logo title wrapping ("ScamShield" on one line, "MY" below) | Added `white-space: nowrap` + `clamp()` font size on `h1` |
| Language dropdown overlapping logo title | Removed `position: absolute` → restructured as `flexbox` row above logo |
| Brand name mismatch (UI showed "ScamAI" vs "ScamShield MY") | Updated `index.html` H1 and `<title>` tag |

---

## Phase 9: Security Hardening & Deployment Prep
**Period:** Late April 2026

### Security Measures
1. **API Key Protection:** `dotenv` + `.env` file; key only accessible on server
2. **`.gitignore` Created:** Excludes `node_modules/`, `.env`, `.DS_Store`
3. **`package.json` Updated:** Added `"start": "node server.js"` for cloud platform compatibility

### Deployment Configuration
| Setting | Value |
|---|---|
| Build Command | `npm install` |
| Start Command | `npm start` |
| Environment Variable | `GROQ_API_KEY=<your_key>` |
| Recommended Platforms | Render.com, Railway.app |
| Node.js Minimum Version | v18+ (required for native `fetch()`) |

---

## Phase 10: English Version & Documentation
**Period:** 7 April 2026

### English Version Created
A separate clean English-default copy was created at:
`D:\ScamShield MY — AI-Powered Scam & Fraud Detection Assistant\ScamShield-English-Version\`

**Changes from original (Malay) version:**
- Default language on page load: Bahasa Malaysia (dropdown order preserved, identical to original)
- `server.js`: Terminal logs translated to English
- `README.md`: Fully rewritten in English
- `docs/` folder created with `CASE_STUDY.md`, `IMPLEMENTATION_HISTORY.md`, `WALKTHROUGH.md`

**What was NOT changed (per team decision):**
- Language dropdown order (Malay remains first)
- Core detection logic (identical in both versions)
- Dataset files
- CSS and visual design

---

*Last updated: 7 April 2026*
*Project: ScamShield MY | National AI Hackathon Prototype*
