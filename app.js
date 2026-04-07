const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // AI ko bata rahe hain ke news likhe aur images ke tags lagaye
    const prompt = `Write 8 short, engaging crypto news articles for Binance Square. 
    Categories: whale, sentiment, security, Bullish, Crash, Volatile.
    Each article must have ONE image tag like [IMG:category_num]. 
    Example: [IMG:whale_4] or [IMG:Crash_2].
    Output ONLY valid JSON format: [{"title": "...", "content": "..."}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json|```/g, "").trim();
    
    let articles = JSON.parse(text);
    
    // Ab images ke ajeeb naam fix karte hain
    articles = articles.map(art => {
        art.content = art.content.replace(/\[IMG:(.*?)\]/g, (match, tag) => {
            let [cat, num] = tag.split('_');
            let ext = ".jpg.png"; // Default jo aapne zyada tar rakha hai
            
            // Special cases jo aapne bataye the
            if (cat === "Crash" && ["1", "2", "3"].includes(num)) ext = ".jpg.jfif";
            if (cat === "Volatile" && num === "10") ext = ".jpg.jpeg";
            
            // Kyunki images bahar (root) par hain, rasta seedha hoga
            return `<img src="${cat}_${num}${ext}" class="article-img" alt="crypto-news">`;
        });
        return art;
    });

    fs.writeFileSync('data.json', JSON.stringify(articles, null, 2));
    console.log("AI Engine: Articles Updated in data.json!");
}

run().catch(console.error);
