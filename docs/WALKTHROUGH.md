# ScamShield MY — Full System Walkthrough

> **Audience:** Developers setting up the project, hackathon judges, and team members demoing the system.
> This document walks through the complete user journey, API request lifecycle, and system behaviour from first launch to final result output.

---

## Part 1: Project Setup (First-Time Installation)

### Step 1: Prerequisites
Ensure Node.js v18 or above is installed:
```bash
node --version
# Expected: v18.x.x or higher
```

> [!NOTE]
> Node.js v18+ is required because `server.js` uses the native `fetch()` API (built-in since Node 18) to call the Groq AI endpoint. Earlier versions will throw a `ReferenceError: fetch is not defined` error.

### Step 2: Install Dependencies
```bash
cd "ScamShield-English-Version"
npm install
```

**Expected output:**
```
added 70 packages in 2s
24 packages are looking for funding
found 0 vulnerabilities
```

**Packages installed:**
| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.2.1 | HTTP server & routing |
| `cors` | ^2.8.6 | Cross-origin request handling |
| `csv-parser` | ^3.2.0 | Stream-parse CSV dataset files |
| `dotenv` | ^17.4.1 | Load `.env` API key securely |

### Step 3: Configure API Key
Create a `.env` file in the project root:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> [!WARNING]
> Never commit this file to GitHub. The `.gitignore` file already excludes it. Get your free key at https://console.groq.com

### Step 4: Launch the Server
```bash
npm start
```

**Expected startup output:**
```
🚀 ScamShield API Gateway Simulation is running on http://localhost:3000
✅ Loaded: 642 SMS Spam texts.
✅ Loaded: 10673 Phishing/Malware URLs.
```

Open browser at: **http://localhost:3000**

---

## Part 2: Application UI Walkthrough

### Landing Page

When the application loads, you will see:

```
┌──────────────────────────────────────────────┐
│                          [🇲🇾 Malay ▾]        │
│                                              │
│   🛡️  ScamShield MY                          │
│   Scam Probability Analysis Engine          │
│                                              │
│   ┌─────────────────────────────────────┐   │
│   │ [🔗 Link] [💬 Msg] [📞 No] [✉️ Email]...│   │
│   │                                     │   │
│   │  [ Enter suspicious URL here... ]   │   │
│   │                                     │   │
│   │  [       SCAN NOW (IMBAS)        ]  │   │
│   └─────────────────────────────────────┘   │
│                                              │
│   Powered by MuleRouter Gateway & AI        │
└──────────────────────────────────────────────┘
```

### Language Selection
- Dropdown at top-right supports 5 languages
- Changing language instantly updates all UI text AND future AI responses
- Default: 🇲🇾 **Malay (Bahasa Malaysia)**

### Input Tabs
| Tab | Scan Type | Placeholder |
|---|---|---|
| 🔗 Pautan (URL) | URL | `Enter suspicious URL here...` |
| 💬 Mesej (Message) | Message text | `Paste scam message here...` |
| 📞 Nombor (Number) | Phone number | `Example: +60123456789` |
| ✉️ E-mel (Email) | Full Email Text | `Paste full email text...` |
| 💳 Transaksi (Transaction) | ID Number | `Transaction ID (e.g. 12, 49)...` |

---

## Part 3: Detection Flow Walkthrough

### Scenario A: Phishing URL

**User Input:** `http://103.45.67.89/maybank/login`

**Flow:**
1. Frontend sends `POST /api/scan` with `{ type: "url", data: "http://103.45.67.89/...", lang: "Malay" }`
2. **Layer 0 triggered** — Regex detects `IP address used as domain`
3. Server returns immediately:
   ```
   STATUS: SCAM

   SEBAB: URL ini menunjukkan 1 petanda teknik penyembunyian:
   1. Alamat IP digunakan sebagai domain (bukan nama domain sah)

   TINDAKAN: JANGAN klik! URL ini menggunakan teknik penyamaran.
   ```
