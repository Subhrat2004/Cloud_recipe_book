// src/components/AddRecipe.js
import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './AddRecipe.css';

const AddRecipe = ({ isOpen, onRequestClose }) => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRecipe = {
      name,
      ingredients: ingredients.split(',').map(item => item.trim()),
      steps: steps.split(',').map(item => item.trim()),
    };

    try {
      await axios.post('https://YOUR_API_ENDPOINT/recipes', newRecipe);
      setName('');
      setIngredients('');
      setSteps('');
      onRequestClose(); // Close modal after submission
      alert('Recipe added successfully!');
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
      <form onSubmit={handleSubmit} className="add-recipe-form">
        <h2>Add a New Recipe</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Recipe Name"
          required
        />
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Ingredients (comma-separated)"
          required
        />
        <input
          type="text"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          placeholder="Steps (comma-separated)"
          required
        />
        <button type="submit">Add Recipe</button>
        <button type="button" onClick={onRequestClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default AddRecipe;
