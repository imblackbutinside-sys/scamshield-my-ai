# ScamShield MY — Malaysian Scam Case Studies

> **Purpose:** Real-world scam scenarios that motivated the design decisions of ScamShield MY. These case studies directly influenced the system's detection layers, input types, and anti-false-positive rules.

---

## 1. Macau Scam (Penipuan Macau)

### Overview
The Macau Scam is one of Malaysia's most prevalent and costly scam types. Perpetrators impersonate government officials (e.g., PDRM, Imigresen, Bank Negara) and claim the victim is involved in illegal activities (money laundering, drug trafficking). Victims are pressured to transfer funds to "safe accounts" to avoid arrest.

### Key Characteristics
- Caller spoofs local Malaysian landline numbers (e.g., `+603-XXXX-XXXX`)
- Creates extreme urgency and fear
- Requests multiple bank transfers
- Victims are told not to inform family members

### Impact
- **2023 losses:** RM 1.2 billion (Bank Negara Malaysia)
- Primary victims: elderly (60+), low digital literacy

### ScamShield MY Response
- **Phone Module:** Detects spoofed international numbers disguised as `+603` landlines
- **Anti-False-Positive Rule:** Valid `+603` numbers from KL are classified as **SAFE** by default to avoid alarming legitimate callers
- **Message Module:** Detects urgency keywords and "government authority" patterns via LLaMA-3 NLP

---

## 2. Phishing URL Attacks (Serangan URL Pancingan Data)

### Overview
Scammers distribute fake banking URLs via SMS and WhatsApp, mimicking legitimate Malaysian banks (Maybank, CIMB, RHB, Public Bank). Victims enter their credentials on these pages, which are then harvested.

### Real Example Patterns Observed
| Legitimate | Fake (Phishing) |
|---|---|
| `maybank2u.com.my` | `maybannk2u.com` / `mayb4nk.com` |
| `cimbclicks.com.my` | `c1mb-secure.net` |
| `rhbonline.com.my` | `rhb-verify-now.xyz` |

### Key Characteristics
- Uses lookalike domain names (character substitution: `a→4`, `o→0`, `l→1`)
- Often delivered via URL shorteners (`bit.ly`, `cutt.ly`) to hide true destination
- May use IP addresses directly: `http://103.XX.XX.XX/maybank/login`
- Certificate padlock present (misleads victims)

### ScamShield MY Response
- **Layer 0 (Obfuscation Detection):** Catches 8 URL obfuscation patterns including:
  - Lookalike brand names via regex
  - IP-as-domain
  - URL shorteners
  - Excessive percent-encoding
- **Layer 1 (URLHaus Database):** 10,673 confirmed phishing URLs from abuse.ch blacklist

---

## 3. SMS Parcel Scam (Penipuan Parsel)

### Overview
Victims receive SMS claiming their parcel is held at customs and requires a fee payment to release it. Messages contain phishing URLs that lead to fake PosLaju or JPN portals.

### Example Message
```
PEMBERITAHUAN: Bungkusan anda ditahan di Kastam KL.
Bayar RM8.90 untuk lepaskan parsel anda sebelum 24 jam.
Klik: bit.ly/pos-my-parcel-release
```

### Key Characteristics
- Low fee amount creates perceived low risk
- Urgent 24-hour deadline
- URL shorteners used to mask phishing destination
- Sent from spoofed PosLaju sender IDs

### ScamShield MY Response
- **Message Module:** Matched against 642 UCI SMS Spam Collection patterns
- **URL Module:** `bit.ly` flagged immediately at Layer 0 as URL shortener obfuscation
- **AI Fallback:** NLP detects urgency phrases, low-amount payment traps

---

## 4. Investment Scam (Penipuan Pelaburan / "Mule Account")

### Overview
Victims are recruited via social media (Facebook, Telegram, WhatsApp groups) with promises of high returns (10%-40% monthly). Scammers often use celebrity images or crypto branding. Victims act as "mule accounts" transferring funds.

### Key Characteristics
- High-return promises with no risk
- Requests for bank account access
- Telegram groups with fake testimonials
- Website clones of legitimate investment platforms

### ScamShield MY Response
- **Message Module:** Detects "investment guarantee," "passive income," "high returns" keyword clusters via AI
- **URL Module:** Detects cloned financial platform domains via lookalike regex
- **Phone Module:** Flags unusual international numbers recruiting via WhatsApp

---

## 5. Love Scam (Penipuan Percintaan / Romance Scam)

### Overview
Scammers build fake romantic relationships online over weeks or months, then request money for "emergencies" (hospital bills, plane tickets, business investments). Predominantly targeting middle-aged individuals.

### Key Characteristics
- Long grooming period before financial request
- Victim describes "perfect" partner who has never met in person
- Escalating financial requests
- Contact through dating apps, Facebook, or Instagram

### ScamShield MY Response
- **Message Module:** AI NLP contextually flags messages with manipulation patterns:
  - Urgency combined with emotional appeal
  - Requests for privacy ("don't tell anyone")
  - Large sum requests from unverified contact
- **Limitation:** Requires full conversation context; single-message analysis may yield `SUSPICIOUS` rather than `SCAM`

---

## Summary: Case Study → Feature Mapping

| Scam Type | Detection Layer | Feature |
|---|---|---|
| Macau Scam | Layer 2 (AI) | Phone NLP, urgency detection |
| Phishing URL | Layer 0 + Layer 1 | Obfuscation + URLHaus DB |
| Parcel SMS | Layer 0 + Layer 1 + Layer 2 | URL shortener + spam DB + AI |
| Investment Scam | Layer 2 (AI) | Keyword clustering, URL lookalike |
| Love Scam | Layer 2 (AI) | Manipulation pattern NLP |

---

*References:*
- *Bank Negara Malaysia Annual Report 2023*
- *PDRM Commercial Crime Investigation Department (CCID) Statistics 2023*
- *URLHaus by abuse.ch — https://urlhaus.abuse.ch/*
- *UCI SMS Spam Collection — UCI Machine Learning Repository*
