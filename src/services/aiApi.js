const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function analyzeRecipeWithAI({ recipe, ingredients }) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "X-OpenRouter-Title": "NutriAI",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          {
            role: "user",
            content: `
You are an experienced nutritionist.

Analyze the following recipe and provide a detailed health report.

## Recipe Information

**Recipe Name:** ${recipe.strMeal}

**Category:** ${recipe.strCategory}

**Cuisine:** ${recipe.strArea}

### Ingredients

${ingredients
  .map((item) => `- ${item.ingredient} (${item.measure})`)
  .join("\n")}

---

Return your answer in **Markdown**.

Use the following format exactly.

# AI Health Analysis

## Overall Health Score
Give a score out of 10 and explain why.

## Estimated Nutrition
- Calories
- Protein
- Carbohydrates
- Fat
- Fiber

## Health Benefits
Provide 4-6 bullet points.

## Less Healthy Ingredients
List ingredients that could be improved and explain why.

## Healthier Alternatives

| Current Ingredient | Healthier Alternative | Reason |
|-------------------|-----------------------|--------|

Include at least 3 substitutions if possible.

## Cooking Tips
Provide 4-6 practical cooking tips.

## Who Is This Meal Good For?
Mention people who would benefit from this meal (athletes, weight loss, high protein, vegetarian, etc.).

## Final Recommendation
Summarize the recipe in one short paragraph.

Keep the response friendly, practical, and easy to read, make it beatiful adding emojis.
Do NOT use HTML.
Only return Markdown.
`,
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to get AI response");
  }

  return await response.json();
}
