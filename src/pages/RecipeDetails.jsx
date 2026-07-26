import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById, getIngredientsList } from "../services/mealApi";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

// Recipe Details page: fetches and displays a single recipe by ID from the URL.
function RecipeDetails() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    async function loadRecipe() {
      setLoading(true);
      setError("");

      try {
        const data = await getRecipeById(id);
        if (data) {
          setRecipe(data);
          setIngredients(await getIngredientsList(data));
          console.log("Incredients details:", await getIngredientsList(data));
        } else {
          setError("Recipe not found.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id]); // re-fetch if the user navigates from one recipe detail page to another

  if (loading) {
    return (
      <div className="container py-5">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Image */}
        <div className="col-12 col-md-6">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="img-fluid rounded shadow-sm"
          />
        </div>

        {/* Title, badges, AI button, ingredients */}
        <div className="col-12 col-md-6">
          <h1 className="mb-3">{recipe.strMeal}</h1>

          <div className="mb-3">
            {recipe.strCategory && (
              <span className="badge bg-success me-2">
                {recipe.strCategory}
              </span>
            )}
            {recipe.strArea && (
              <span className="badge bg-secondary">{recipe.strArea}</span>
            )}
          </div>

          {/* Placeholder - wired up in Step 9 */}
          <button className="btn btn-outline-success mb-4" disabled>
            🤖 Analyze with AI (coming soon)
          </button>

          <h4>Ingredients</h4>
          <ul className="list-group list-group-flush mb-4">
            {ingredients.map(({ ingredient, measure }, index) => (
              <li key={index} className="list-group-item">
                <strong>{ingredient}</strong>
                {measure && <span className="text-muted"> — {measure}</span>}
              </li>
            ))}
          </ul>

          {/* {recipe.strYoutube && (
            
              href={recipe.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-danger"
            >
              ▶ Watch on YouTube
            </a>
          )} */}
        </div>

        {/* Instructions */}
        <div className="col-12">
          <h4>Instructions</h4>
          <p style={{ whiteSpace: "pre-line" }}>{recipe.strInstructions}</p>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
