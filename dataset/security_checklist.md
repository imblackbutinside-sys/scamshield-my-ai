# 🔐 ScamShield MY — Senarai Keselamatan Digital Penuh

Semua ciri ini akan diterapkan mengikut prinsip **Security by Design** — keselamatan dibina dari awal, bukan ditampal kemudian.

---

## KATEGORI A: Keselamatan Lapisan Pengangkutan (Layer 3–6 OSI)

### A1. HTTPS Enforced (Layer 6)
- Hosting di GitHub Pages / Netlify = HTTPS automatik
- Redirect semua HTTP → HTTPS secara paksa
- **Impak:** Elakkan MITM (Man-in-the-Middle) attack

### A2. HSTS — HTTP Strict Transport Security (Layer 6)
```html
<meta http-equiv="Strict-Transport-Security" 
      content="max-age=31536000; includeSubDomains">
```
- Memberitahu browser: "Jangan PERNAH sambung ke laman ini tanpa HTTPS"
- **Impak:** Elakkan SSL Stripping attack walaupun dalam WiFi awam Mamak

### A3. Secure External API Calls Only
- Semua API calls (Gemini, WhoisXML) wajib menggunakan `https://`
- Tiada `http://` dibenarkan walaupun untuk API
- **Impak:** Elakkan data API key bocor semasa transit

---

## KATEGORI B: Keselamatan Skrip & Kandungan (Layer 7 OSI)

### B1. Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  connect-src 'self' 
              https://generativelanguage.googleapis.com 
              https://www.whoisxmlapi.com
              https://urlscan.io;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data:;
  frame-ancestors 'none';
  form-action 'self';
  base-uri 'self';
">
```
- **Impak:** Hanya domain-domain yang disenaraikan boleh berkomunikasi. Tiada data bocor ke laman asing tidak dikenali.

### B2. Anti-XSS — Input & Output Sanitization
- Semua teks input pengguna **disanitize** sebelum dipaparkan
- TIADA penggunaan `innerHTML` dengan data pengguna
- Gunakan `textContent` atau fungsi sanitize custom untuk rendering
- Perkataan scam yang di-highlight menggunakan `<mark>` sahaja, bukan skrip dinamik
- **Impak:** Elakkan penyerang inject kod JavaScript melalui kotak input

### B3. Anti-Clickjacking
```html
<!-- Header -->
<meta http-equiv="X-Frame-Options" content="DENY">

<!-- JavaScript fallback -->
<script>
  if (window.top !== window.self) {
    document.body.innerHTML = '';
    window.top.location = window.self.location;
  }
</script>
```
- **Impak:** Elakkan app diembed dalam iframe palsu oleh pihak ketiga untuk tipu pengguna

### B4. Anti-MIME Sniffing
```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```
- **Impak:** Browser tidak akan "teka" jenis fail — elakkan fail teks dilarikan sebagai JavaScript

### B5. Referrer Policy
```html
<meta name="referrer" content="no-referrer">
```
- **Impak:** URL semasa tidak dihantar kepada laman luaran apabila pengguna klik pautan luar. Privasi terpelihara.

### B6. Permissions Policy (Feature Policy)
```html
<meta http-equiv="Permissions-Policy" 
      content="camera=(), microphone=(), geolocation=(), 
               payment=(), usb=(), bluetooth=()">
```
- **Impak:** Halang app daripada mengakses kamera, mikrofon, GPS yang tidak diperlukan langsung

---

## KATEGORI C: Keselamatan Data & Privasi

### C1. Zero Data Retention Policy
- Sistem **tidak menyimpan** sebarang teks yang dimasukkan pengguna
- Tiada database, tiada log server, tiada analytics tracker
- Setiap analisis dilakukan secara *stateless* — data hilang selepas tab ditutup
- **Impak:** Privasi pengguna terjamin 100%. Tiada risiko kebocoran data sensitif (e.g., kandungan mesej peribadi)

### C2. API Key — Memory-Only Storage
```javascript
// ❌ BAHAYA — kekal dalam browser
localStorage.setItem('key', apiKey);

// ⚠️ KURANG SELAMAT — hidup semasa tab terbuka sahaja
sessionStorage.setItem('key', apiKey);

