require('dotenv').config();
const key = process.env.GROQ_API_KEY;

console.log("Testing Key:", key ? key.substring(0, 7) + "..." : "MISSING");

async function test() {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: "hi" }]
            })
        });
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
