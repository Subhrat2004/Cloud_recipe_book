const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi'); // Import Joi for validation
const multer = require('multer'); // Import multer for handling file uploads
const path = require('path'); // Import path for file path handling
const cors = require('cors'); // Import cors for cross-origin resource sharing

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use('/uploads', express.static('uploads')); // Serve uploaded files from 'uploads' directory

// Connect to MongoDB Atlas
const connectionString = 'mongodb+srv://subhrat17053:pIfGe2pe894omlEz@recipe.9ikdl.mongodb.net/?retryWrites=true&w=majority&appName=recipe';
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the Recipe schema
const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredients: { type: [String], required: true },
    steps: { type: [String], required: true },
    image: { type: String, required: true } // Field to store the image path
});

// Create a model for the Recipe
const Recipe = mongoose.model('Recipe', recipeSchema);

// Validation schema
const recipeValidationSchema = Joi.object({
    name: Joi.string().min(1).required(),
    ingredients: Joi.array().items(Joi.string().min(1)).required(),
    steps: Joi.array().items(Joi.string().min(1)).required(),
    image: Joi.string().uri().required() // Added image validation
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Recipe Book API!');
});

// GET all recipes with optional filtering by ingredient
app.get('/recipes', async (req, res) => {
    const { ingredient } = req.query;
    const filter = ingredient ? { ingredients: ingredient } : {};

    try {
        const recipes = await Recipe.find(filter);
        res.json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving recipes' });
    }
});

// POST a new recipe with validation and file upload
app.post('/recipes', upload.single('image'), async (req, res) => {
    const { error } = recipeValidationSchema.validate({
        name: req.body.name,
        ingredients: JSON.parse(req.body.ingredients), // Parse the JSON string
        steps: JSON.parse(req.body.steps), // Parse the JSON string
        image: req.file.path // Set image path from the uploaded file
    });

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const newRecipe = new Recipe({
        name: req.body.name,
        ingredients: JSON.parse(req.body.ingredients), // Parse the JSON string
        steps: JSON.parse(req.body.steps), // Parse the JSON string
        image: req.file.path // Set image path from the uploaded file
    });

    try {
        const savedRecipe = await newRecipe.save();
        res.status(201).json({ message: 'Recipe added', recipe: savedRecipe });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving recipe' });
    }
});

// GET a recipe by ID
app.get('/recipes/:id', async (req, res) => {
    const recipeId = req.params.id;

    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: `Recipe with ID: ${recipeId} not found` });
        }
        res.json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving recipe' });
    }
});

// PUT to update a recipe by ID
app.put('/recipes/:id', async (req, res) => {
    const recipeId = req.params.id;

    const { error } = recipeValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, { new: true });
        if (!updatedRecipe) {
            return res.status(404).json({ message: `Recipe with ID: ${recipeId} not found` });
        }
        res.json({ message: 'Recipe updated', recipe: updatedRecipe });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating recipe' });
    }
});

// DELETE a recipe by ID
app.delete('/recipes/:id', async (req, res) => {
    const recipeId = req.params.id;

    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
        if (!deletedRecipe) {
            return res.status(404).json({ message: `Recipe with ID: ${recipeId} not found` });
        }
        res.json({ message: `Recipe with ID: ${recipeId} deleted` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting recipe' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
