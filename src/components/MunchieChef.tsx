import React, { useState, useEffect } from "react";
import { Sparkles, Utensils, RotateCcw, Plus, Check, Compass, AlertCircle, ChefHat, Download } from "lucide-react";
import { GeneratedMunchie } from "../types";

const PRESET_INGREDIENTS = [
  "Bread", "Cheese", "Doritos", "Ramen", "Peanut Butter", 
  "Pickles", "Marshmallows", "Hot Sauce", "Egg", 
  "Banana", "Tortilla", "Chocolate Chips", "Potato Chips"
];

const LOADING_MESSAGES = [
  "Staring at the fridge light...",
  "Calibrating microwave wavelengths...",
  "Summoning the spirits of midnight snackers...",
  "Whispering sweet secrets to the cheese...",
  "Flipping through the cosmic cookbook...",
  "Plucking ideas from the celestial snack-cloud..."
];

const HIGHNESS_PRESETS = [
  { level: 1, label: "Level 1: Just Vibin' 😶‍🌫️", description: "Mellow background buzz. Still perfectly functional. You can write an essay, but you'd rather eat." },
  { level: 2, label: "Level 2: Light Float ☁️", description: "Lofi beats are starting to hit different. Your vision is slightly warmer. A snack is highly recommended." },
  { level: 3, label: "Level 3: Giggles & Munchies 🤭", description: "Everything is funny. The fridge light is the sun. Your creative cooking ideas are expanding." },
  { level: 4, label: "Level 4: High-As-A-Kite 🪁", description: "You've been holding an empty cup for 5 minutes. Words are hard, but cheese tastes like absolute magic." },
  { level: 5, label: "Level 5: Completely Couch-Locked 🛋️", description: "Merged with the furniture. The microwave timer is a cosmic countdown. Assembly must be 3 steps max." }
];