4. UI renders result box with **red border** and ⚠️ SCAM icon
5. **Total time:** ~0.001 seconds (no AI call made)

---

### Scenario B: Known Malware URL

**User Input:** `http://paypallogin-verify.xyz/secure`

**Flow:**
1. Frontend sends `POST /api/scan`
2. **Layer 0** — No obfuscation patterns matched
3. **Layer 1** — URL found in URLHaus database (`malware`, tags: `phishing`)
4. Server returns:
   ```
   STATUS: SCAM

   REASON: This URL is detected in the "Blacklisted" database due to [malware] activity. Tags: phishing

   ACTION: Do not click! Close this tab immediately.
   ```
5. **Total time:** ~0.001 seconds (in-memory hash map lookup)

---

### Scenario C: New Unknown URL (AI Fallback)

**User Input:** `https://free-iphone16-winner.shop/claim`

**Flow:**
1. Frontend sends `POST /api/scan`
2. **Layer 0** — No obfuscation pattern matched (domain has no obvious tricks)
3. **Layer 1** — URL not found in URLHaus database (new domain)
4. **Layer 2 triggered** — Request sent to Groq's LLaMA-3 API:
   ```
   System: "You are a cybersecurity analyst from ScamShield MY. Analyze the input. Respond ENTIRELY in Malay. Output raw JSON..."
   User: "Please logically analyze this URL for phishing: https://free-iphone16-winner.shop/claim"
   ```
5. LLaMA-3 returns:
   ```json
   {
     "status": "SCAM",
     "reason": "Domain menggunakan taktik hadiah palsu (free-iphone16-winner) yang tipikal dalam kempen pancingan data...",
     "action": "Jangan klik atau kongsi pautan ini..."
   }
   ```
6. Server formats and returns to frontend
7. **Total time:** ~2.5 seconds

---

### Scenario D: Safe Malaysian Phone Number

**User Input:** `+60123456789`

**Flow:**
1. Frontend sends `POST /api/scan` with `{ type: "phone", ... }`
2. **Layer 0 skipped** (only applies to URLs)
3. **Layer 1 skipped** (no phone number database)
4. **Layer 2 triggered** — Phone-specific prompt with anti-false-positive rules:
   ```
   "Malaysian mobiles +601x are NORMAL and NOT scam by default.
    If number looks like a valid local Malaysian mobile → classify as SAFE."
   ```
5. LLaMA-3 returns:
   ```json
   {
     "status": "SAFE",
     "reason": "This is a standard Malaysian mobile number registered under +601x prefix...",
     "action": "No action needed."
   }
   ```
6. UI renders result box with **green border** and ✅ icon
7. **Total time:** ~2.5 seconds

---

### Scenario E: Spam Text Message

**User Input:** `FREE entry to win $1000 cash prize. Reply WIN to 8007.`

**Flow:**
1. Frontend sends `POST /api/scan` with `{ type: "message", ... }`
2. **Layer 0 skipped** (URL not detected in message)
3. **Layer 1** — Message substring matched against UCI SMS Spam Collection
4. Server returns immediately:
   ```
   STATUS: SCAM

   REASON: This message template is a 100% match with the "SMS Spam Collection" database.

   ACTION: Block the sender and ignore their instructions.
   ```
5. **Total time:** ~0.001 seconds

---

### Scenario F: Fraudulent Financial Transaction

**User Input:** `9`

**Flow:**
1. Frontend sends `POST /api/scan` with `{ type: "transaction", ... }`
2. **Layer 0 and 1** — Matched instantly against in-memory `fraud_indicators` Map.
3. Transaction ID `9` resolves to `FraudIndicator = 1`.
4. Server returns immediately:
   ```
   STATUS: SCAM

   REASON: Transaction ID 9 is flagged as SCAM/FRAUD in the financial database.

   ACTION: Freeze the account immediately and report to authorities.
   ```
5. **Total time:** ~0.001 seconds

---

### Scenario G: Phishing Email Analysis

**User Input:** `Urgent: Your Paypal account will be closed in 24 hours. Click here to verify.`

