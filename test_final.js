async function testApi() {
    try {
        const testUrls = [
            'https://mail.google.com/mail/u/1/?ogbl#spam/FMfcgzQgLFrClvRcbMPghCldFBsHLDnJ', // Whitelist test
            'https://maybank2u.com.my', // Whitelist + ReferenceError test
            'http://maybank-verify-id.com' // Scam detailed analysis test
        ];
        
        for (const url of testUrls) {
            console.log(`\n--- Testing: ${url} ---`);
            const response = await fetch('http://localhost:3000/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'url', data: url, lang: 'Malay' })
            });
            const data = await response.json();
            console.log('Response:', JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error('API Test Failed:', e);
    }
}

testApi();
