import { useState } from "react";
import { PRESET_RECIPES } from "../data/recipes";
import { Recipe } from "../types";
import { Clock, Star, ChevronDown, ChevronUp, Utensils, Compass } from "lucide-react";

function recipeArtPanel(recipe: Recipe) {
  const cue = `${recipe.name} ${recipe.description}`.toLowerCase();
  if (recipe.category === "beverage" || /shake|soda|tea|cold brew|bubble/.test(cue)) return "recipe-art--drink";
  if (recipe.category === "sweet" || /brownie|oreo|churro|cake|s'more|fudge/.test(cue)) return "recipe-art--sweet";
  if (/wrap|quesadilla|pizza|burger|tortilla/.test(cue)) return "recipe-art--wrap";
  return "recipe-art--snack";
}

export default function RecipeList() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);

  // Difficulty normalizers to match data
  const difficulties = ["All", "Easy (No Heat)", "Medium (Stove/Oven)", "High Effort (Culinary Master)"];
  const categories = ["All", "savory", "sweet", "weird-combo", "beverage"];

  const filteredRecipes = PRESET_RECIPES.filter((recipe) => {
    const diffMatch = selectedDifficulty === "All" || recipe.difficulty === selectedDifficulty;
    const catMatch = selectedCategory === "All" || recipe.category === selectedCategory;
    return diffMatch && catMatch;
  });

  const toggleExpand = (id: string) => {
    if (expandedRecipeId === id) {
      setExpandedRecipeId(null);
    } else {
      setExpandedRecipeId(id);
    }
  };

  return (
    <div id="recipes-container" className="mx-auto max-w-5xl px-4 py-8 font-sans text-slate-200">
      {/* Page Title */}
      <div className="mb-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3 shadow-lg shadow-emerald-500/5">
          <Compass className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Late-Night <span className="text-emerald-400">Cozy Recipes</span>
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
          Curated culinary hacks for when the cravings strike. Easy to execute, highly satisfying, and engineered for maximum comfort.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold font-mono">
            Filter by Cravings Category
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                }`}
              >
                {cat === "weird-combo" ? "👽 Weird Combos" : cat === "All" ? "All Cravings" : cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold font-mono">
            Filter by Effort Level
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedDifficulty === diff
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                }`}
              >
                {diff === "All" ? "All Efforts" : diff.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="rounded-3xl border border-white/5 bg-white/5 p-12 text-center backdrop-blur-md">
          <Utensils className="mx-auto h-10 w-10 text-slate-600 mb-3" />
          <p className="text-sm text-slate-400">No munchie recipes match your filters.</p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedDifficulty("All");
            }}
            className="mt-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 text-xs font-bold transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredRecipes.map((recipe) => {
            const isExpanded = expandedRecipeId === recipe.id;
            return (
              <div
                key={recipe.id}
                id={`recipe-card-${recipe.id}`}
                className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md hover:border-white/20 transition-all duration-300"
              >
                <div>
                  <div
                    className={`recipe-art ${recipeArtPanel(recipe)}`}
                    role="img"
                    aria-label={`Illustration inspired by ${recipe.name}`}
                  />
                  {/* Card Header metadata */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      {recipe.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span>{recipe.prepTime}</span>
                    </div>
                  </div>

                  {/* Title and Rating */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {recipe.name}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0 rounded-full bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 text-xs font-semibold text-amber-400">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span>{recipe.rating}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {recipe.description}
                  </p>

                  {/* Effort tag */}
                  <div className="mb-4">
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full px-2.5 py-0.5">
                      Effort: {recipe.difficulty}
                    </span>
                  </div>

                  {/* Expanded Sections: Ingredients & Instructions */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4 animate-fade-in">
                      {/* Ingredients list */}
                      <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-bold mb-2">
                          Ingredients checklist
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <input 
                                type="checkbox" 
                                id={`check-${recipe.id}-${idx}`}
                                className="mt-0.5 h-3.5 w-3.5 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500/50" 
                              />
                              <label htmlFor={`check-${recipe.id}-${idx}`} className="cursor-pointer select-none">
                                {ing}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Instructions steps */}
                      <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-bold mb-2">
                          Assembly Guide
                        </h4>
                        <ol className="space-y-2.5 text-xs text-slate-300">
                          {recipe.instructions.map((inst, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-[10px] text-emerald-400 font-mono font-bold">
                                {idx + 1}
                              </span>
                              <span className="leading-relaxed">{inst}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                </div>

                {/* Read More / Fold toggle */}
                <div className="mt-5 pt-4 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => toggleExpand(recipe.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    <span>{isExpanded ? "Collapse Guide" : "Get Cooking / Recipe"}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