// ✅ TERBAIK — hanya dalam RAM, hilang bila refresh
let GEMINI_API_KEY = null; // Pegang dalam variable JS sahaja
```
- **Impak:** Walaupun berlaku XSS, tiada API key tersimpan untuk dicuri

### C3. API Key Masking dalam UI
```javascript
// Tunjuk hanya 4 aksara terakhir dalam paparan
function maskKey(key) {
  return '••••••••••••••••' + key.slice(-4);
}
```
- **Impak:** Screenshare/demo depan juri tidak terdedah key penuh

### C4. Input Length Limiting
```javascript
const MAX_INPUT_LENGTH = 5000; // Hadkan teks input
if (input.length > MAX_INPUT_LENGTH) {
  showError("Teks terlalu panjang. Had: 5,000 aksara.");
  return;
}
```
- **Impak:** Elakkan serangan Memory Exhaustion / ReDoS (Regular Expression Denial of Service)

### C5. No Third-Party Trackers
- Tiada Google Analytics, Facebook Pixel, atau sebarang tracker tiga pihak
- Tiada cookie pihak ketiga
- **Impak:** Tiada profil pengguna dibina oleh pihak luar

---

## KATEGORI D: Keselamatan Sesi & Pengesahan

### D1. Rate Limiting pada API Calls
```javascript
const MIN_INTERVAL_MS = 3000; // Minimum 3 saat antara panggilan API
let lastCallTimestamp = 0;

function isRateLimited() {
  const now = Date.now();
  if (now - lastCallTimestamp < MIN_INTERVAL_MS) return true;
  lastCallTimestamp = now;
  return false;
}
```
- **Impak:** Elakkan penyalahgunaan API key (quota exhaustion attack)

### D2. API Call Counter & Quota Warning
```javascript
let apiCallCount = 0;
const DAILY_SOFT_LIMIT = 50;

if (apiCallCount >= DAILY_SOFT_LIMIT) {
  showWarning("Had penggunaan harian hampir dicapai. Jimat untuk demo.");
}
```
- **Impak:** Elakkan quota Gemini habis tiba-tiba semasa demo Hackathon

### D3. Request Abort Controller
```javascript
let currentController = null;

function analyzeText(text) {
  if (currentController) currentController.abort(); // Batalkan request lama
  currentController = new AbortController();
  fetch(apiUrl, { signal: currentController.signal, ... });
}
```
- **Impak:** Elakkan race condition dan response daripada request yang telah lapuk diproses

### D4. Anti-Double Submit
```javascript
let isAnalyzing = false;

analyzeBtn.addEventListener('click', () => {
  if (isAnalyzing) return; // Halang klik berganda
  isAnalyzing = true;
  // ... buat analisis ...
  isAnalyzing = false;
});
```
- **Impak:** Elakkan pengulangan panggilan API atau pengiriman data berganda

---

## KATEGORI E: Keselamatan Output & Paparan

### E1. URL Output Sanitization
- Semua URL yang dipaparkan dalam hasil analisis tidak boleh dijadikan hyperlink aktif secara langsung tanpa amaran
- Tunjukkan URL dalam `<code>` block, bukan `<a href>`
- Kalau perlu link, buka dengan `rel="noopener noreferrer"`
```html
<a href="..." target="_blank" rel="noopener noreferrer nofollow">
```
- **Impak:** Elakkan "Reverse Tabnapping" — tab lama dikawal oleh tab baru yang dibuka

### E2. Autocomplete Off untuk Input Sensitif
```html
<input type="password" autocomplete="off" spellcheck="false">
<textarea autocomplete="off" spellcheck="false"></textarea>
```
- **Impak:** Browser tidak cache atau autosuggest teks scam yang dimasukkan pengguna

### E3. Copy Protection untuk API Key Field
```javascript
apiKeyInput.addEventListener('copy', (e) => {
  e.preventDefault(); // Halang copy API key dari field
});
```

### E4. Clear on Unload
```javascript
window.addEventListener('beforeunload', () => {
  GEMINI_API_KEY = null;    // Clear API key dari memory
  resultContainer.innerHTML = ''; // Clear hasil analisis
  textInput.value = '';     // Clear input
});
```
- **Impak:** Tiada data sensitif tertinggal apabila pengguna tutup tab

---

## KATEGORI F: Keselamatan Rangkaian & Permintaan API

### F1. API Response Validation
```javascript
async function callGeminiApi(text) {
  const response = await fetch(url, options);
  
  // Validasi response sebelum proses
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('Response bukan JSON yang sah');
  }
  
  const data = await response.json();
  // Validasi struktur data yang dijangka
  if (!data?.candidates?.[0]?.content) {
    throw new Error('Struktur response tidak sah');
  }
}
```
- **Impak:** Elakkan JSON Injection / Unexpected API response exploitation

### F2. Timeout pada Semua API Calls
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 saat

fetch(url, { signal: controller.signal })
  .finally(() => clearTimeout(timeoutId));
```
- **Impak:** Elakkan app "hang" kalau server lambat atau tidak responsif

