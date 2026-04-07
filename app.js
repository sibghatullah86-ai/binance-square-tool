const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Aapki API Key yahan env se khud ba khud uthayega robot
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    // Hum "gemini-pro" use kar rahe hain kyunki ye har key par chalta hai
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Write 8 crypto news articles for Binance Square. Return ONLY a JSON array. Each object: {title, content, category (whale, sentiment, security, Bullish, Crash, Volatile)}.";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    
    const articles = JSON.parse(text);
    const finalData = articles.map(art => {
      let num = Math.floor(Math.random() * 10) + 1;
      return {
        title: art.title,
        content: `<img src="${art.category}_${num}.png" class="article-img" onerror="this.style.display='none'">${art.content}`,
        category: art.category
      };
    });

    fs.writeFileSync("data.json", JSON.stringify(finalData, null, 2));
    console.log("SUCCESS: AI News Updated!");

  } catch (e) {
    console.log("AI Error! Writing Backup News...");
    const backup = [{
      title: "Market Update: Trading Volume Increasing",
      content: "Crypto markets are seeing high activity today. Stay tuned for more updates.",
      category: "Bullish"
    }];
    fs.writeFileSync("data.json", JSON.stringify(backup, null, 2));
  }
}
run();
