import { Link } from "react-router-dom";

// Displays a single recipe as a Bootstrap card.
// Expects a "recipe" object shaped like TheMealDB's meal object.
function RecipeCard({ recipe }) {
  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="card h-100 shadow-sm">
        <img
          src={recipe.strMealThumb}
          className="card-img-top"
          alt={recipe.strMeal}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{recipe.strMeal}</h5>
          <p className="card-text text-muted mb-3">
            {recipe.strCategory || "Uncategorized"}
            {recipe.strArea ? ` · ${recipe.strArea}` : ""}
          </p>
          <Link
            to={`/recipe/${recipe.idMeal}`}
            className="btn btn-success mt-auto"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
