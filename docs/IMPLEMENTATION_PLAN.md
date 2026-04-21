# Complete Dataset Integration (Fraud & Email Phishing)

You requested to integrate and activate all remaining datasets, especially the highly critical `Fraud Detection Dataset`. Since this dataset encompasses two distinct entities (Emails and Financial Transactions), we need to make architectural changes to both the *frontend* and *backend* to allow users to directly scan transactions or full emails.

## Proposed Changes

---

### User Interface (Frontend)

#### [MODIFY] public/index.html
- Add **two** new option dropdowns/tabs into the main selection panel:
  - `Email (Full Text)`
  - `Financial Transaction ID (Fraud Check)`

#### [MODIFY] public/app.js
- Introduce multi-language translations (i18n) for the "Email" and "Transaction" input placeholders.
- If the user selects "Email", placeholder: *"Paste full email text or header..."*
- If the user selects "Transaction", placeholder: *"Enter Transaction ID (Example: 1, 9, 49, etc)..."*

---

### Main Routing Engine (Backend / API Gateway)

#### [MODIFY] server.js
- **Database Memory Load:** During system boot-up, in addition to `URLHaus` and `SMS Spam`, we will read:
  1. `fraud_indicators.csv` (Mapping `TransactionID` to a Fraud indicator of 1 or 0).
  2. This gives us ~1,000 baseline Transaction ID mappings stored in `Map()`.
- **New Endpoints in `/api/scan`:**
  - `if (type === 'transaction')`: The system will perform a lightning-fast O(1) Local DB lookup. If the inputted ID matches the indicator `1` in `fraud_indicators.csv`, return **STATUS: SCAM**. If `0`, return SAFE.
  - `if (type === 'email')`: We will use a hybrid AI approach. Since the `cleanformodels.csv` file spans 54MB (making exact string-matching slow and resource-heavy), the email payload will be routed *directly* to the Groq Llama-3 AI. Llama-3 will receive a specialized expert *system prompt* tailored toward identifying phishing and social engineering semantics.

## Open Questions

> [!IMPORTANT]
> **1. Email Analysis Approach:** Do you agree with the plan where email payloads are relayed straight to Llama-3 AI, whereas the Transaction IDs are queried locally? The email CSV dataset (54MB) is too large to practically load into memory for real-time frontend mapping.
> **2. Transaction Flow:** The user will enter numerical Transaction IDs (like: 12, 19, 49) because your *Fraud* CSV maps against `TransactionID`. Is this simulated flow appropriate for your hackathon presentation purposes? 

Please verify this plan and let me know if we can proceed with execution!
