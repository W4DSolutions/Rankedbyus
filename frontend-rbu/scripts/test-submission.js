// Using native fetch available in Node 18+

async function submitTool(tool) {
    try {
        const response = await fetch('http://localhost:3000/api/submit-tool', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tool),
        });
        const data = await response.json();
        if (response.ok) {
            console.log(`✅ Success: ${tool.name} submitted.`);
        } else {
            console.error(`❌ Failed: ${tool.name} - ${data.error}`);
        }
    } catch (error) {
        console.error(`❌ Error submitting ${tool.name}:`, error.message);
    }
}

async function runTests() {
    const tools = [
        {
            name: "Perplexity AI",
            website_url: "https://perplexity.ai",
            description: "AI-powered search engine that provides direct answers with citations.",
            category: "ai-chatbots",
            logo_url: "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128"
        },
        {
            name: "Midjourney",
            website_url: "https://midjourney.com",
            description: "Leading AI image generator known for high artistic quality.",
            category: "ai-image-generators",
            logo_url: "https://www.google.com/s2/favicons?domain=midjourney.com&sz=128"
        },
        {
            name: "Krea AI",
            website_url: "https://krea.ai",
            description: "Generative AI for high-quality image generation and real-time upscaling.",
            category: "ai-image-generators",
            logo_url: "https://www.google.com/s2/favicons?domain=krea.ai&sz=128"
        }
    ];

    console.log("🚀 Starting batch submission test...");
    for (const tool of tools) {
        await submitTool(tool);
    }
    console.log("🏁 Batch submission finished.");
}

runTests();