export default function MunchieChef() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customIngredient, setCustomIngredient] = useState("");
  const [customList, setCustomList] = useState<string[]>([]);
  const [highnessLevel, setHighnessLevel] = useState<number>(3);
  
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [recipe, setRecipe] = useState<GeneratedMunchie | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rotate loading messages
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const toggleIngredient = (name: string) => {
    if (selectedIngredients.includes(name)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== name));
    } else {
      setSelectedIngredients([...selectedIngredients, name]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customIngredient.trim();
    if (trimmed && !customList.includes(trimmed) && !PRESET_INGREDIENTS.includes(trimmed)) {
      setCustomList([...customList, trimmed]);
      setSelectedIngredients([...selectedIngredients, trimmed]);
    }
    setCustomIngredient("");
  };

  const removeCustom = (name: string) => {
    setCustomList(customList.filter((i) => i !== name));
    setSelectedIngredients(selectedIngredients.filter((i) => i !== name));
  };

  const clearSelection = () => {
    setSelectedIngredients([]);
    setRecipe(null);
    setError(null);
  };

  const generateRecipe = async () => {
    if (selectedIngredients.length === 0) return;
    setLoading(true);
    setError(null);
    setRecipe(null);
    setLoadingMsgIdx(0);

    try {
      const res = await fetch("/api/munchies-chef", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ingredients: selectedIngredients,
          headspace: HIGHNESS_PRESETS[highnessLevel - 1].label
        }),
      });

      if (!res.ok) {
        throw new Error("The kitchen portal is currently offline. Please try again.");
      }

      const data = await res.json() as { recipe?: GeneratedMunchie; isMock?: boolean; error?: string };
      
      if (data.recipe) {
        setRecipe(data.recipe);
        setIsMock(!!data.isMock);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("The kitchen portal returned an empty plate. Please try again.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to summon the Munchie AI Chef. Try checking your ingredients.");
    } finally {
      setLoading(false);
    }
  };

  const downloadRecipePdf = async () => {
    if (!recipe) return;
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "pt", format: "letter" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 48;
    const contentWidth = pageWidth - margin * 2;
    let cursor = margin;
    const write = (text: string, size: number, emphasis = false, gap = 10) => {
      pdf.setFont("helvetica", emphasis ? "bold" : "normal");
      pdf.setFontSize(size);
      const lines = pdf.splitTextToSize(text, contentWidth) as string[];
      const height = lines.length * (size + 4);
      if (cursor + height > pageHeight - margin) {
        pdf.addPage();
        cursor = margin;
      }
      pdf.text(lines, margin, cursor);
      cursor += height + gap;
    };

    pdf.setFillColor(44, 31, 14);
    pdf.rect(0, 0, pageWidth, 94, "F");
    pdf.setTextColor(255, 221, 112);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("MIDNIGHT NACHOS · MUNCHIE AI CHEF", margin, 34);
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(recipe.name, margin, 67);
    cursor = 126;
    pdf.setTextColor(47, 35, 18);
    write(recipe.description, 11, false, 18);
    write(`Vibe: ${recipe.highnessRequired}`, 10, true, 15);
    write("INGREDIENTS", 11, true, 7);
    recipe.ingredients.forEach(ingredient => write(`• ${ingredient}`, 10, false, 3));
    cursor += 10;
    write("METHOD", 11, true, 7);
    recipe.instructions.forEach((instruction, index) => write(`${index + 1}. ${instruction}`, 10, false, 5));
    cursor += 10;
    write("CHEF'S TRIPPY TIP", 11, true, 7);
    write(recipe.trippyTip, 10, false, 0);
    pdf.save(`${recipe.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-midnight-nachos.pdf`);
  };

  return (
    <div id="munchie-chef-container" className="mx-auto max-w-4xl px-4 py-8 font-sans text-slate-200">
      {/* Visual Title Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3 shadow-lg shadow-amber-500/5">
          <ChefHat className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          <span className="text-amber-400">Munchie AI Chef</span>
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
          What ingredients are staring back at you from your fridge right now? Select them below, and let the AI Chef build a trippy, glorious snack recipe.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Left: Ingredient Selector Shelf (7 columns) */}
        <div className="md:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-6 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-amber-400 font-mono">
                Pantry & Fridge Shelf
              </h3>
              {selectedIngredients.length > 0 && (
                <button
                  onClick={clearSelection}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PRESET_INGREDIENTS.map((ing) => {
                const isSelected = selectedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    onClick={() => toggleIngredient(ing)}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-medium transition-all duration-300 ${
                      isSelected
                        ? "bg-amber-400/10 text-amber-300 border border-amber-400/30 shadow-md shadow-amber-400/5"
                        : "bg-slate-900/50 hover:bg-slate-900 text-slate-400 border border-transparent"
                    }`}
                  >
                    <span>{ing}</span>
                    {isSelected ? (
                      <Check className="h-3.5 w-3.5 text-amber-400" />
                    ) : (
                      <Plus className="h-3.5 w-3.5 text-slate-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Ingredient Form */}
            <form onSubmit={handleAddCustom} className="mt-5 flex gap-2">
              <input
                type="text"
                value={customIngredient}
                onChange={(e) => setCustomIngredient(e.target.value)}
                placeholder="Type other stuff in your cabinet..."
                maxLength={25}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-800 px-4 text-xs font-semibold text-white hover:bg-slate-700 transition-all border border-slate-700"
              >
                Add
              </button>
            </form>

            {/* Custom List Chips */}
            {customList.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {customList.map((cust) => (
                  <span
                    key={cust}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-slate-300"
                  >
                    <span>{cust}</span>
                    <button
                      type="button"
                      onClick={() => removeCustom(cust)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* HIGHNESS SELECTOR */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-purple-400 font-mono">
                Current Headspace Frequency
              </h3>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                Interactive Dial
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white transition-all duration-300">
                  {HIGHNESS_PRESETS[highnessLevel - 1].label}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Select your vibe
                </span>
              </div>
              
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={highnessLevel}
                onChange={(e) => setHighnessLevel(parseInt(e.target.value))}
                className="w-full h-1 rounded-lg bg-slate-800 accent-purple-500 cursor-pointer appearance-none"
              />
              
              <div className="flex justify-between text-[9px] font-mono text-slate-500 px-1">
                <span>Vibin'</span>
                <span>Buzz</span>
                <span>Giggles</span>
                <span>Flyin'</span>
                <span>Baked</span>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-purple-500/30 pl-3">
                &ldquo;{HIGHNESS_PRESETS[highnessLevel - 1].description}&rdquo;
              </p>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={generateRecipe}
            disabled={selectedIngredients.length === 0 || loading}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-sm tracking-wide transition-all duration-300 ${
              selectedIngredients.length > 0 && !loading
                ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-[length:200%_auto] hover:bg-right text-slate-950 shadow-xl shadow-amber-500/20 active:scale-[0.98] cursor-pointer"
                : "bg-slate-900 text-slate-600 border border-slate-900 cursor-not-allowed"
            }`}
          >
            <Sparkles className="h-4.5 w-4.5 animate-spin-slow" />
            <span>SYNTHESIZE MUNCHIE RECIPE</span>
            <span className="font-mono text-xs opacity-75">
              ({selectedIngredients.length} item{selectedIngredients.length !== 1 ? "s" : ""})
            </span>
          </button>
        </div>

        {/* Right: Recipe Output Stage (5 columns) */}
        <div className="md:col-span-5 flex flex-col justify-stretch">
          {/* Default Unused Stage */}
          {!loading && !recipe && !error && (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/20 p-6 text-center">
              <div className="mb-4 h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-700">
                <Utensils className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-400">Nothing on the plate yet</h4>
              <p className="mt-1.5 max-w-xs text-xs text-slate-600">
                Pick at least one item from the left shelf, click synthesize, and watch the culinary portal align.
              </p>
            </div>
          )}

          {/* Loading Stage */}
          {loading && (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-slate-900 bg-slate-950/40 p-8 text-center backdrop-blur-md">
              {/* Spinner container */}
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
                <div className="absolute h-full w-full animate-spin rounded-full border-4 border-amber-500/10 border-t-amber-500" />
                <div className="absolute h-14 w-14 animate-spin rounded-full border-4 border-emerald-500/10 border-b-emerald-500 border-r-emerald-500 [animation-duration:1.5s]" />
                <ChefHat className="h-7 w-7 text-amber-400 animate-pulse" />
              </div>
              <h4 className="font-mono text-xs font-semibold text-amber-400 tracking-wider uppercase">
                Synthesizing
              </h4>
              <p className="mt-3 text-sm text-slate-300 font-sans transition-all duration-500 animate-fade-in">
                &ldquo;{LOADING_MESSAGES[loadingMsgIdx]}&rdquo;
              </p>
              <p className="mt-1.5 text-[10px] text-slate-600 font-mono">Cooking in dimension 4.20...</p>
            </div>
          )}

          {/* Error Stage */}
          {error && (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
              <div className="mb-3 h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/15">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-red-400">Portal Malfunction</h4>
              <p className="mt-1.5 max-w-xs text-xs text-slate-400">{error}</p>
              <button
                onClick={generateRecipe}
                className="mt-4 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 px-3 py-1.5 text-xs text-white"
              >
                Retry Request
              </button>
            </div>
          )}

          {/* Recipe Generated Stage */}
          {recipe && (
            <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
              {/* Optional ambient color glow in background */}
              <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
              
              <div>
                {/* Highness tag & Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
                    <Compass className="h-3.5 w-3.5" />
                    <span>Rating: {recipe.highnessRequired}</span>
                  </div>
                  {isMock && (
                    <span className="inline-flex items-center rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-[10px] font-medium text-purple-400" title="A quick, curated recipe from the Midnight Nachos kitchen.">
                      Instant Recipe
                    </span>
                  )}
                </div>

                {/* Recipe Name */}
                <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                  {recipe.name}
                </h3>

                <button
                  type="button"
                  onClick={downloadRecipePdf}
                  className="mn-recipe-download"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Download recipe PDF
                </button>

                {/* Description */}
                <p className="text-xs text-slate-400 italic mb-5 leading-relaxed">
                  &ldquo;{recipe.description}&rdquo;
                </p>

                {/* Ingredients Subsection */}
                <div className="mb-5">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-semibold mb-2">
                    Cosmic Ingredients
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions Subsection */}
                <div className="mb-5">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-semibold mb-2">
                    Method of Assembly
                  </h4>
                  <ol className="space-y-2.5 text-xs text-slate-300">
                    {recipe.instructions.map((inst, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-[10px] text-amber-400 font-mono">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{inst}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Trippy Tip Footer */}
              <div className="mt-4 pt-4 border-t border-slate-900">
                <h4 className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                  Chef's Trippy Tip
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {recipe.trippyTip}
                </p>
              </div>
            </div>
          )}
          {recipe && (
            <aside className="mn-chef-ad" aria-label="Advertising placement">
              <span>Ad space</span>
              <strong>Late-night brand goes here.</strong>
              <p>Food, glass, art, events, and the other things people reach for after midnight.</p>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
