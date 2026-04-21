# 🛡️ ScamShield MY — AI-Powered Scam & Fraud Detection Assistant

Sistem pengesanan scam & penipuan berkuasa AI yang menggabungkan **NLP + Cybersecurity + AI Explainability** — memenuhi sepenuhnya keperluan Problem Statement 1 Hackathon.

---

## 🎯 Pemetaan kepada Problem Statement Rasmi

| Keperluan PS1 | Penyelesaian ScamShield MY |
|---|---|
| ✅ Analyze Messages, Emails & Links | 4 modul: URL, Teks, Email, Phone/Acc Lookup |
| ✅ Process multiple channels real-time | Input dari WhatsApp, SMS, Email, URL dalam satu UI |
| ✅ Detect Scam Indicators via NLP | TF-IDF keyword scoring + Gemini LLM NLP analysis |
| ✅ Generate Real-Time Risk Scores | Skor 0–100% dengan meter visual |
| ✅ AI Explainability | Token highlighting: tunjuk PERKATAAN mana yang mencetuskan amaran scam |
| ✅ Cybersecurity focus | Pemetaan ancaman kepada 7 Lapisan OSI |
| ✅ Kaggle datasets | SMS Spam Collection + Phishing URL Dataset |

---

## 🧠 Seni Bina NLP (NLP Architecture) — WAJIB

Ini adalah komponen paling kritikal untuk Hackathon. Sistem menggunakan **3 lapisan NLP**:

### Lapisan 1: TF-IDF Keyword Pattern Matching (Rule-Based NLP)
Dilaksanakan **dalam browser** menggunakan JavaScript.
- Muatkan dataset kata scam yang disediakan (JSON, dibina daripada Kaggle SMS Spam Collection)
- Kira skor TF-IDF bagi setiap perkataan dalam input pengguna dalam konteks scam corpus
- Kata-kata yang mendapat skor tinggi = bakal penipuan
- **Tujuan kepada juri:** Tunjukkan bahawa pasukan faham teknik NLP asas yang digunakan di industri

### Lapisan 2: Sentiment & Urgency Analysis
Dilaksanakan dalam JavaScript menggunakan Urgency Lexicon (senarai kata).
- Kesan 4 taktik psikologi scammer: **Urgency** | **Fear** | **Authority** | **Greed**
- Setiap taktik memberi skor tambahan kepada Risk Score
- Contoh kata Urgency dalam BM: "segera", "hari ini juga", "masa terhad"

### Lapisan 3: Gemini API (LLM-based Deep NLP)
Panggilan API kepada Google Gemini untuk analisa mendalam.
- Prompt direkabentuk khas untuk kesan mesej scam Malaysia (dalam BM & BI)
- Gemini mengeluarkan: **Risk Score**, **Scam Category**, **Explanation** (dalam BM)
- **AI Explainability:** Gemini mengenal pasti dan senaraikan perkataan-perkataan atau frasa mencurigakan

```
┌─────────────────────────────────────────────────────────┐
│              PIPELINE NLP ScamShield MY                  │
│                                                          │
│  INPUT TEKS                                              │
│     │                                                    │
│     ▼                                                    │
│  [Lapisan 1] TF-IDF Scoring ──────────┐                 │
│     │    (JavaScript, Kaggle data)    │                  │
│     ▼                                 ▼                  │
│  [Lapisan 2] Urgency/Fear Analysis  Keyword Highlights   │
│     │    (Lexicon-based)             (Explainability)    │
│     ▼                                 │                  │
│  [Lapisan 3] Gemini LLM Analysis ─────┘                 │
│     │    (API Call)                                      │
│     ▼                                                    │
│  OUTPUT: Risk Score + Penjelasan + OSI Layer Map         │
└─────────────────────────────────────────────────────────┘
```

---

## 🗂️ Dataset Kaggle yang Digunakan

| Dataset | Sumber Kaggle | Kegunaan |
|---------|--------------|----------|
| **SMS Spam Collection** | `uciml/sms-spam-collection-dataset` | Bina TF-IDF corpus kata scam (5,500+ mesej) |
| **Phishing URL Dataset** | `shashwatwork/phishing-url-dataset` | Ciri-ciri URL phishing (domain age, SSL, path length) |
| **Synthetic Malaysia Scam** | Dibina pasukan (augmented) | Kata-kata scam dalam Bahasa Malaysia khusus |

> [!NOTE]
> Dataset Kaggle diproses dahulu (offline/pre-processing) menjadi fail `scam_corpus.json` yang ringan. Fail ini dimuat dalam browser tanpa perlukan server. Ini adalah teknik standard dalam industri untuk aplikasi NLP masa nyata (real-time).

---

