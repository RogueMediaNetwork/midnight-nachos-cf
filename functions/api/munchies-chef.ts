import { GeneratedMunchie } from "../../src/types";

interface Env {
  ANTHROPIC_API_KEY: string;
  STORIES_KV: KVNamespace;
}

function getFallbackRecipe(ingredients: string[], headspace?: string): GeneratedMunchie {
  const low = ingredients.map(i => i.toLowerCase());

  if (low.includes("cheese") && (low.includes("bread") || low.includes("tortilla"))) {
    return {
      name: "The Cosmic Meltdown Quesadilla",
      description: "A gooey, toasted masterpiece born from the absolute union of carb and dairy.",
      highnessRequired: "2/5 (Cozy Buzz)",
      ingredients: [...ingredients, "1 pinch of garlic powder"],
      instructions: [
        "Place your bread or tortilla on a clean surface.",
        "Spread cheese evenly across the inner surface.",
        "Fold in half like a delicious sleeping bag.",
        "Heat on a dry skillet over medium-low until golden and melted.",
        "Let cool 60 seconds — do not burn your tongue, rookie mistake."
      ],
      trippyTip: "Cut it diagonally. Food tastes 15% better in triangle form."
    };
  }

  if (low.includes("ramen")) {
    return {
      name: "Hyperdrive Midnight Ramen",
      description: "Instant ramen elevated to gourmet status. Warm, spicy, savory, comforting.",
      highnessRequired: "4/5 (Interstellar Voyager)",
      ingredients: [...ingredients, "splash of soy sauce or butter"],
      instructions: [
        "Boil water, cook noodles exactly 3 minutes.",
        "Drain half the water to keep some broth.",
        "Stir in seasoning packet plus hot sauce if you have it.",
        "If you have an egg, crack it in and stir for creamy broth.",
        "Serve in your deepest bowl."
      ],
      trippyTip: "Eat with chopsticks. Forces you to slow down and appreciate each bite."
    };
  }

  if (low.includes("doritos") || low.includes("potato chips")) {
    return {
      name: "The Trash-Can Nacho Platter",
      description: "Crunchy, salty, spicy, and satisfyingly chaotic. Gold standard of midnight snacking.",
      highnessRequired: "3/5 (The Munchies Peak)",
      ingredients: [...ingredients, "sprinkle of green onions if you're fancy"],
      instructions: [
        "Arrange chips in a beautiful layer on a microwave-safe plate.",
        "Shower with shredded cheese.",
        "Drizzle hot sauce like modern art.",
        "Microwave 30-45 seconds until cheese bubbles.",
        "Let cool one minute so chips regain their crunch."
      ],
      trippyTip: "Dorito dust is a permanent dye on white shirts. Use a napkin."
    };
  }

  return {
    name: `The ${ingredients[0] || "Stardust"} Fusion Platter`,
    description: "A spontaneous creation born from sheer resourcefulness and late-night cravings.",
    highnessRequired: headspace || "3/5 (Cozy & Creative)",
    ingredients: [...ingredients, "1 splash of creativity"],
    instructions: [
      `Inspect your ingredients: ${ingredients.join(", ")}.`,
      "Find a clean bowl or plate to map out your masterpiece.",
      "Combine savory items, or layer sweet items for texture contrast.",
      "If it melts, microwave 20 seconds. If crunchy, keep it raw.",
      "Take a small bite first to calibrate your tastebuds."
    ],
    trippyTip: "Low-volume lofi beats + adjusted screen brightness = peak snack mode."
  };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  let ingredients: string[] = [];
  let headspace: string | undefined;

  try {
    const body = await request.json() as { ingredients: string[]; headspace?: string };
    ingredients = body.ingredients || [];
    headspace = body.headspace;
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!ingredients.length) {
    return Response.json({ error: "At least one ingredient is required" }, { status: 400 });
  }

  if (!env.ANTHROPIC_API_KEY) {
    await new Promise(r => setTimeout(r, 800));
    return Response.json({ recipe: getFallbackRecipe(ingredients, headspace), isMock: true });
  }

  const ingredientList = ingredients.map(i => String(i).trim()).join(", ");

  const prompt = `You are "The Midnight Nacho Chef", a friendly, ultra-cozy, slightly trippy stoner chef.
A customer arrives at your late-night kitchen with these ingredients: ${ingredientList}.
Their current highness / mental headspace is: "${headspace || "Mellow Vibes"}".
Generate a creative, funny, and surprisingly delicious late-night snack recipe using these ingredients.
Match your tone to their headspace (if very baked, keep steps super simple and reassuring).
Keep instructions safe (no dangerous techniques).
Rate the "highness level required" to appreciate this dish out of 5 (e.g. "3/5 (Cozy Buzz)").

Respond ONLY with a JSON object — no markdown, no backticks — with exactly these fields:
{
  "name": "creative recipe name",
  "description": "hilarious cozy one-liner description",
  "highnessRequired": "X/5 (Label)",
  "ingredients": ["ingredient with amount", "..."],
  "instructions": ["step 1", "step 2", "..."],
  "trippyTip": "one friendly tip about mood or eating experience"
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) throw new Error(`Claude API ${response.status}`);

    const data = await response.json() as { content: Array<{ type: string; text: string }> };
    const text = data.content.find(b => b.type === "text")?.text || "";
    const recipe = JSON.parse(text.replace(/```json|```/g, "").trim()) as GeneratedMunchie;

    return Response.json({ recipe, isMock: false });

  } catch (err: any) {
    console.error("Chef API error:", err);
    return Response.json({
      recipe: getFallbackRecipe(ingredients, headspace),
      isMock: true,
      error: err.message
    });
  }
};
