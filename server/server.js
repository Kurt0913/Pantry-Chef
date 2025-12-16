// server.cjs - The "Hidden Gems" Edition
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


const MODELS = [ "nvidia/nemotron-3-nano-30b-a3b:free", "mistralai/devstral-2512:free", "amazon/nova-2-lite-v1:free",
  "arcee-ai/trinity-mini:free", "tngtech/tng-r1t-chimera:free", "allenai/olmo-3-32b-think:free", "kwaipilot/kat-coder-pro:free",
  "nvidia/nemotron-nano-12b-v2-vl:free", "alibaba/tongyi-deepresearch-30b-a3b:free", "nvidia/nemotron-nano-9b-v2:free",
  "openai/gpt-oss-120b:free", "openai/gpt-oss-20b:free", "z-ai/glm-4.5-air:free", "qwen/qwen3-coder:free", "moonshotai/kimi-k2:free", "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
  "google/gemma-3n-e2b-it:free"
];

// --- 🛡️ THE SAFETY NET (Your 100% Guarantee) ---
const BACKUP_RECIPE = {
  title: "Emergency 'Pantry Special' Stir-Fry",
  description: "The AI chefs are currently swamped with requests, but here is a foolproof recipe for your ingredients!",
  ingredients_list: [
    "Your main protein (chicken, beef, tofu, or eggs)",
    "Any vegetables (broccoli, carrots, onions)",
    "Soy sauce, garlic, and oil",
    "Rice or noodles"
  ],
  instructions: [
    "Heat oil in a pan over high heat.",
    "Cook protein until browned and set aside.",
    "Stir-fry vegetables until tender.",
    "Combine everything with soy sauce and garlic.",
    "Serve over rice or noodles."
  ]
};

app.post('/api/generate-recipe', async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients) return res.status(400).send({ error: "No ingredients provided" });

  console.log(`\n--- NEW REQUEST: ${ingredients} ---`);

  for (const modelName of MODELS) {
    try {
      console.log(`Attempting with: ${modelName}...`);
      
      // 🔧 CRITICAL FIX: Merge System Prompt
      // Google models (and some new ones) hate the "system" role.
      // We force everything into a single "user" message.
      const completion = await Promise.race([
        openai.chat.completions.create({
          model: modelName,
          messages: [
            { 
              role: "user", 
              content: `
                SYSTEM: You are a professional chef. Respond ONLY with a valid JSON object.
                FORMAT: { "title": "String", "description": "String", "ingredients_list": ["String"], "instructions": ["String"] }.
                USER: Create a recipe using: ${ingredients}
              ` 
            }
          ],
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000))
      ]);

      const aiResponse = completion.choices[0].message.content;
      const cleanJson = aiResponse.replace(/```json|```/g, '').trim();
      
      // Validation check
      if (!cleanJson.startsWith('{')) throw new Error("Invalid JSON format");
      
      const recipeData = JSON.parse(cleanJson);
      
      console.log(`✅ SUCCESS! Served by ${modelName}`);
      return res.json(recipeData); 

    } catch (error) {
      console.log(`   ⏭️ Skipped (${error.status || error.message})`);
    }
  }

  console.log("⚠️ All AI models failed. Serving Backup.");
  res.json(BACKUP_RECIPE);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;