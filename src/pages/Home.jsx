import { useState, useEffect } from "react";
import {
  getAllRecipes,
  searchRecipesByName,
  getRandomRecipe,
} from "../services/mealApi";
import RecipeGrid from "../components/RecipeGrid";
import ErrorMessage from "../components/ErrorMessage";
import Spinner from "../components/Spinner";

function Home() {
  const [query, setQuery] = useState("");
  const [allRecipes, setAllRecipes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [featured, setFeatured] = useState([]);

  //get all recipes
  useEffect(() => {
    async function loadRecipes() {
      setLoading(true);
      setError("");
      try {
        // Get all recipes
        const recipes = await getAllRecipes();

        setAllRecipes(recipes);
        setResults(recipes);

        // Get 3 random recipes
        // const featuredRecipes = [];

        // for (let i = 0; i < 3; i++) {
        //   const recipe = await getRandomRecipe();
        //   featuredRecipes.push(recipe);
        // }

        const featuredRecipes = await Promise.all([
          getRandomRecipe(),
          getRandomRecipe(),
          getRandomRecipe(),
        ]);

        setFeatured(featuredRecipes);

        setLoading(false);

        console.log(
          "All recipes:",
          recipes,
          "Featured recipes:",
          featuredRecipes,
        );

        const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
        console.log("API_KEY:", API_KEY);
      } catch (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();

    setError("");

    if (!query.trim()) {
      setResults(allRecipes);
      return;
    }

    setLoading(true);

    try {
      const meals = await searchRecipesByName(query);

      setResults(meals || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRandomRecipe() {
    setLoading(true);
    setError("");

    try {
      const meal = await getRandomRecipe();
      console.log("Random recipe:", meal); // temporary - real display comes in Step 4
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-success text-white text-center py-5">
        <div className="container py-4">
          <h1 className="display-4 fw-bold">Eat Smart with NutriAI</h1>
          <p className="lead mb-4">
            Discover healthy recipes, get AI-powered ingredient substitutions,
            and cook smarter every day.
          </p>

          {/* Search Bar */}
          <form
            className="d-flex justify-content-center gap-2 flex-wrap"
            onSubmit={handleSearch}
          >
            <input
              type="search"
              className="form-control w-auto"
              style={{ minWidth: "260px" }}
              placeholder="Search for a recipe (e.g. chicken, pasta)..."
              aria-label="Search recipes"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-light fw-semibold" type="submit">
              Search
            </button>
          </form>

          {/* Random Recipe Button */}
          <button
            className="btn btn-outline-light mt-3"
            onClick={handleRandomRecipe}
          >
            Surprise Me with a Random Recipe
          </button>

          {/* Loading / Error feedback */}
          {loading && <Spinner />}

          {error && <ErrorMessage message={error} />}

          {!loading && !error && results.length > 0 && (
            <p className="mt-3 mb-0">
              Found {results.length} recipe(s) — check the console for now
              (display coming in Step 4)
            </p>
          )}
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="container py-5">
        {!loading && results !== null && (
          <>
            <h2 className="mb-4 text-center">
              {results.length > 0 ? "Recipes" : "No recipes found"}
            </h2>

            {results.length > 0 ? (
              <RecipeGrid recipes={results} />
            ) : (
              <p className="text-center text-muted">
                Try searching for another recipe.
              </p>
            )}
          </>
        )}

        <h2 className="mb-4 text-center">Featured Recipes</h2>

        <div className="row g-4">
          <RecipeGrid recipes={featured} />
        </div>
      </section>
    </>
  );
}

export default Home;
