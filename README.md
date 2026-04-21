# 🛡️ ScamShield MY — AI-Powered Scam & Fraud Detection System

> **Hackathon Prototype** | MuleRouter API Gateway + Hybrid AI-Database Architecture

---

### 🚀 Quick Access Link:
**Live Dashboard (Local):** [http://localhost:3000](http://localhost:3000)

---

## 📋 Overview

**ScamShield MY** is a lightweight, fast, and cross-device compatible AI-powered scam and fraud detection system. This system combines a local database lookup (Local DB) with the artificial intelligence of LLaMA-3 acting as a dual-layer protection mechanism.

---

## 🏗️ System Architecture

```text
User → Frontend (HTML/CSS/JS)
              ↓
         MuleRouter API Gateway (Node.js/Express)
              ↓
    ┌──────────────────────────────────────────────┐
    │  LAYER 0: Obfuscation Check (~0.001s)        │
    │  LAYER 1: Local Database Check (~0.001s)     │
    │  LAYER 2: Multi-AI Fallback Engine (~2-4s)   │
    │     ├── 🟢 Groq (Primary: LLaMA-3.3-70B)    │
    │     ├── 🟡 Gemini 1.5 (Backup 1: Google)    │
    │     └── 🔴 OpenRouter (Backup 2: Fallback) │
    └──────────────────────────────────────────────┘
```

### Core Components

| Component | Technology | Function |
|---|---|---|
| **Frontend** | Vanilla HTML/CSS/JS | UI glassmorphism dark mode |
| **API Gateway** | Node.js + Express | MuleRouter: intelligent routing & AI fallback |
| **AI Engine** | Mixed (Groq, Google, OR) | Multi-provider NLP analytics |
| **Local DB** | CSV (URLHaus + SMS Spam) | Fast lookup of 10,000+ records |
| **Obfuscation** | Rule-based Regex | Detects logically hidden URLs |

---

## ✅ Functional Features 

### 1. 🔗 URL Link Checking
- Checks phishing/malware URLs from the **URLHaus** database (10,673 records)
- Automatic URL obfuscation detection (LAYER 0)
- Fallback to AI for new, unrecorded URLs

### 2. 💬 Text/Message Checking
- Exact matching with **642 SMS Spam records** (UCI Spam Collection)
- AI context analysis for scam messages (social engineering, urgency words, etc.)

### 3. 📞 Phone Number Checking
- Analysis of Malaysian phone number patterns (+601x, +603-+609)
- Identifies foreign numbers masquerading as local numbers
- Anti-false-positive: valid Malaysian numbers → **SAFE**

### 4. 🔍 URL Obfuscation Detection (LAYER 0)
Based on: *Madamidola, Ngobigha & Ez-zizi (2025) — "Detecting new obfuscated malware variants: A lightweight and interpretable machine learning approach"*

8 types of obfuscation automatically detected:
| # | Technique | Example |
|---|---|---|
| 1 | URL Shortener | `bit.ly/abc`, `tinyurl.com/xyz` |
| 2 | IP as domain | `http://192.168.1.1/login` |
| 3 | Homograph/Punycode | `xn--pypal-4ve.com` |
| 4 | Nested Subdomains (>4) | `login.secure.paypal.evil.xyz.com` |
| 5 | Redirect parameters | `?url=`, `?redirect=`, `?goto=` |
| 6 | Lookalike domain | `arnazon.com`, `g00gle.com`, `mayb4nk.com` |
| 7 | Excessively long URL (>200 chars) | - |
| 8 | Excessive percent-encoding | `%2F%2F%61%62%63` |

### 5. 🌐 Multilingual Support (5 Languages)
| Language | Selection |
|---|---|
| 🇬🇧 English | Default |
| 🇲🇾 Malay (Bahasa Melayu) | Full |
| 🇨🇳 Mandarin (中文) | Full |
| 🇮🇳 Tamil (தமிழ்) | Full |
| 🇸🇦 Arabic (عربي) | Full |

Translations cover: UI labels, buttons, placeholders, AI reports, and database responses.

### 6. 🔒 API Security (MuleRouter Gateway)
- API Keys are **never** exposed to the frontend
- All AI requests are managed by `server.js` in the backend
- `.env` file for secure key storage

---

## 📊 Datasets Used

| Dataset | Source | Records | Purpose |
|---|---|---|---|
| **URLHaus** | urlhaus.abuse.ch | 10,673 | Phishing/malware URLs |
| **SMS Spam Collection** | UCI ML Repository | 642 spam | Scam message detection |
| **Fraud Detection Dataset** | Synthetic/Kaggle | 5,000+ | Financial transaction fraud verification |
| **Phishing Email Dataset** | Kaggle / OSINT | 38,000+ | Email scam content analysis |

---

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# 1. Enter the project folder
cd scamshield-my-ai

# 2. Install dependencies
npm install

# 3. Setup the .env file
# Create a .env file based on .env.example and fill in your keys:
# GROQ_API_KEY=your_groq_api_key_here
# GEMINI_API_KEY=your_gemini_api_key_here
# OPENROUTER_API_KEY=your_openrouter_api_key_here

# 4. Run the server
npm start

# 5. Access the dashboard
Open your browser at: http://localhost:3000
```

### Successful Server Output

```
🚀 ScamShield API Gateway Simulation is running...
✅ Loaded: 642 SMS Spam texts.
✅ Loaded: 10673 Phishing/Malware URLs.
```

Open your browser at the deployment URL or the local development address.

### 🛡️ Hacker Radar Dashboard
The system now defaults to the **Hacker Radar Edition**, providing a real-time cybersecurity visualization of scam threats directly on the main landing page.

---

## 🔌 API Endpoints

### POST `/api/scan`

**Request Body:**
```json
{
  "type": "url" | "message" | "phone",
  "data": "input to scan",
  "lang": "English" | "Malay" | "Mandarin" | "Tamil" | "Arabic"
}
```

**Response:**
```json
{
  "success": true,
  "result": "STATUS: SCAM\n\nREASON: ...\n\nACTION: ..."
}
```

**Possible Statuses:**
- `STATUS: SCAM` — Threat detected
- `STATUS: SAFE` — No threat
- `STATUS: SUSPICIOUS` — Exercise caution

---

## 📚 Academic References

1. **Obfuscation Detection Approach:**
   > Madamidola, O.A., Ngobigha, F., & Ez-zizi, A. (2025). *Detecting new obfuscated malware variants: A lightweight and interpretable machine learning approach.* Intelligent Systems with Applications, 25(6), 200472. DOI: 10.1016/j.iswa.2024.200472

2. **Phone Scam Detection (PhoneGuard):**
   > karthikrao121. (2025). *PhoneGuard: Real-Time Phone Scam Detection Using Gemma 3n.* Kaggle. https://www.kaggle.com/code/karthikrao121/phoneguard
