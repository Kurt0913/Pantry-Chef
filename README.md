# 👨‍🍳 Pantry Chef

A "smart" recipe generator that turns your leftover ingredients into delicious meals. This application uses a robust fallback system with multiple Free AI models (via OpenRouter) to ensure you always get a recipe, even if some AI services are down.

## ✨ Features

* **AI-Powered Recipes:** Generates titles, descriptions, ingredients, and instructions based on user input.
* **Robust AI Fallback:** Cycles through 15+ free AI models (Llama 3, Mistral, Gemini, etc.) to find one that is active.
* **Offline Mode:** Automatically serves a backup "Emergency Stir-Fry" recipe if all AI services fail or timeout.
* **Clean UI:** Built with React and Vite for a fast, responsive experience.

## 🛠️ Tech Stack

* **Frontend:** React, Vite
* **Backend:** Node.js, Express
* **AI Integration:** OpenRouter API (Accessing Llama, Gemini, Mistral, etc.)

## 🚀 Getting Started

Follow these instructions to run the project locally on your machine.

### Prerequisites
* Node.js installed
* An API Key from [OpenRouter](https://openrouter.ai/) (Free)

### 1. Installation

Clone the repository and install dependencies for both the client and server.

```bash
# Clone the repo
git clone [https://github.com/yourusername/pantry-chef.git](https://github.com/yourusername/pantry-chef.git)
cd pantry-chef

# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
