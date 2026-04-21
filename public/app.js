const UI_LANG = {
    'Malay': {
        subtitle: 'Enjin Penganalisis Kebarangkalian Scam',
        tabUrl: 'Pautan (URL)',
        tabMsg: 'Mesej',
        tabPhone: 'Nombor',
        tabEmail: 'E-mel',
        tabFinancial: 'Transaksi',
        placeholderUrl: 'Masukkan URL yang mencurigakan di sini...',
        placeholderMsg: 'Tampal (paste) mesej scam di sini...',
        placeholderPhone: 'Contoh: +60123456789',
        placeholderEmail: 'Tampal teks e-mel penuh...',
        placeholderFinancial: 'ID Transaksi (Cth: 12, 49)...',
        scanBtn: 'IMBAS SEKARANG',
        loader: 'Sedang Menganalisis dengan Enjin AI...',
        footer: 'Dikuasakan oleh <strong>MuleRouter Gateway</strong> & AI',
        reasonLabel: 'SEBAB',
        actionLabel: 'TINDAKAN',
        alertEmpty: 'Sila masukkan data terlebih dahulu!',
        statusScam: 'AMARAN SCAM',
        statusSafe: 'SELAMAT / TIADA ANCAMAN',
        statusSuspicious: 'MENCURIGAKAN'
    },
    'English': {
        subtitle: 'Scam Probability Analysis Engine',
        tabUrl: 'Link (URL)',
        tabMsg: 'Message',
        tabPhone: 'Number',
        tabEmail: 'Email',
        tabFinancial: 'Transaction',
        placeholderUrl: 'Enter suspicious URL here...',
        placeholderMsg: 'Paste scam message here...',
        placeholderPhone: 'Example: +60123456789',
        placeholderEmail: 'Paste full email text...',
        placeholderFinancial: 'Transaction ID (e.g. 12, 49)...',
        scanBtn: 'SCAN NOW',
        loader: 'Analyzing with AI Engine...',
        footer: 'Powered by <strong>MuleRouter Gateway</strong> & AI',
        reasonLabel: 'REASON',
        actionLabel: 'ACTION',
        alertEmpty: 'Please enter data first!',
        statusScam: 'SCAM DETECTED',
        statusSafe: 'SAFE / SECURE',
        statusSuspicious: 'SUSPICIOUS'
    },
    'Mandarin': {
        subtitle: '诈骗概率分析引擎',
        tabUrl: '链接 (URL)',
        tabMsg: '消息',
        tabPhone: '号码',
        tabEmail: '电子邮件',
        tabFinancial: '交易',
        placeholderUrl: '在此处输入可疑网址...',
        placeholderMsg: '在此处粘贴诈骗消息...',
        placeholderPhone: '例如: +60123456789',
        placeholderEmail: '粘贴完整的电子邮件文本...',
        placeholderFinancial: '交易ID (例如: 12, 49)...',
        scanBtn: '立即扫描',
        loader: '正在通过AI引擎分析...',
        footer: '由 <strong>MuleRouter Gateway</strong> 和 AI 提供支持',
        reasonLabel: '原因',
        actionLabel: '行动',
        alertEmpty: '请先输入数据！',
        statusScam: '检测到诈骗活动',
        statusSafe: '安全 / 无威胁',
        statusSuspicious: '可疑链接或消息'
    },
    'Tamil': {
        subtitle: 'மோசடி சாத்தியக்கூறு பகுப்பாய்வு இயந்திரம்',
        tabUrl: 'இணைப்பு (URL)',
        tabMsg: 'செய்தி',
        tabPhone: 'எண்',
        tabEmail: 'மின்னஞ்சல்',
        tabFinancial: 'பரிவர்த்தனை',
        placeholderUrl: 'சந்தேகத்திற்குரிய URL ஐ இங்கே உள்ளிடவும்...',
        placeholderMsg: 'மோசடி செய்தியை இங்கே ஒட்டவும்...',
        placeholderPhone: 'உதாரணம்: +60123456789',
        placeholderEmail: 'மின்னஞ்சல் உரையை ஒட்டவும்...',
        placeholderFinancial: 'பரிவர்த்தனை ஐடி (எ.கா: 12, 49)...',
        scanBtn: 'இப்போது ஸ்கேன் செய்',
        loader: 'AI இயந்திரம் மூலம் பகுப்பாய்வு செய்யப்படுகிறது...',
        footer: '<strong>MuleRouter Gateway</strong> & AI மூலம் இயக்கப்படுகிறது',
        reasonLabel: 'காரணம்',
        actionLabel: 'செயல்',
        alertEmpty: 'முதலில் தரவை உள்ளிடவும்!',
        statusScam: 'மோசடி கண்டறியப்பட்டது',
        statusSafe: 'பாதுகாப்பானது',
        statusSuspicious: 'சந்தேகத்திற்குரியது'
    },
    'Arabic': {
        subtitle: 'محرك تحليل احتمالية الاحتيال',
        tabUrl: 'رابط (URL)',
        tabMsg: 'رسالة',
        tabPhone: 'رقم',
        tabEmail: 'بريد إلكتروني',
        tabFinancial: 'معاملة',
        placeholderUrl: 'أدخل الرابط المشبوه هنا...',
        placeholderMsg: 'ألصق رسالة الاحتيال هنا...',
        placeholderPhone: 'مثال: +60123456789',
        placeholderEmail: 'الصق نص البريد الإلكتروني...',
        placeholderFinancial: 'معرف المعاملة (مثل: 12, 49)...',
        scanBtn: 'امسح الآن',
        loader: 'جاري التحليل بواسطة محرك الذكاء الاصطناعي...',
        footer: 'مشغل بواسطة <strong>MuleRouter Gateway</strong> والذكاء الاصطناعي',
        reasonLabel: 'السبب',
        actionLabel: 'إجراء',
        alertEmpty: 'الرجاء إدخال البيانات أولاً!',
        statusScam: 'تم اكتشاف احتيال',
        statusSafe: 'آمن / محمي',
        statusSuspicious: 'مشبوه'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const scanInput = document.getElementById('scan-input');
    const scanBtn = document.getElementById('scan-btn');
    const loader = document.getElementById('loader');
    const resultBox = document.getElementById('result-box');
    const resultStatus = document.getElementById('result-status');
    const resultContent = document.getElementById('result-content');
    const langSelect = document.getElementById('lang-select');

    let currentScanType = 'url'; // default

    // Force Malay as default on startup
    if (langSelect) {
        langSelect.value = 'Malay';
    }

    function applyTranslations() {
        const lang = langSelect ? langSelect.value : 'Malay';
        const t = UI_LANG[lang] || UI_LANG['Malay'];

        document.getElementById('i18n-subtitle').textContent = t.subtitle;
        document.getElementById('i18n-taburl').textContent = t.tabUrl;
        document.getElementById('i18n-tabmsg').textContent = t.tabMsg;
        document.getElementById('i18n-tabphone').textContent = t.tabPhone;
        document.getElementById('i18n-tabemail').textContent = t.tabEmail;
        document.getElementById('i18n-tabfinancial').textContent = t.tabFinancial;
        document.getElementById('i18n-scanbtn').textContent = t.scanBtn;
        document.getElementById('i18n-loader').textContent = t.loader;
        document.getElementById('i18n-footer').innerHTML = t.footer;

        if(currentScanType === 'url') scanInput.placeholder = t.placeholderUrl;
        if(currentScanType === 'message') scanInput.placeholder = t.placeholderMsg;
        if(currentScanType === 'phone') scanInput.placeholder = t.placeholderPhone;
        if(currentScanType === 'email') scanInput.placeholder = t.placeholderEmail;
        if(currentScanType === 'financial') scanInput.placeholder = t.placeholderFinancial;
    }

    if (langSelect) {
        langSelect.addEventListener('change', applyTranslations);
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentScanType = btn.getAttribute('data-type');
            applyTranslations();
            resultBox.classList.add('hidden');
        });
    });

    scanBtn.addEventListener('click', async () => {
        const inputData = scanInput.value.trim();
        const langCode = langSelect ? langSelect.value : 'Malay';
        const t = UI_LANG[langCode] || UI_LANG['Malay'];
        
        if(!inputData) {
            alert(t.alertEmpty);
            return;
        }

        loader.classList.remove('hidden');
        resultBox.classList.add('hidden');
        resultBox.className = 'result-box hidden';

        try {
            const response = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: currentScanType, data: inputData, lang: langCode })
            });

            const resData = await response.json();
            loader.classList.add('hidden');

            if(resData.success) {
                const status = resData.status;
                const reasonText = resData.reason || "";
                const actionText = resData.action || "";
                
                let statusWord = status.toLowerCase();
                let statusIcon = status === 'SCAM' ? '<ion-icon name="warning"></ion-icon> ' : '';
                
                if(status === 'SCAM') {
                    resultStatus.innerHTML = `${statusIcon}${t.statusScam}`;
                } else if (status === 'SAFE') {
                    resultStatus.innerHTML = `<ion-icon name="checkmark-circle"></ion-icon> ${t.statusSafe}`;
                } else {
                    statusWord = 'suspicious';
                    resultStatus.innerHTML = `<ion-icon name="alert-circle"></ion-icon> ${t.statusSuspicious}`;
                }

                resultBox.className = `result-box ${statusWord}`;
                
                const cleanReason = reasonText.replace(/^(SEBAB|REASON|ANALYSIS|原因|காரணம்|السبب):\s*/i, '');
                const cleanAction = actionText.replace(/^(TINDAKAN|ACTION|行动|செயல்|إجراء):\s*/i, '');

                resultContent.innerHTML = `
                    <div style="margin-top: 10px;">
                        <p style="margin-bottom: 8px; line-height: 1.5;">
                            <strong style="color: var(--neon-green); text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px;">${t.reasonLabel}:</strong><br>
                            <span style="color: #fff; font-size: 0.95rem;">${cleanReason}</span>
                        </p>
                        <p style="line-height: 1.5;">
                            <strong style="color: var(--neon-green); text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px;">${t.actionLabel}:</strong><br>
                            <span style="color: #fff; font-size: 0.95rem;">${cleanAction}</span>
                        </p>
                    </div>
                `;
            } else {
                resultBox.className = 'result-box scam';
                resultStatus.innerText = 'SYSTEM ERROR';
                resultContent.textContent = resData.error || 'Gateway Error.';
            }
        } catch (error) {
            loader.classList.add('hidden');
            resultBox.className = 'result-box scam';
            resultStatus.innerText = 'NETWORK ERROR';
            resultContent.textContent = 'Failed to connect to AI Gateway.';
        }
    });

    scanInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') scanBtn.click(); });
    applyTranslations();
}); 
