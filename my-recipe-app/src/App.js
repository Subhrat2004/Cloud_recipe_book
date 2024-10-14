// src/App.js
import React, { useState } from 'react';
import RecipeList from './components/RecipeList';
import AddRecipe from './components/AddRecipe';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="app">
      <Navbar />
      <button onClick={() => setModalOpen(true)} className="add-recipe-button">Add Recipe</button>
      <RecipeList />
      <AddRecipe isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)} />
    </div>
  );
};

export default App;
