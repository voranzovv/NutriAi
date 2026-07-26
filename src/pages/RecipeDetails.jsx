import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { getRecipeById, getIngredientsList } from "../services/mealApi";

import { analyzeRecipeWithAI } from "../services/aiApi";

import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import ReactMarkdown from "react-markdown";

function RecipeDetails() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // AI states
  const [analysis, setAnalysis] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // Load recipe
  useEffect(() => {
    async function loadRecipe() {
      try {
        setLoading(true);
        setError("");

        const data = await getRecipeById(id);

        if (data) {
          setRecipe(data);

          const ingredientList = getIngredientsList(data);

          setIngredients(ingredientList);

          console.log("Ingredients:", ingredientList);
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
  }, [id]);

  // AI Analyze function
  async function handleAnalyze() {
    try {
      setLoadingAI(true);
      setAnalysis("");

      const result = await analyzeRecipeWithAI({
        recipe,
        ingredients,
      });

      console.log("AI Response:", result);

      setAnalysis(result.choices[0].message.content);
    } catch (err) {
      console.error("AI Error:", err);

      setError("Failed to analyze recipe.");
    } finally {
      setLoadingAI(false);
    }
  }

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
      <Link to="/" className="btn btn-link mb-4">
        ← Back to Recipes
      </Link>

      <div className="row g-4">
        {/* Image */}

        <div className="col-lg-6">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="img-fluid rounded shadow"
          />
        </div>

        {/* Details */}

        <div className="col-lg-6">
          <h1 className="fw-bold">{recipe.strMeal}</h1>

          <div className="mb-3">
            <span className="badge bg-success me-2">{recipe.strCategory}</span>

            <span className="badge bg-secondary">{recipe.strArea}</span>
          </div>

          {/* Ingredients */}

          <div className="card shadow-sm">
            <div className="card-body">
              <h4>Ingredients</h4>

              <ul className="list-group list-group-flush">
                {ingredients.map(({ ingredient, measure }, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{ingredient}</span>

                    <span className="text-muted">{measure}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions */}

        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3>Instructions</h3>

              <p
                style={{
                  whiteSpace: "pre-line",
                }}
              >
                {recipe.strInstructions}
              </p>
            </div>
          </div>
        </div>

        {/* AI Button */}

        <button
          className="btn btn-success mb-4"
          onClick={handleAnalyze}
          disabled={loadingAI}
        >
          {loadingAI ? "Analyzing..." : "Analyze with AI"}
        </button>

        {/* AI Result */}

        {analysis && (
          <div className="card shadow mt-4">
            <div className="card-header bg-success text-white">
              <h3>AI Health Analysis</h3>
            </div>

            <div className="card-body">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeDetails;
