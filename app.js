const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    // Flash model naye accounts ke liye behtar hai
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Write 5 short crypto news articles. Return ONLY a plain JSON array. Example: [{\"title\":\"News Title\", \"content\":\"Short news text\", \"category\":\"Bullish\"}]";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Kabhi kabhi AI extra characters bhej deta hai, unhein saaf karne ke liye:
    text = text.replace(/```json/g, "").replace(/```/g, "");
    
    const articles = JSON.parse(text);
    
    // Images ke naam sahi match karne ke liye .jpg.png extension
    const finalData = articles.map(art => {
      let num = Math.floor(Math.random() * 3) + 1; // 1 se 3 tak koi bhi image
      return {
        title: art.title,
        content: `<img src="${art.category}_${num}.jpg.png" class="article-img" onerror="this.style.display='none'"><br>${art.content}`,
        category: art.category
      };
    });

    fs.writeFileSync("data.json", JSON.stringify(finalData, null, 2));
    console.log("SUCCESS: Asli AI News Update Ho Gayi!");

  } catch (e) {
    console.log("AI Error: " + e.message);
    // Agar AI fail ho toh ye backup dikhayega
    const backup = [{
      title: "Market is Stable Today",
      content: "AI is currently fetching more deep insights. Check back in a few minutes.",
      category: "Bullish"
    }];
    fs.writeFileSync("data.json", JSON.stringify(backup, null, 2));
  }
}
run();
