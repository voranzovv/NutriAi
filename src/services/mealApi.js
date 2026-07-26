const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

//get all recipes
export async function getAllRecipes() {
  try {
    const response = await fetch(`${BASE_URL}/search.php?f=a`);

    if (!response.ok) {
      throw new Error("Failed to fetch recipes.");
    }

    const data = await response.json();

    if (!data.meals) {
      throw new Error("No recipes found.");
    }

    return data.meals;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error; // Let the React component handle displaying the error
  }
}

// Search recipes by name. Returns an array of meals, or an empty array if none found.
export async function searchRecipesByName(query) {
  const response = await fetch(
    `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recipes. Please try again.");
  }

  const data = await response.json();
  // TheMealDB returns { meals: null } when there are no results
  return data.meals || [];
}

// Get a single random recipe.
export async function getRandomRecipe() {
  const response = await fetch(`${BASE_URL}/random.php`);

  if (!response.ok) {
    throw new Error("Failed to fetch a random recipe. Please try again.");
  }

  const data = await response.json();
  return data.meals ? data.meals[0] : null;
}

// Get full details for a recipe by its ID.
export async function getRecipeById(id) {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch recipe details. Please try again.");
  }

  const data = await response.json();
  return data.meals ? data.meals[0] : null;
}

export function getIngredientsList(recipe) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient) {
      //create object
      ingredients.push({ ingredient, measure });
    }
  }
  return ingredients;
}