### F3. Error Message Sanitization
```javascript
// ❌ Jangan tunjuk error teknikal kepada pengguna
catch(e) { showError(e.message); } // Mungkin dedahkan maklumat dalaman

// ✅ Paparkan mesej mesra pengguna sahaja
catch(e) {
  console.error(e); // Log untuk developer sahaja
  showError("Analisis tidak dapat diselesaikan. Sila cuba lagi.");
}
```
- **Impak:** Elakkan Information Disclosure — error message tidak bocorkan maklumat dalaman API

---

## KATEGORI G: Ciri Keselamatan Khusus ScamShield (UX Security)

### G1. "Safe Preview" sebelum Klik URL
- Tunjukkan expanded URL sebelum pengguna diarah ke luar
- Paparkan amaran: "Anda akan meninggalkan ScamShield MY. Adakah anda pasti?"

### G2. Visual Trust Indicator
- Badge hijau "✓ Analisis Selesai — Tiada Data Disimpan" selepas setiap scan
- Tunjukkan masa analisis dalam milisaat — bukti ia diproses secara tempatan

### G3. Anti-Phishing Marker untuk App Sendiri
- URL bar hint: Ajar pengguna kenali URL rasmi app mereka
- Watermark visual yang susah dipalsukan dalam UI

### G4. Offline Mode Indicator
- Browser tidak perlu online untuk TF-IDF analisis (Lapisan 1 NLP)
- Tunjukkan badge "Mode Luar Talian — Analisis Asas Aktif" apabila tiada internet

---

## 📊 Ringkasan: Pemetaan ke Lapisan OSI

| OSI Layer | Nama | Ciri Keselamatan Diterapkan |
|-----------|------|-----------------------------|
| **Layer 7** | Application | CSP, Anti-XSS, Anti-Clickjacking, Input Sanitization, Rate Limiting |
| **Layer 6** | Presentation | HTTPS, HSTS, MIME Sniffing Protection, TLS Only |
| **Layer 5** | Session | API Key Memory-Only, Anti-Double Submit, Request Abort, Clear on Unload |
| **Layer 4** | Transport | HTTPS (TLS 1.3), Request Timeout, Abort Controller |
| **Layer 3** | Network | HTTPS enforced, CSP connect-src whitelist |
| **Layer 2** | Data Link | HSTS (elakkan downgrade di WiFi Mamak) |
| **Layer 1** | Physical | (Di luar skop web app — educate pengguna sahaja) |

---

## ✅ Checklist Keselamatan (untuk semak sebelum submission)

- [ ] HTTPS aktif (GitHub Pages auto-HTTPS)
- [ ] CSP `<meta>` tag dipasang
- [ ] Anti-Clickjacking aktif (`X-Frame-Options: DENY`)
- [ ] Tiada `innerHTML` dengan data pengguna
- [ ] API key dalam memory sahaja (bukan localStorage)
- [ ] Rate limiter aktif (3 saat antara panggilan)
- [ ] Timeout pada semua API calls (10 saat)
- [ ] Error messages tidak mendedahkan maklumat teknikal
- [ ] Semua external links ada `rel="noopener noreferrer"`
- [ ] `autocomplete="off"` pada semua input field
- [ ] Clear data semasa `beforeunload`
- [ ] Tiada tracker pihak ketiga
- [ ] Input length had dipasang
- [ ] Response validation sebelum proses data API
