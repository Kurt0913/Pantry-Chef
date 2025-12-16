#👨‍🍳 Pantry ChefA "smart" recipe generator that turns your leftover ingredients into delicious meals. This application uses a robust fallback system with multiple Free AI models (via OpenRouter) to ensure you always get a recipe, even if some AI services are down.

##✨ Features* **AI-Powered Recipes:** Generates titles, descriptions, ingredients, and instructions based on user input.
* **Robust AI Fallback:** Cycles through 15+ free AI models (Llama 3, Mistral, Gemini, etc.) to find one that is active.
* **Offline Mode:** Automatically serves a backup "Emergency Stir-Fry" recipe if all AI services fail or timeout.
* **Clean UI:** Built with React and Vite for a fast, responsive experience.

##🛠️ Tech Stack* **Frontend:** React, Vite
* **Backend:** Node.js, Express
* **AI Integration:** OpenRouter API (Accessing Llama, Gemini, Mistral, etc.)

##🚀 Getting StartedFollow these instructions to run the project locally on your machine.

###Prerequisites* Node.js installed
* An API Key from [OpenRouter](https://openrouter.ai/) (Free)

###1. InstallationClone the repository and install dependencies for both the client and server.

```bash
# Clone the repo
git clone https://github.com/yourusername/pantry-chef.git
cd pantry-chef

# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install

```

###2. ConfigurationCreate a `.env` file inside the `server/` folder to store your API key.

1. Navigate to `server/`
2. Create a file named `.env`
3. Add your OpenRouter key:

```env
OPENAI_API_KEY=sk-or-v1-your-key-goes-here
PORT=5000

```

###3. Running the AppYou need to run the Backend and Frontend in **two separate terminals**.

**Terminal 1: Start the Backend**

```bash
cd server
node server.js
# Output should say: Server running on http://localhost:5000

```

**Terminal 2: Start the Frontend**

```bash
cd client
npm run dev
# Click the link provided (usually http://localhost:5173) to open the app

```

##📂 Project Structure```text
/pantry-chef
  ├── /client             # React Frontend
  │     ├── src/          # UI Code
  │     └── package.json
  │
  └── /server             # Node Backend
        ├── .env          # API Keys (Do not share this!)
        ├── server.js     # AI Logic & API Routes
        └── package.json

```

##🤝 ContributingFeel free to fork this project and submit pull requests. You can add more models to the `MODELS` list in `server.js` or improve the UI!

---

*Created by Kurt Tendero*
