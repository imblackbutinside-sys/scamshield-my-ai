require('dotenv').config();

async function debugTamil() {
    const lang = 'Tamil';
    const inputData = 'URGENT: Legal notice against your income tax return 2026. If you fail to cooperate you will be arrested.';
    
    // PROMPT BAHARU - lebih pendek, paksa jawapan ringkas
    const systemPrompt = `You are a cybersecurity expert. Analyze the input for scam/phishing.
Respond ONLY with a JSON object: {"status": "SCAM" or "SAFE" or "SUSPICIOUS", "reason": "<short explanation in ${lang}>", "action": "<short advice in ${lang}>"}
Keep reason and action under 30 words each. Use ${lang} script only.`;

    const userPrompt = `Analyze this email for scam: "${inputData}"`;

    // Test dengan tokens lebih tinggi
    for (const tokens of [800, 1200, 2000]) {
        console.log(`\n--- Testing max_tokens: ${tokens} ---`);
        const groqPayload = {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.1,
            max_tokens: tokens,
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

        if (!response.ok) {
            const errBody = await response.json();
            console.log(`FAIL (${response.status}):`, errBody.error?.code);
            console.log("Failed generation preview:", errBody.error?.failed_generation?.substring(0, 200));
        } else {
            const result = await response.json();
            console.log("SUCCESS! Output:", result.choices[0].message.content);
            console.log("Tokens used:", result.usage?.completion_tokens);
            break;
        }
    }
}

debugTamil().catch(console.error);
