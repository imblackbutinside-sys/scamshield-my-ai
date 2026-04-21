require('dotenv').config();

async function testTamil() {
    const lang = 'Tamil';
    const inputData = 'You won a lottery of 1 million dollars. Click the link to claim https://scam-lottery.com';
    const type = 'email';
    const userPrompt = `Please functionally analyze this email text/subject for Phishing, Scam, or Social Engineering elements based on typical phishing databases: "${inputData}"`;
    
    const systemPrompt = `You are a cybersecurity analyst from ScamShield MY.
Analyze the input.
Respond ENTIRELY in ${lang}.
Output MUST be a raw JSON object with keys "status" (SCAM/SAFE/SUSPICIOUS), "reason" (in ${lang}), and "action" (in ${lang}).`;

    const groqPayload = {
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: "json_object" }
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(groqPayload)
    });

    const result = await response.json();
    console.log("Raw LLM output:\n" + result.choices[0].message.content);
}

testTamil();