**Flow:**
1. Frontend sends `POST /api/scan` with `{ type: "email", ... }`
2. **Layer 2 triggered** — Input directly routed to LLaMA-3 with specialized phishing context.
3. LLaMA-3 returns:
   ```json
   {
     "status": "SCAM",
     "reason": "This email demonstrates classic urgency tactics used in phishing to steal credentials...",
     "action": "Do not click any links and delete the email."
   }
   ```
4. **Total time:** ~2.5 seconds

---

## Part 4: API Reference

### `POST /api/scan`

**Endpoint:** `http://localhost:3000/api/scan`

**Request:**
```json
{
  "type": "url",
  "data": "https://example.com",
  "lang": "English"
}
```

| Field | Type | Values |
|---|---|---|
| `type` | string | `"url"` / `"message"` / `"phone"` |
| `data` | string | The content to scan |
| `lang` | string | `"Malay"` / `"English"` / `"Mandarin"` / `"Tamil"` / `"Arabic"` |

**Response (Success):**
```json
{
  "success": true,
  "result": "STATUS: SCAM\n\nREASON: ...\n\nACTION: ..."
}
```

**Response (Error):**
```json
{
  "error": "Please provide type and data to scan."
}
```

**Status Codes:**
- `200 OK` — Successful scan
- `400 Bad Request` — Missing `type` or `data`
- `500 Internal Server Error` — Groq API failure

---

## Part 5: Project File Structure

```
ScamShield-English-Version/
├── server.js              # MuleRouter API Gateway (main backend)
├── package.json           # Project definition & dependencies
├── .env                   # API Keys (SECRET — never commit to GitHub!)
├── .gitignore             # Excludes .env, node_modules
├── README.md              # Project overview
├── public/
│   ├── index.html         # Main frontend UI
│   ├── style.css          # Glassmorphism dark mode design
│   └── app.js             # Frontend logic + i18n (5 languages)
├── dataset/
│   ├── Phishing URL Dataset/
│   │   └── urlhaus_cleaned1.csv     # 10,673 phishing URLs
│   └── SMS Spam Collection/
│       └── spam.csv                 # 642 spam messages
└── docs/
    ├── CASE_STUDY.md                # Malaysian scam case studies
    ├── IMPLEMENTATION_HISTORY.md    # Full development timeline
    └── WALKTHROUGH.md               # This file
```

---

## Part 6: Performance Benchmarks

| Detection Path | Avg Response Time | API Cost |
|---|---|---|
| Layer 0 (Obfuscation) | ~0.001s | RM 0.00 |
| Layer 1 (DB Lookup) | ~0.001s | RM 0.00 |
| Layer 2 (AI Fallback) | ~2.5s | Groq Free Tier |
| Full chain (worst case) | ~2.5s | Groq Free Tier |

---

## Part 7: Known Limitations

| Limitation | Description | Mitigation |
|---|---|---|
| Message false negatives | Short messages (<20 chars) may bypass spam DB | AI fallback catches semantic patterns |
| New phishing URLs | URLHaus DB updated manually; new domains not in list | Layer 0 obfuscation + AI fallback |
| Love scam detection | Requires full conversation context | AI returns SUSPICIOUS; user advised to share more |
| No image/screenshot analysis | System only accepts text input | Roadmap: Image OCR integration |
| AI hallucination risk | LLaMA-3 may misclassify some inputs | Low temperature (0.1) and structured prompt reduces risk |

---

## Part 8: Deployment Checklist

Before deploying to production:

- [ ] `GROQ_API_KEY` set in environment variables on hosting platform
- [ ] `node_modules/` excluded from repo (`.gitignore`)
- [ ] `.env` file excluded from repo (`.gitignore`)
- [ ] Node.js v18+ configured on host
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Dataset CSV files included in repository
- [ ] Test all 3 input types (URL, message, phone) after deployment

---

*Document version: 1.0*
*Last updated: 7 April 2026*
*ScamShield MY — National AI Hackathon Prototype*
