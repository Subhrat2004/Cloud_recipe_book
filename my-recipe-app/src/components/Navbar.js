// src/components/Navbar.js
import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Recipe Book</h1>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/add-recipe">Add Recipe</a>
      </div>
    </nav>
  );
};

export default Navbar;
