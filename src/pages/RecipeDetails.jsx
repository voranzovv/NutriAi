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

          const ingredientList = await getIngredientsList(data);

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

  // AI Analyze
  async function handleAnalyze() {
    if (loadingAI) return;

    try {
      setLoadingAI(true);
      setError("");
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

  if (error && !recipe) {
    return (
      <div className="container py-5">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="container py-5">
      <Link to="/" className="btn btn-link mb-4 text-decoration-none">
        Back to Recipes
      </Link>

      <div className="row g-4">
        {/* Image */}

        <div className="col-lg-6">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="img-fluid rounded shadow w-100"
          />
        </div>

        {/* Recipe Details */}

        <div className="col-lg-6">
          <h1 className="fw-bold mb-3">{recipe.strMeal}</h1>

          <div className="mb-4">
            <span className="badge bg-success me-2">{recipe.strCategory}</span>

            <span className="badge bg-secondary">{recipe.strArea}</span>
          </div>

          {/* Ingredients */}

          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="mb-3">Ingredients</h4>

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
                  lineHeight: "1.8",
                }}
              >
                {recipe.strInstructions}
              </p>
            </div>
          </div>
        </div>

        {/* AI Analyze Button */}

        {!analysis && (
          <div className="col-12">
            <button
              className="btn btn-success btn-lg"
              onClick={handleAnalyze}
              disabled={loadingAI}
            >
              Analyze with AI
            </button>
          </div>
        )}

        {/* AI Loading */}

        {loadingAI && (
          <div className="col-12">
            <div className="card shadow-sm border-success">
              <div className="card-body text-center py-5">
                <div
                  className="spinner-border text-success mb-4"
                  style={{
                    width: "3rem",
                    height: "3rem",
                  }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>

                <h4 className="fw-bold">NutriAI is analyzing your recipe...</h4>

                <p className="text-muted mb-1">
                  Checking ingredients, nutrition, and healthier alternatives.
                </p>

                <small className="text-secondary">
                  This usually takes 1–3 minutes.
                </small>
              </div>
            </div>
          </div>
        )}

        {/* AI Result */}

        {analysis && (
          <div className="col-12">
            <div className="card shadow border-success">
              <div className="card-header bg-success text-white">
                <h3 className="mb-0">AI Health Analysis</h3>
              </div>

              <div className="card-body">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeDetails;
