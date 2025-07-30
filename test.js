const axios = require('axios');

(async () => {
const data = (await axios.post("https://ai.hackclub.com/chat/completions",
    {
      messages: [{
        role:"user",
        content: "Come up with project concept using these technologies: Django, MySQL, C#.With features: User Profiles & Settings, Advanced Search, User Authentication. Project vision and goals: make it super cool. Please provide a comprehensive app concept including: 1. A catchy, memorable app name 2. Clear target audience and market positioning 3. Core value proposition and unique selling points 4. Detailed feature breakdown and user experience                5. Technical architecture overview 6. Monetization strategy 7. Potential challenges and solutions 8. Market opportunity and competitive advantages Format the response with clear headings and make it engaging and professional, don't continue the conversation."
      }]
    }, { headers: {
        "Content-Type": "application/json",
      }})).data
      console.log(data.choices[0].message.content);
})()