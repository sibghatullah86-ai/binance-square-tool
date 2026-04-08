const fs = require("fs");

async function run() {
  try {
    console.log("DeepSeek AI se news mangwa raha hoon...");

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { 
            role: "system", 
            content: "You are a crypto news expert. Return ONLY a plain JSON array. No markdown, no backticks." 
          },
          { 
            role: "user", 
            content: "Write 5 short crypto news items. Format: [{\"title\":\"...\", \"content\":\"...\", \"category\":\"Bullish\"}]" 
          }
        ]
      })
    });

    const data = await response.json();
    
    // Yahan hum check kar rahe hain ke response sahi aaya ya nahi
    if (!data.choices || !data.choices[0]) {
      throw new Error("AI ne sahi format mein jawab nahi diya.");
    }

    let text = data.choices[0].message.content.trim();
    
    // Safai: Backticks aur extra words hatana
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const articles = JSON.parse(text);
    
    const finalData = articles.map(art => {
      let num = Math.floor(Math.random() * 3) + 1;
      return {
        title: art.title,
        content: `<img src="${art.category}_${num}.jpg.png" style="width:100%; border-radius:10px; margin-bottom:10px;"><br>${art.content}`,
        category: art.category
      };
    });

    fs.writeFileSync("data.json", JSON.stringify(finalData, null, 2));
    console.log("SUCCESS: DeepSeek AI News Updated!");

  } catch (e) {
    console.log("DeepSeek Error: " + e.message);
    const backup = [{
      title: "Market Analysis in Progress",
      content: "DeepSeek is updating the latest trends. Please refresh shortly.",
      category: "Bullish"
    }];
    fs.writeFileSync("data.json", JSON.stringify(backup, null, 2));
  }
}

run();