## 🏗️ Seni Bina Sistem Penuh

```
┌──────────────────────── ScamShield MY ─────────────────────────┐
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  FRONTEND (Web App)                      │   │
│  │         HTML5 + Vanilla CSS + Vanilla JS                 │   │
│  │  ✓ Smartphone Lama  ✓ Desktop  ✓ Tablet (Semua Browser) │   │
│  └──────┬──────────────┬──────────────┬─────────────────────┘   │
│         │              │              │                          │
│         ▼              ▼              ▼                          │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────────────────┐  │
│  │  Modul 1   │ │   Modul 2    │ │        Modul 3           │  │
│  │ URL/Link   │ │ Teks Mesej   │ │   Phone/Account Lookup   │  │
│  │ Analyzer   │ │ Analyzer     │ │   (Semak Mule Dataset)   │  │
│  └──────┬─────┘ └──────┬───────┘ └────────────┬────────────┘  │
│         │              │                        │               │
│         └──────────────┴────────────────────────┘               │
│                             │                                    │
│                             ▼                                    │
│              ┌──────────────────────────────┐                   │
│              │  NLP PIPELINE (JS + API)     │                   │
│              │  1. TF-IDF Scoring           │                   │
│              │  2. Urgency/Sentiment Score  │                   │
│              │  3. Gemini LLM Analysis      │                   │
│              └──────────────┬───────────────┘                   │
│                             │                                    │
│                             ▼                                    │
│              ┌──────────────────────────────┐                   │
│              │   OUTPUT PANEL               │                   │
│              │  • Risk Score Meter (0-100%) │                   │
│              │  • Token Highlights (XAI)    │                   │
│              │  • OSI Layer Threat Map      │                   │
│              │  • Cadangan Tindakan         │                   │
│              └──────────────────────────────┘                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📦 Ciri-Ciri Terperinci (Feature Detail)

### 🔗 Modul 1: URL / Link Analyzer
**Input:** Pengguna tampal URL dari SMS/WhatsApp/Email

**Proses (NLP + Rule):**
- **Lexical Analysis:** Kesan typosquatting menggunakan Levenshtein distance (e.g., `maybânk.com` vs `maybank.com`)
- **Structural Features:** Bilangan subdomain, panjang URL, kehadiran IP dalam URL, kehadiran `@` dalam path
- **Keyword Check:** Kesan perkataan phishing dalam path URL (e.g., `/login`, `/verify`, `/secure`)
- **Domain Intelligence:** Semak domain age dari WhoisXML API (free)

**Output:**
- Risk Score URL
- Senarai faktor yang ditemui (explainability)
- OSI Layer yang terjejas: Lapisan 3 (Network Spoofing), Lapisan 6 (SSL Fake), Lapisan 7 (Phishing App)

---

### 💬 Modul 2: Teks Mesej Analyzer (NLP Utama)
**Input:** Pengguna tampal mesej penuh dari WhatsApp/SMS/Email

**Proses NLP:**
```
Teks Input
    │
    ├── [Preprocessing] Lowercase, tokenize, remove punctuation
    │
    ├── [TF-IDF Scoring] vs. scam_corpus.json (dari Kaggle SMS Spam)
    │       Keluarkan: top-N suspicious words dengan skor masing-masing
    │
    ├── [Urgency Lexicon] Cari kata-kata: urgency, fear, authority, greed
    │       BM: "segera", "akaun anda", "blok", "denda", "menang"
    │       BI: "urgent", "immediately", "verify", "suspended", "winner"
    │
    ├── [APK Detection] Cari ".apk", "muat turun", "install" + link
    │
    └── [Gemini API] Hantar teks → terima: score, kategori, penjelasan BM
