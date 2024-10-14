const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const recipeSchema = new mongoose.Schema({
    name: String,
    description: String,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://subhrat17053:pIfGe2pe894omlEz@recipe.9ikdl.mongodb.net/?retryWrites=true&w=majority&appName=recipe', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// POST endpoint to add a recipe
app.post('http://localhost:5000/api/recipes', async (req, res) => {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).send(recipe);
});

// GET endpoint to fetch recipes
app.get('/api/recipes', async (req, res) => {
    const recipes = await Recipe.find();
    res.send(recipes);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
