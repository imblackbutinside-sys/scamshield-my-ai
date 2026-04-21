require('dotenv').config();

const lang = 'Mandarin';
const inputData = 'https://chat.whatsapp.com/test';
const systemPrompt = `You are a cybersecurity analyst from ScamShield MY.
Analyze the input.
Respond ENTIRELY in ${lang}.
Output MUST be a raw JSON object with keys "status" (SCAM/SAFE/SUSPICIOUS), "reason" (in ${lang}), and "action" (in ${lang}).`;

fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `analyze URL: ${inputData}` }
        ],
        temperature: 0.1
    })
})
.then(r => r.json())
.then(j => {
    const fs = require('fs');
    fs.writeFileSync('out.json', j.choices[0].message.content, 'utf8');
})
.catch(console.error);
