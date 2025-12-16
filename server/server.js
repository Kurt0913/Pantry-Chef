// server.js (Robust Free Mode)
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "Pantry Chef",
  }
});

// A larger list of free models to try
const MODELS = [
  "google/gemini-2.0-flash-exp:free",       // 1. Google Gemini 2 (Newest)
  "google/gemini-exp-1206:free",            // 2. Google Experimental
  "meta-llama/llama-3.2-3b-instruct:free",  // 3. Meta Llama 3.2 (Fast)
  "microsoft/phi-3-mini-128k-instruct:free",// 4. Microsoft Phi
  "huggingfaceh4/zephyr-7b-beta:free",      // 5. Zephyr (Reliable Backup)
  "mistralai/mistral-7b-instruct:free",     // 6. Mistral 7B
];

app.post('/generate-recipe', async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients) return res.status(400).send({ error: "No ingredients provided" });

  console.log(`\n--- NEW REQUEST: ${ingredients} ---`);
  let lastError = null;

  for (const modelName of MODELS) {
    try {
      console.log(`Attempting with: ${modelName}...`);
      
      const completion = await openai.chat.completions.create({
        model: modelName,
        messages: [
          { 
            role: "system", 
            content: "You are a professional chef. Respond ONLY with a valid JSON object containing: 'title', 'description', 'ingredients_list' (array of strings), 'instructions' (array of strings). Do not use markdown." 
          },
          { 
            role: "user", 
            content: `Create a recipe using: ${ingredients}` 
          }
        ],
      });

      const aiResponse = completion.choices[0].message.content;
      
      // Clean up markdown just in case
      const cleanJson = aiResponse.replace(/```json|```/g, '').trim();
      
      // Verify it is actual JSON before sending
      const recipeData = JSON.parse(cleanJson);
      
      console.log(`✅ SUCCESS! Served by ${modelName}`);
      return res.json(recipeData); 

    } catch (error) {
      // Log the specific error for this model (404, 429, etc)
      console.log(`❌ Failed (${modelName}): ${error.status || error.message}`);
      lastError = error;
    }
  }

  // If we reach here, literally everyone failed
  console.log("💥 All models failed.");
  res.status(500).send({ 
    error: "All chefs are busy. Please try again in 1 minute.", 
    details: lastError ? lastError.message : "Global outage"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});