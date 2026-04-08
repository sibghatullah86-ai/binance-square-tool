const fs = require("fs");

async function run() {
  try {
    console.log("DeepSeek se 8 articles mangwa raha hoon...");

    const response = await fetch("https://api.deepseek.com/chat/completions", {
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
            content: "You are a crypto news API. Return ONLY a plain JSON array of 8 news items. No talk, no markdown." 
          },
          { 
            role: "user", 
            content: "Write 8 short crypto news items. Format: [{\"title\":\"Headline\", \"content\":\"Short news\", \"category\":\"Bullish\"}]" 
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    // Check agar API ne error diya
    if (!data.choices || !data.choices[0]) {
      throw new Error("AI ne jawab nahi diya. Key ya Balance check karein.");
    }

    let text = data.choices[0].message.content.trim();
    // Safai: Backticks aur 'json' word hatana
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const articles = JSON.parse(text);
    
    // Exactly 8 articles ko process karna
    const finalData = articles.slice(0, 8).map(art => {
      let num = Math.floor(Math.random() * 3) + 1;
      let cat = art.category || "Bullish";
      return {
        title: art.title,
        content: `<img src="${cat}_${num}.jpg.png" style="width:100%; border-radius:10px; margin-bottom:10px;"><br>${art.content}`,
        category: cat
      };
    });

    fs.writeFileSync("data.json", JSON.stringify(finalData, null, 2));
    console.log("SUCCESS: 8 Articles Update Ho Gaye!");

  } catch (e) {
    console.log("ERROR: " + e.message);
    // Error ki surat mein ye dikhayega
    const errorBackup = [{
      title: "Market Analysis in Progress",
      content: "DeepSeek is busy. Please check if your API Key has balance. Refreshing soon...",
      category: "Bullish"
    }];
    fs.writeFileSync("data.json", JSON.stringify(errorBackup, null, 2));
  }
}

run();
