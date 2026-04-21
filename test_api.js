async function testApi() {
    try {
        const response = await fetch('http://localhost:3000/api/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'url',
                data: 'goog1e.com',
                lang: 'Malay'
            })
        });
        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('API Test Failed:', e);
    }
}

testApi();
