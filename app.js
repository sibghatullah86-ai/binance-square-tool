const fs = require("fs");

async function run() {
  try {
    // DeepSeek API calling using fetch (No extra library needed)
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}` // Name wahi rehne dein jo GitHub mein hai
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a crypto news expert. Return ONLY a JSON array." },
          { role: "user", content: "Write 5 short crypto news items. Format: [{\"title\":\"...\", \"content\":\"...\", \"category\":\"Bullish\"}]" }
        ]
      })
    });

    const data = await response.json();
    let text = data.choices[0].message.content.trim();
    
    // Markdown saaf karne ke liye
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const articles = JSON.parse(text);
    
    const finalData = articles.map(art => {
      let num = Math.floor(Math.random() * 3) + 1;
      return {
        title: art.title,
        content: `<img src="${art.category}_${num}.jpg.png" style="width:100%;border-radius:10px;"><br><br>${art.content}`,
        category: art.category
      };
    });

    fs.writeFileSync("data.json", JSON.stringify(finalData, null, 2));
    console.log("SUCCESS: DeepSeek AI News Updated!");

  } catch (e) {
    console.log("DeepSeek Error: " + e.message);
    const backup = [{
      title: "Market is being analyzed",
      content: "DeepSeek AI is fetching latest data. Refresh in a moment.",
      category: "Bullish"
    }];
    fs.writeFileSync("data.json", JSON.stringify(backup, null, 2));
  }
}
run();
