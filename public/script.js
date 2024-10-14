const form = document.getElementById('recipe-form');
const recipeList = document.getElementById('recipe-list');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const recipeName = document.getElementById('recipe-name').value;
    const recipeIngredients = document.getElementById('recipe-ingredients').value.split(',');
    const recipeSteps = document.getElementById('recipe-steps').value.split(',');

    const newRecipe = { 
        name: recipeName, 
        ingredients: recipeIngredients.map(item => item.trim()), 
        steps: recipeSteps.map(item => item.trim()) 
    };

    // Send the recipe to the server
    const response = await fetch('https://98iw3cwaif.execute-api.us-east-1.amazonaws.com/dev/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
    });

    if (response.ok) {
        // Clear the input fields
        form.reset();
        // Fetch and display updated recipes
        fetchRecipes();
    } else {
        alert('Error adding recipe');
    }
});

// Fetch recipes from the server
async function fetchRecipes() {
    const response = await fetch('https://98iw3cwaif.execute-api.us-east-1.amazonaws.com/dev/recipes');
    if (response.ok) {
        const recipes = await response.json();
        displayRecipes(recipes);
    } else {
        alert('Error fetching recipes');
    }
}

// Display recipes in the UI
function displayRecipes(recipes) {
    recipeList.innerHTML = '';
    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';
        recipeDiv.innerHTML = `
            <strong>${recipe.name}</strong>
            <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
            <p><strong>Steps:</strong> ${recipe.steps.join(', ')}</p>
        `;
        recipeList.appendChild(recipeDiv);
    });
}

// Initial fetch to load recipes
fetchRecipes();