```

**Output (AI Explainability):**
- **Teks yang disorot (highlighted):** Setiap perkataan mencurigakan diwarnakan merah/jingga dalam teks asal
- **Skor per kategori:** Urgency 87% | Fear 65% | Authority 40%
- **Risk Score Keseluruhan:** 0-100% dengan pengelasan: Selamat / Syak Wasangka / SCAM!
- **Penjelasan AI (dalam BM):** "Mesej ini mengandungi arahan mendesak untuk klik pautan dan maklumat bank. Ini adalah ciri-ciri utama penipuan 'Parcel Scam'."

---

### 📱 Modul 3: Phone / Account Lookup
**Input:** Nombor telefon atau nombor akaun bank

**Proses:**
- Semak dalam `synthetic_mule_database.json` (data rekaan berdasarkan kes sebenar)
- Paparkan rekod: "Dilaporkan X kali | Kategori: Keldai Akaun"
- Link ke portal rasmi semakmule.rmp.gov.my untuk pengesahan lanjut

---

### 🗺️ Modul 4: OSI Threat Map (UNIQUE VISUAL)
Selepas analisis, paparkan **diagram 7 lapisan OSI interaktif**.

```
Layer 7 - APPLICATION    [████████████] DISERANG ← Phishing Web / Scam App
Layer 6 - PRESENTATION   [███░░░░░░░░░] DISERANG ← SSL Palsu
Layer 5 - SESSION        [░░░░░░░░░░░░] SELAMAT
Layer 4 - TRANSPORT      [░░░░░░░░░░░░] SELAMAT
Layer 3 - NETWORK        [░░░░░░░░░░░░] SELAMAT
Layer 2 - DATA LINK      [░░░░░░░░░░░░] SELAMAT
Layer 1 - PHYSICAL       [░░░░░░░░░░░░] SELAMAT
```
- Lapisan "DISERANG" berwarna merah berkedip (pulsing glow animation)
- Klik pada lapisan untuk buka kad penerangan: "Apa yang scammer buat di lapisan ini?"
- Cadangan perlindungan khusus per lapisan

---

## 🛠️ Tech Stack Lengkap

| Komponen | Teknologi | Percuma? |
|----------|-----------|---------|
| **Frontend** | HTML5 + Vanilla CSS + Vanilla JS | ✅ |
| **LLM NLP** | Google Gemini 1.5 Flash API | ✅ Free Tier |
| **TF-IDF** | Dilaksana dalam JS (tiada library) | ✅ |
| **Domain Check** | WhoisXML API / URLScan.io | ✅ Free Tier |
| **Data Corpus** | Kaggle SMS Spam → JSON (preprocessed) | ✅ |
| **Font & Icons** | Google Fonts (Inter) + Phosphor Icons CDN | ✅ |
| **Hosting** | GitHub Pages | ✅ |

---

## 📅 Jadual Pembangunan (Seminggu Sebelum Submission)

| Hari | Tugasan | Ahli Pasukan Cadangan |
|------|---------|----------------------|
| **Hari 1** | Setup projek, UI shell, warna, layout responsif | UI Designer |
| **Hari 2** | Bina NLP engine (TF-IDF + Urgency Lexicon dalam JS) | Developer |
| **Hari 3** | Integrasikan Gemini API, bina Modul 1 (URL) + Modul 2 (Teks) | Developer |
| **Hari 4** | Bina Modul 3 (Phone) + Modul 4 (OSI Threat Map visual) | Developer |
| **Hari 5** | Preprosess dataset Kaggle jadi `scam_corpus.json`, uji semua | QA / Semua |
| **Hari 6** | Siapkan slide pembentangan, rakam video demo | Presenter |
| **Hari 7** | Buffer: debug, polish UI, hantar submission | Semua |

---

## ✅ Semakan Kriteria Juri

| Kriteria Juri | Status | Bukti |
|---|---|---|
| **Prototype Development** | ✅ | Web App berfungsi, boleh demo live |
| **Usability (UX)** | ✅ | Responsive, premium UI, mesra semua peranti |
| **Team Collaboration** | ✅ | Setiap modul boleh dibahagi per ahli |
| **Market Feasibility** | ✅ | RM2.77B kerugian scam Malaysia 2025 |
| **AI Integration** | ✅ | Gemini LLM + custom TF-IDF NLP |
| **AI Explainability** | ✅ | Token highlighting + per-category scoring |
| **NLP Usage** | ✅ | TF-IDF + Sentiment + LLM (3 lapisan NLP) |
| **Dataset dari Kaggle** | ✅ | SMS Spam Collection + Phishing URL Dataset |

> [!IMPORTANT]
> **Keputusan yang diperlukan sebelum coding:**
> 1. **Nama Aplikasi:** "ScamShield MY" — setuju atau ada cadangan lain?
> 2. **Tema Warna:** Merah/Hitam (genting/amaran) atau Biru/Gelap (rasmi/dipercayai)?
> 3. **Kunci API Gemini:** Siapa dalam pasukan yang akan dapatkan kunci Gemini API percuma dari [aistudio.google.com](https://aistudio.google.com)?
> 4. **Bahasa Output:** BM sahaja, atau dwibahasa (BM + BI)?

## Verification Plan
1. Uji mesej scam viral Malaysia (Parcel Scam, Kerja Sambilan RM500/hari) → mesti dapat skor >85%
2. Uji mesej biasa ("Hari ini kita makan kat mana?") → mesti dapat skor <10%
3. Uji URL scam yang dilaporkan Semak Mule → mesti flagged dengan betul
4. Pastikan UI cantik di telefon skrin kecil (360px)
5. Rakam video demo 3-5 minit
