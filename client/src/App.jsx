// client/src/App.jsx
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [ingredients, setIngredients] = useState([]); // Stores the bubbles
  const [currentInput, setCurrentInput] = useState(""); // Stores text being typed
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('pantryChefFavorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // 1. Handle "Enter" key to add ingredient
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault(); // Stop default form submit
      addIngredient();
    }
  };

  const addIngredient = () => {
    const trimmed = currentInput.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setCurrentInput(""); // Clear input box
    }
  };

  // 2. Remove ingredient when clicking "X"
  const removeIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const generateRecipe = async () => {
    if (ingredients.length === 0) return alert("Add at least one ingredient!");
    
    setLoading(true);
    setRecipe(null);
    
    // Join array into string: "Eggs, Milk, Cheese"
    const ingredientsString = ingredients.join(", ");

    try {
      const response = await fetch('http://localhost:5000/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredientsString }),
      });

      const data = await response.json();
      if(response.ok) {
        setRecipe(data);
      } else {
        alert("Error: " + (data.error || "Failed to generate"));
      }
    } catch (error) {
      console.error(error);
      alert("Error! Is the server running?");
    }
    setLoading(false);
  };

  const saveRecipe = () => {
    if (!recipe) return;
    const exists = favorites.find(f => f.title === recipe.title);
    if (exists) return alert("You already saved this!");
    const newFavorites = [...favorites, recipe];
    setFavorites(newFavorites);
    localStorage.setItem('pantryChefFavorites', JSON.stringify(newFavorites));
  };

  const deleteFavorite = (title) => {
    const newFavorites = favorites.filter(r => r.title !== title);
    setFavorites(newFavorites);
    localStorage.setItem('pantryChefFavorites', JSON.stringify(newFavorites));
  };

  const loadFavorite = (fav) => {
    setRecipe(fav);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <header>
        <h1>👨‍🍳 Pantry Chef</h1>
        <p>Type an ingredient and press <strong>Enter</strong> to add it.</p>
      </header>
      
      {/* NEW: TAG INPUT SYSTEM */}
      <div className="input-section">
        <div className="tag-container">
          {ingredients.map((item, index) => (
            <span key={index} className="tag">
              {item} 
              <button onClick={() => removeIngredient(index)}>×</button>
            </span>
          ))}
          <input 
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={ingredients.length === 0 ? "e.g. Chicken" : "Add another..."}
            type="text"
          />
        </div>

        <button className="generate-btn" onClick={generateRecipe} disabled={loading}>
          {loading ? "Thinking..." : "✨ Generate Recipe"}
        </button>
      </div>

      {recipe && (
        <div className="recipe-card slide-up">
          <div className="card-header">
            <h2>{recipe.title}</h2>
            <button className="save-btn" onClick={saveRecipe}>❤️ Save</button>
          </div>
          <p className="description"><em>{recipe.description}</em></p>
          <div className="recipe-content">
            <div className="ingredients">
              <h3>🛒 Ingredients</h3>
              <ul>{recipe.ingredients_list.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </div>
            <div className="instructions">
              <h3>🔥 Instructions</h3>
              <ol>{recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}</ol>
            </div>
          </div>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="favorites-section">
          <h3>Your Cookbook ({favorites.length})</h3>
          <div className="favorites-grid">
            {favorites.map((fav, i) => (
              <div key={i} className="fav-card">
                <h4>{fav.title}</h4>
                <div className="fav-actions">
                  <button onClick={() => loadFavorite(fav)}>View</button>
                  <button className="delete-btn" onClick={() => deleteFavorite(fav.title)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App