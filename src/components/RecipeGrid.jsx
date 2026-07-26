import RecipeCard from "./RecipeCard";

// Lays out an array of recipes in a responsive Bootstrap grid.
// Expects "recipes" to be an array of TheMealDB meal objects.
function RecipeGrid({ recipes }) {
  if (!recipes || recipes.length === 0) {
    return <p className="text-center text-muted">No recipes to show.</p>;
  }

  return (
    <div className="row g-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.idMeal} recipe={recipe} />
      ))}
    </div>
  );
}

export default RecipeGrid;
