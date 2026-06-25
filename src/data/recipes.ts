import { Recipe } from "../types";

export const PRESET_RECIPES: Recipe[] = [
  // ==========================================
  // SAVORY - EASY (NO HEAT)
  // ==========================================
  {
    id: "savory-easy-1",
    name: "The Trash-Can Dorito Salad",
    difficulty: "Easy (No Heat)",
    prepTime: "2 mins",
    description: "The ultimate couch-locked classic. A crunched bag of Doritos serving as the bowl, packed with shredded cheese, salsa, sour cream, and pre-cooked chicken. Shake and eat with a fork.",
    ingredients: [
      "1 single-serve bag of Nacho Cheese Doritos",
      "1/2 cup shredded Cheddar or Mexican blend cheese",
      "1/4 cup salsa of choice",
      "2 tbsp sour cream",
      "1/2 cup pre-cooked shredded rotisserie chicken (or canned beans)"
    ],
    instructions: [
      "Gently crunch the unopened bag of Doritos in your hands to break the chips into bite-sized pieces.",
      "Cut or tear the bag open along the side instead of the top to create a wide 'taco bowl'.",
      "Dump in the chicken, shredded cheese, salsa, and sour cream.",
      "Hold the open bag tightly shut and shake vigorously for 10 seconds to fully integrate the cosmos.",
      "Open and eat directly from the bag with a fork."
    ],
    category: "savory",
    rating: 4.8
  },
  {
    id: "savory-easy-2",
    name: "Double-Decker Nacho Crackers",
    difficulty: "Easy (No Heat)",
    prepTime: "3 mins",
    description: "Cold savory snacks constructed to perfection. Cheesy crackers stacked high with cream cheese, sliced turkey, cheddar squares, and a touch of sweet honey-mustard.",
    ingredients: [
      "10 Ritz or Club crackers",
      "4 tbsp cream cheese",
      "2 slices deli Turkey breast (torn into small pieces)",
      "5 small squares of Cheddar cheese",
      "Honey mustard drizzle"
    ],
    instructions: [
      "Lay out 5 crackers as your foundation.",
      "Spread cream cheese over each, then press a piece of deli turkey on top.",
      "Add a drizzle of honey mustard and a square of cheddar cheese.",
      "Place the second cracker on top, squishing down gently until the cream cheese acts as adhesive.",
      "Pop them in your mouth in one single bite."
    ],
    category: "savory",
    rating: 4.6
  },
  {
    id: "savory-easy-3",
    name: "Stoner Charcuterie Board",
    difficulty: "Easy (No Heat)",
    prepTime: "4 mins",
    description: "A gorgeous arrangement of late-night gas-station delicacies. Perfect for sharing with friends on the living room floor.",
    ingredients: [
      "1 handful of Slim Jims or beef jerky",
      "1 cup of Cheddar popcorn",
      "10 pepperoni slices",
      "Cheese cubes or string cheese pulled into threads",
      "A handful of salted pretzels",
      "Dill pickle spears"
    ],
    instructions: [
      "Locate the largest clean plate or cutting board in the kitchen.",
      "Arrange the beef jerky in a neat fan pattern on one side.",
      "Create a small mountain of cheddar popcorn and pretzels in the center.",
      "Drape the pepperoni slices and string cheese threads around the border.",
      "Place pickle spears in a small bowl in the corner.",
      "Admire your culinary design, take a picture, and enjoy."
    ],
    category: "savory",
    rating: 4.7
  },

  // ==========================================
  // SAVORY - MEDIUM (STOVE/OVEN)
  // ==========================================
  {
    id: "recipe-1",
    name: "The Crunchwrap Supreme Hybrid",
    difficulty: "Medium (Stove/Oven)",
    prepTime: "8 mins",
    description: "The ultimate late-night combination. An outer crispy flour tortilla wrapped around seasoned beef, gooey cheddar cheese, spicy jalapeno ranch, and a hidden center layer of crunchy Doritos.",
    ingredients: [
      "1 large Flour Tortilla",
      "1 small corn tostada shell (or a handful of Nacho Cheese Doritos)",
      "1/2 cup Shredded Cheddar or Nacho Cheese sauce",
      "1/3 cup seasoned Ground Beef or black beans",
      "Shredded lettuce and sour cream",
      "1 tsp butter (for grilling)"
    ],
    instructions: [
      "Warm the large flour tortilla in the microwave for 10 seconds to make it super stretchy.",
      "Lay it flat and place your warm seasoned beef or beans in the center, followed by a heavy pour of nacho cheese sauce.",
      "Place your Doritos or tostada shell directly on top of the cheese layer.",
      "Add the lettuce, sour cream, and a splash of hot sauce.",
      "Fold the edges of the flour tortilla up and over the center, pleating it until it is fully sealed in a hexagon shape.",
      "Melt butter in a skillet over medium heat. Place the wrap seam-side down first. Grill for 3 minutes until golden brown, then flip and grill the other side.",
      "Let cool for 1 minute so you don't burn your tongue, then slice in half and enjoy."
    ],
    category: "savory",
    rating: 4.9
  },
  {
    id: "recipe-savory-2",
    name: "Mac & Cheese Grilled Cheese",
    difficulty: "Medium (Stove/Oven)",
    prepTime: "10 mins",
    description: "Why choose between comfort foods? This combines the gooey perfection of grilled cheese with the rich, creamy carb-glory of leftover macaroni and cheese.",
    ingredients: [
      "2 slices of thick White Bread",
      "1/2 cup cold Mac & Cheese",
      "1/2 cup Shredded Cheddar or American Cheese",
      "1 tbsp Butter",
      "A pinch of garlic powder and black pepper"
    ],
    instructions: [
      "Heat a skillet over medium-low heat.",
      "Butter one side of each slice of bread.",
      "Place one slice butter-side down on a plate. Lay half of the shredded cheese on the bread, then spoon the cold mac & cheese evenly over it.",
      "Top with the remaining cheese (acting as edible glue) and sprinkle with garlic powder and black pepper.",
      "Close with the second slice of bread, butter-side out.",
      "Grill for 4-5 minutes per side, pressing down gently with a spatula, until the bread is deep golden brown and the inside is fully melted."
    ],
    category: "savory",
    rating: 4.8
  },
  {
    id: "recipe-savory-3",
    name: "Crispy Tortilla Pizza",
    difficulty: "Medium (Stove/Oven)",
    prepTime: "5 mins",
    description: "Super crispy thin-crust pizza made in minutes using a simple flour tortilla. Perfect for scratching that fast-food pizza itch.",
    ingredients: [
      "1 large Flour Tortilla",
      "1/4 cup Marinara or pizza sauce",
      "1/2 cup Shredded Mozzarella cheese",
      "12 slices of Pepperoni",
      "A sprinkle of Italian seasoning & red pepper flakes"
    ],
    instructions: [
      "Preheat your oven to 400°F (200°C) or prepare a large skillet on medium heat.",
      "If using a skillet, toast one side of the tortilla for 1 minute, then flip it.",
      "Spread the pizza sauce evenly to the very edges of the tortilla.",
      "Scatter mozzarella and pepperonis across the sauce.",
      "Cover the skillet with a lid and cook for 3-4 minutes until the cheese is bubbling and the tortilla is extremely crispy on the bottom.",
      "Slice into wedges and sprinkle with red pepper flakes."
    ],
    category: "savory",
    rating: 4.7
  },

  // ==========================================
  // SAVORY - HIGH EFFORT (CULINARY MASTER)
  // ==========================================
  {
    id: "recipe-savory-5",
    name: "Mega-Loaded Totchos",
    difficulty: "High Effort (Culinary Master)",
    prepTime: "25 mins",
    description: "Tater tots replace chips in this ultimate loaded oven-baked masterpiece. Crispy, golden, covered in bubbling cheese and your favorite toppings.",
    ingredients: [
      "1 bag of Frozen Tater Tots",
      "1 cup Shredded Cheddar & Jack cheese",
      "1/4 cup Jalapeño slices (pickled)",
      "1/3 cup black beans or ground beef",
      "2 tbsp Sour Cream",
      "1/2 cup Guacamole"
    ],
    instructions: [
      "Bake the tater tots on a baking sheet at 425°F (220°C) for 20 minutes until they are ultra-crisp.",
      "Push the cooked tots together into a single tight layer, then sprinkle with beans/beef, jalapeños, and cheese.",
      "Return to the oven for 4-5 minutes until the cheese is fully melted and bubbling.",
      "Carefully transfer to a serving platter and top with cold sour cream and guacamole dollops."
    ],
    category: "savory",
    rating: 4.9
  },
  {
    id: "savory-high-2",
    name: "Deep-Dish Cast-Iron Pizza Bread",
    difficulty: "High Effort (Culinary Master)",
    prepTime: "20 mins",
    description: "A super-thick, skillet-baked pizza constructed with a base of soft garlic bread, smothered in thick marinara, mozzarella cheese, and crispy bacon.",
    ingredients: [
      "1 loaf French Bread (cut in half lengthwise)",
      "1/2 cup Garlic Butter",
      "1 cup Marinara Sauce",
      "1.5 cups shredded Mozzarella",
      "1/2 cup bacon bits & sausage crumbles",
      "Parmesan cheese"
    ],
    instructions: [
      "Preheat oven to 425°F (220°C).",
      "Generously spread garlic butter over the cut faces of the French bread.",
      "Toast the bread in a cast-iron skillet for 3 minutes until golden and crisp.",
      "Spread a thick layer of marinara sauce over the toasted bread, then load it up with mozzarella and meats.",
      "Place the entire cast-iron skillet into the oven. Bake for 12-15 minutes until the cheese is brown, bubbly, and caramelized at the edges.",
      "Slice into thick fingers and dip into extra warm sauce."
    ],
    category: "savory",
    rating: 4.8
  },
  {
    id: "savory-high-3",
    name: "Triple-Thick Cheeseburger Quesadilla",
    difficulty: "High Effort (Culinary Master)",
    prepTime: "22 mins",
    description: "Two quesadillas serving as the top and bottom buns of a giant, juicy, cheese-stuffed double burger patty. Epic proportions.",
    ingredients: [
      "4 medium Flour Tortillas",
      "2 cups shredded Cheddar & Jack cheese",
      "1/2 lb Ground Beef",
      "1/4 cup chopped pickles & onions",
      "4 tbsp Secret Sauce (Mayo, Ketchup, Relish)"
    ],
    instructions: [
      "Season and cook two flat ground beef patties in a hot skillet until cooked through and seared.",
      "In a separate pan, make 2 simple cheese quesadillas using the 4 tortillas and shredded cheese.",
      "Lay down the first cheese quesadilla on a cutting board.",
      "Spread Secret Sauce over it, then layer pickles, onions, and the double burger patties.",
      "Top with the second warm cheese quesadilla.",
      "Press down firmly, slice into quarters, and experience burger nirvana."
    ],
    category: "savory",
    rating: 4.9
  },

  // ==========================================
  // SWEET - EASY (NO HEAT)
  // ==========================================
  {
    id: "recipe-2",
    name: "Cinnamon Toast Crunch Shake",
    difficulty: "Easy (No Heat)",
    prepTime: "3 mins",
    description: "The sweet-tooth savior. Thick, creamy vanilla milk blended with crunchy cinnamon sugar cereal, creating the ultimate cinnamilk-infused milkshake.",
    ingredients: [
      "3 scoops Vanilla Bean Ice Cream",
      "1/2 cup Milk",
      "3/4 cup Cinnamon Toast Crunch cereal (split into 1/2 cup for blending, 1/4 cup for topping)",
      "1/2 tsp Ground Cinnamon",
      "Whipped Cream & Caramel sauce (optional but highly recommended)"
    ],
    instructions: [
      "Throw the ice cream, milk, half cup of cereal, and ground cinnamon into a blender.",
      "Pulse until smooth but still featuring tiny micro-crunches of cinnamon sugar goodness.",
      "Pour into a tall glass.",
      "Top with a mountain of whipped cream, a heavy swirl of caramel sauce, and the remaining whole cereal pieces.",
      "Grab a straw and a spoon. Sip slowly while watching lofi animations."
    ],
    category: "sweet",
    rating: 4.8
  },
  {
    id: "recipe-sweet-2",
    name: "The 60-Second Mug Fudge Brownie",
    difficulty: "Easy (No Heat)",
    prepTime: "1 min",
    description: "The emergency sweet-tooth solution. A rich, gooey, molten chocolate fudge brownie cooked right in your favorite mug in under a minute.",
    ingredients: [
      "3 tbsp All-Purpose Flour",
      "2 tbsp Sugar",
      "1 tbsp Cocoa Powder",
      "1 tbsp Melted Butter (or oil)",
      "2 tbsp Milk",
      "1 tbsp Chocolate Chips"
    ],
    instructions: [
      "In a microwave-safe mug, whisk together the flour, sugar, and cocoa powder with a fork.",
      "Add the milk and melted butter, stirring until a smooth, thick chocolate batter forms.",
      "Fold in the chocolate chips.",
      "Microwave on High for 45 to 50 seconds. The center should still look slightly wet and molten.",
      "Let cool for 2 minutes (it will be extremely hot!). Top with vanilla ice cream if desired."
    ],
    category: "sweet",
    rating: 4.7
  },
  {
    id: "recipe-sweet-5",
    name: "Ritz FlufferNutter Stackers",
    difficulty: "Easy (No Heat)",
    prepTime: "3 mins",
    description: "Buttry, salty Ritz crackers stacked high with sweet peanut butter, fluffy marshmallow fluff, and sliced bananas. The ultimate instant snack.",
    ingredients: [
      "10 Ritz Crackers",
      "3 tbsp Creamy Peanut Butter",
      "3 tbsp Marshmallow Fluff",
      "1/2 Banana (sliced)"
    ],
    instructions: [
      "Lay out 10 Ritz crackers on a plate.",
      "Spread peanut butter on 5 crackers and marshmallow fluff on the other 5.",
      "Place a thin banana slice on top of the peanut butter crackers.",
      "Sandwich the fluff crackers and peanut butter crackers together. Squish gently and devour."
    ],
    category: "sweet",
    rating: 4.5
  },

  // ==========================================
  // SWEET - MEDIUM (STOVE/OVEN)
  // ==========================================
  {
    id: "recipe-sweet-3",
    name: "Air Fried Jelly Donuts",
    difficulty: "Medium (Stove/Oven)",
    prepTime: "7 mins",
    description: "Golden, crispy, cinnamon-sugar crusted donut bites made with simple ingredients. Stuffed with hot, sweet strawberry jelly.",
    ingredients: [
      "1 can of refrigerated Biscuit dough",
      "1/2 cup Strawberry Jelly or Jam",
      "3 tbsp Melted Butter",
      "1/2 cup Cinnamon Sugar",
      "Powdered sugar"
    ],
    instructions: [
      "Preheat air fryer to 350°F (175°C).",
      "Cut biscuit rounds into quarters. Roll each quarter into a neat ball.",
      "Air fry the dough balls for 5-6 minutes until puffed up and golden brown.",
      "Brush the hot donut holes with melted butter and roll them in cinnamon sugar.",
      "Using a skewer or chopstick, poke a hole in each donut. Use a piping bag or small spoon to squeeze a dollop of strawberry jelly into the center.",
      "Dust with powdered sugar and eat warm."
    ],
    category: "sweet",
    rating: 4.6
  },
  {
    id: "recipe-sweet-4",
    name: "The S'mores Quesadilla",
    difficulty: "Medium (Stove/Oven)",
    prepTime: "5 mins",
    description: "A campfire classic adapted for indoor late-night cravings. Crispy toasted flour tortilla filled with melted chocolate and toasted marshmallows.",
    ingredients: [
      "1 large Flour Tortilla",
      "1/2 cup Mini Marshmallows",
      "1/3 cup Chocolate Chips",
      "2 Graham Crackers (crushed)",
      "1 tsp Butter"
    ],
    instructions: [
      "Lay the tortilla flat. Sprinkle chocolate chips and crushed graham crackers on one half.",
      "Pile the mini marshmallows on top of the chocolate.",
      "Fold the empty half of the tortilla over the filling to create a half-moon.",
      "Melt butter in a skillet over medium-low heat. Place the fold-over inside.",
      "Grill for 2-3 minutes per side, pressing down with a spatula, until the chocolate is gooey and marshmallows are fully melted."
    ],
    category: "sweet",
    rating: 4.8
  },
  {
    id: "sweet-medium-3",
    name: "Caramelized Banana Toast Bites",
    difficulty: "Medium (Stove/Oven)",
    prepTime: "8 mins",
    description: "Crispy pan-seared brioche bread cubes tossed in cinnamon sugar, topped with hot bananas caramelized in butter and brown sugar.",
    ingredients: [
      "2 slices of thick Brioche bread (cut into cubes)",
      "1 firm Banana (sliced into rounds)",
      "2 tbsp Butter",
      "2 tbsp Brown Sugar",
      "1/2 tsp Ground Cinnamon"
    ],
    instructions: [
      "Melt 1 tablespoon of butter in a skillet over medium heat.",
      "Add the brioche bread cubes and toast, stirring frequently, until crispy and golden. Remove to a bowl and toss with cinnamon sugar.",
      "In the same hot skillet, melt the remaining butter and add the brown sugar, creating a bubbling syrup.",
      "Add banana slices. Let cook undisturbed for 2 minutes to caramelize, then flip and cook for 1 more minute.",
      "Pour the hot, sticky caramelized bananas over the crispy toast bites and eat with a toothpick."
    ],
    category: "sweet",
    rating: 4.7
  },

  // ==========================================
  // SWEET - HIGH EFFORT (CULINARY MASTER)
  // ==========================================
  {
    id: "sweet-high-1",
    name: "Pan-Fried Oreos (Fair Ground Classic)",
    difficulty: "High Effort (Culinary Master)",
    prepTime: "15 mins",
    description: "The absolute peak of carnival sweetness. Oreos dipped in thick pancake batter and shallow-fried in a skillet until puffy, golden, and melting inside.",
    ingredients: [
      "10 double-stuffed Oreo cookies",
      "1 cup dry Pancake mix",
      "1/2 cup Milk",
      "1 Egg",
      "1 cup Vegetable oil (for shallow frying)",
      "Heaps of powdered sugar"
    ],
    instructions: [
      "In a medium bowl, whisk together the pancake mix, milk, and egg until a smooth, thick batter forms.",
      "Heat vegetable oil in a deep skillet over medium-high heat (350°F / 175°C). Ensure it's hot by dropping a bit of batter in (it should sizzle instantly).",
      "Drop an Oreo into the batter, turning to coat it completely.",
      "Carefully lower the coated cookie into the hot oil. Repeat with 4-5 cookies at a time.",
      "Fry for 1.5 to 2 minutes per side until puffy and golden brown.",
      "Remove to a paper-towel-lined plate. Dust immediately with a snowstorm of powdered sugar."
    ],
    category: "sweet",
    rating: 4.9
  },
  {
    id: "sweet-high-2",
    name: "Lava Cake Churro Bites",
    difficulty: "High Effort (Culinary Master)",
    prepTime: "20 mins",
    description: "Deep, chocolatey, and crisp. Hollow churro-like pastry pockets made with cocoa dough, fried, and injected with molten chocolate hazelnut cream.",
    ingredients: [
      "1 cup Water",
      "2 tbsp Butter",
      "1 cup Flour",
      "2 tbsp Cocoa Powder",
      "2 Eggs",
      "1/2 cup Nutella (for stuffing)",
      "Cinnamon sugar"
    ],
    instructions: [
      "Boil water and butter in a saucepan. Stir in flour and cocoa powder rapidly until a ball forms.",
      "Remove from heat, let cool slightly, then beat in eggs one at a time until smooth.",
      "Load the dough into a pastry bag with a star tip.",
      "Pipe 2-inch chunks of dough into hot vegetable oil. Fry for 4 minutes until crispy.",
      "Roll the hot bites in cinnamon sugar.",
      "Use a piping bag with a thin tip to inject Nutella directly into the center of each hot bite."
    ],
    category: "sweet",
    rating: 4.8
  },
  {
    id: "sweet-high-3",
    name: "Layered Cosmic Ice Cream Cake",
    difficulty: "High Effort (Culinary Master)",
    prepTime: "30 mins",
    description: "A decadent, multi-layered freezer cake with a fudgy brownie base, chocolate ice cream layer, vanilla fudge ripples, and topped with authentic Cosmic Brownie chunks.",
    ingredients: [
      "1 box prepared fudgy Brownies (baked and cooled)",
      "1 pint Chocolate Ice Cream (slightly softened)",
      "1/2 cup Hot Fudge sauce",
      "1 box Cosmic Brownies (cut into bite-sized pieces)",
      "Rainbow candy sprinkles"
    ],
    instructions: [
      "Line a loaf pan or cake pan with plastic wrap.",
      "Press half of the prepared brownie block flat into the bottom of the pan to form the base.",
      "Spread the softened chocolate ice cream evenly over the brownie base.",
      "Drizzle hot fudge sauce across the ice cream, then press Cosmic Brownie chunks into the fudge.",
      "Top with the remaining brownie layer, cover with plastic wrap, and freeze solid for 2 hours.",
      "Unmold, slice into thick wedges, and top with extra rainbow sprinkles."
    ],
    category: "sweet",
    rating: 4.9
  },

  // ==========================================
  // WEIRD COMBO - EASY (NO HEAT)
  // ==========================================
  {
    id: "recipe-4",
    name: "Peanut Butter Pickle Tostadas",
    difficulty: "Easy (No Heat)",
    prepTime: "2 mins",
    description: "Don't knock it until you try it. The sweet, fatty, salty stickiness of peanut butter is perfectly balanced by the sharp, cold, sour crunch of dill pickles and a sweet-spicy sriracha drizzle.",
    ingredients: [
      "2 flat corn Tostada shells (or crispy taco shells)",
      "4 tbsp Creamy Peanut Butter (chunky is also fine)",
      "8 thin slices of Dill Pickles (patted dry with a napkin)",
      "A drizzle of Sriracha hot sauce",
      "A sprinkle of sesame seeds or crushed peanuts"
    ],
    instructions: [
      "Place your tostada shells flat on a plate.",
      "Spread peanut butter evenly over each shell. Be gentle so you don't crack the shells, but if you do, it just turns into Nachos!",
      "Layer the pickle slices over the peanut butter like tiny green cobblestones.",
      "Drizzle sriracha over the top in a zig-zag pattern.",
      "Sprinkle with sesame seeds and take a brave, glorious bite. Your life will change."
    ],
    category: "weird-combo",
    rating: 4.5
  },
  {
    id: "recipe-weird-3",
    name: "Ice Cream & Hot French Fries",
    difficulty: "Easy (No Heat)",
    prepTime: "3 mins",
    description: "The absolute pinnacle of sweet-salty-hot-cold contrast. Hot, crispy salted french fries dipped in velvety sweet vanilla bean ice cream.",
    ingredients: [
      "1 plate of hot, crispy Salted French Fries",
      "2 scoops premium Vanilla Bean Ice Cream",
      "A light sprinkle of sea salt"
    ],
    instructions: [
      "Prepare your fries so they are extremely crispy and salted immediately while hot.",
      "Scoop cold vanilla ice cream into a small dipping bowl.",
      "Grab a hot fry, dip it deep into the cold sweet ice cream, and eat. Feel the flavor dimensions collide."
    ],
    category: "weird-combo",
    rating: 4.8
  },
  {
    id: "recipe-weird-5",
    name: "Pineapple Cream Cheese Dip",
    difficulty: "Easy (No Heat)",
    prepTime: "3 mins",
    description: "An unexpected tropical, sweet-savory flavor bomb. Smooth, cold cream cheese topped with sweet crushed pineapple and a heavy drizzle of sriracha.",
    ingredients: [
      "1 block (8 oz) Cream Cheese",
      "1/2 cup crushed canned Pineapple (drained)",
      "2 tbsp Sriracha or Cholula hot sauce",
      "1 bag of Tortilla Chips"
    ],
    instructions: [
      "Place the cream cheese block flat on a serving platter.",
      "Spoon the drained crushed pineapple evenly over the top of the cheese block.",
      "Drizzle sriracha over the pineapple layer in an elegant zig-zag.",
      "Scoop with tortilla chips, ensuring you get all three layers in one bite."
    ],
    category: "weird-combo",
    rating: 4.4
  },

  // ==========================================
  // WEIRD COMBO - MEDIUM (STOVE/OVEN)
  // ==========================================
  {
    id: "recipe-3",
    name: "Ramen Carbonara Upgrade",
    difficulty: "Medium (Stove/Oven)",
    prepTime: "5 mins",
    description: "How to make a $0.50 instant ramen pack taste like a $20 Italian meal in less than five minutes. Rich, creamy, and loaded with savory cheese.",
    ingredients: [
      "1 pack Instant Ramen (Chicken or Tonkotsu flavor)",
      "1 fresh Egg Yolk",
      "2 tbsp Grated Parmesan Cheese",
      "1 tbsp Butter",
      "1 clove Garlic (minced, or garlic powder if lazy)",
      "Crushed bacon bits or green onions"
    ],
    instructions: [
      "Boil the ramen noodles in water for 3 minutes. Drain, but reserve 1/4 cup of the hot noodle water.",
      "While the noodles are boiling, whisk the egg yolk, grated parmesan cheese, and half of the ramen seasoning packet together in a small bowl until it forms a thick paste.",
      "In your hot empty pot, melt the butter over low heat and quickly saute the minced garlic for 30 seconds.",
      "Dump the hot noodles into the pot, turn off the heat completely (crucial step, or the egg will scramble!).",
      "Pour in the egg-cheese paste and the reserved hot noodle water. Toss rapidly with tongs or a fork. The heat of the noodles and water will cook the egg yolk into a thick, glossy, luxurious sauce.",
      "Top with bacon bits, green onions, and extra black pepper."
    ],
    category: "weird-combo",
    rating: 4.7
  },
  {
    id: "recipe-weird-4",
    name: "Hot Cheetos Rice Krispies",
    difficulty: "Medium (Stove/Oven)",
    prepTime: "10 mins",
    description: "A spicy, sweet, sticky, and crunchy twist on the schoolyard classic. Melted marshmallow fluff bound to crushed Flamin' Hot Cheetos.",
    ingredients: [
      "3 cups Flamin' Hot Cheetos (lightly crushed)",
      "2 tbsp Butter",
      "3 cups Mini Marshmallows",
      "A pinch of cayenne pepper"
    ],
    instructions: [
      "Melt butter in a medium pot over low heat.",
      "Add mini marshmallows and stir constantly until fully melted into a smooth, white cloud.",
      "Turn off the heat and instantly fold in the crushed Flamin' Hot Cheetos.",
      "Stir rapidly until the Cheetos are evenly coated in gooey sticky webbing.",
      "Press the mixture into a greased baking pan, let set for 5 minutes, slice into squares, and enjoy."
    ],
    category: "weird-combo",
    rating: 4.6
  },
  {
    id: "weird-medium-3",
    name: "Bacon-Wrapped Oreo Delights",
    difficulty: "Medium (Stove/Oven)",
    prepTime: "12 mins",
    description: "Crispy, smoky, salty bacon tightly wrapped around sweet chocolate Oreo cookies, baked to a caramelized crisp. Mind-bending deliciousness.",
    ingredients: [
      "6 Double Stuf Oreo cookies",
      "6 slices of thin bacon",
      "1 tbsp Maple Syrup (for brushing)",
      "1 pinch black pepper"
    ],
    instructions: [
      "Preheat your oven or air fryer to 390°F (200°C).",
      "Wrap one strip of bacon tightly around each Oreo cookie, tucking the ends underneath so they don't unwind.",
      "Place on a baking sheet lined with foil or parchment paper.",
      "Brush the top of each bacon-wrapped cookie lightly with maple syrup and add a tiny dust of black pepper.",
      "Bake for 10-12 minutes until the bacon is crispy and browned.",
      "Let cool completely before eating, as the filling turns into molten stardust."
    ],
    category: "weird-combo",
    rating: 4.8
  },

  // ==========================================
  // WEIRD COMBO - HIGH EFFORT (CULINARY MASTER)
  // ==========================================
  {
    id: "weird-high-1",
    name: "Mac & Donut Glazed Sliders",
    difficulty: "High Effort (Culinary Master)",
    prepTime: "18 mins",
    description: "Creamy mac and cheese stuffed between a sliced glazed donut, crusted in butter and pan-fried like a sweet-savory grilled cheese.",
    ingredients: [
      "2 whole Glazed Donuts (sliced in half horizontally)",
      "1 cup leftover Mac & Cheese",
      "4 slices of Cheddar Cheese",
      "2 tbsp Butter"
    ],
    instructions: [
      "In a small pan, reheat your mac & cheese until warm and sticky.",
      "Open your sliced glazed donuts. Lay a slice of cheddar cheese on the bottom half of each donut.",
      "Spoon a massive pile of warm mac & cheese on top of the cheese slices.",
      "Add the second slice of cheddar cheese on top of the mac layer, then close the donuts.",
      "Melt butter in a skillet over low heat. Fry the donuts, flipping carefully, until the glaze caramelizes and the cheese melts completely."
    ],
    category: "weird-combo",
    rating: 4.9
  },
  {
    id: "weird-high-2",
    name: "Spicy Cheeto Mac Balls",
    difficulty: "High Effort (Culinary Master)",
    prepTime: "25 mins",
    description: "Deep-fried, crispy spheres of creamy mac and cheese coated in a fiery red crust of crushed Flamin' Hot Cheetos.",
    ingredients: [
      "2 cups cold, thick Mac & Cheese",
      "2 cups Flamin' Hot Cheetos (ground to fine crumbs)",
      "2 Eggs (beaten)",
      "1/2 cup Flour",
      "Oil for deep frying"
    ],
    instructions: [
      "Scoop the cold mac & cheese and roll into tight 2-inch balls. Freeze on a sheet for 15 minutes to firm up.",
      "Set up three bowls: one with flour, one with beaten eggs, and one with the crushed Hot Cheeto crumbs.",
      "Roll each frozen mac ball in flour, then dip in egg, then coat heavily in Cheeto crumbs.",
      "Deep fry in hot oil (350°F / 175°C) for 3-4 minutes until the outer crust is crispy and the inside is piping hot.",
      "Serve with ranch dressing."
    ],
    category: "weird-combo",
    rating: 4.9
  },
  {
    id: "weird-high-3",
    name: "S'mores Bacon Cheeseburger Pizza",
    difficulty: "High Effort (Culinary Master)",
    prepTime: "28 mins",
    description: "An unbelievable sweet-savory culinary fusion. Pizza dough topped with ground beef, cheddar, crispy bacon, then layered with mini marshmallows and chocolate chips.",
    ingredients: [
      "1 pre-made Pizza crust",
      "1/2 cup Marinara sauce",
      "1 cup shredded Cheddar cheese",
      "1/2 cup cooked Ground Beef",
      "1/4 cup cooked crispy Bacon bits",
      "1/3 cup Chocolate Chips",
      "1/2 cup Mini Marshmallows"
    ],
    instructions: [
      "Preheat oven to 425°F (220°C).",
      "Spread marinara, cheddar, ground beef, and bacon across the pizza crust.",
      "Bake for 10-12 minutes until the cheese is melted and crust is golden.",
      "Pull the hot pizza out of the oven, then instantly scatter the chocolate chips and mini marshmallows over the top.",
      "Return to the oven for 2 minutes on Broil until the marshmallows are toasted golden brown."
    ],
    category: "weird-combo",
    rating: 4.7
  },

  // ==========================================
  // BEVERAGE - EASY (NO HEAT)
  // ==========================================
  {
    id: "recipe-5",
    name: "The Cosmic Citrus Float",
    difficulty: "Easy (No Heat)",
    prepTime: "2 mins",
    description: "A fizzy, refreshing beverage that cuts through any late-night dry mouth. The vanilla ice cream melts into orange soda, creating a magical creamsicle nebula.",
    ingredients: [
      "1 can Orange Soda (or Mountain Dew for a wilder ride)",
      "2 scoops Vanilla Bean Ice Cream",
      "A splash of lime juice",
      "1 slice of fresh Orange or lime for garnish"
    ],
    instructions: [
      "Grab a large frosted mug.",
      "Add a small splash of lime juice to the bottom, then drop in the scoops of vanilla ice cream.",
      "Slowly pour the orange soda over the ice cream, letting it foam up to the brim.",
      "Garnish with an orange slice.",
      "Enjoy the fizzy, creamy cosmic sunset in your cup."
    ],
    category: "beverage",
    rating: 4.6
  },
  {
    id: "recipe-beverage-2",
    name: "Slushy Mountain Dew Freeze",
    difficulty: "Easy (No Heat)",
    prepTime: "3 mins",
    description: "A neon green slushy beverage made by blending frozen Gatorade cubes with cold Mountain Dew. Pure ice-cold energy.",
    ingredients: [
      "10-12 frozen Blue or Red Gatorade ice cubes",
      "1/2 can cold Mountain Dew",
      "1 tbsp Fresh Lime juice",
      "Sour gummy worms (optional)"
    ],
    instructions: [
      "Throw your pre-frozen Gatorade ice cubes into a blender.",
      "Add the lime juice and Mountain Dew.",
      "Blend on high speed until a snowy, smooth, slushy consistency forms.",
      "Pour into a tall glass, garnish with sour gummy worms, and drink immediately."
    ],
    category: "beverage",
    rating: 4.5
  },
  {
    id: "recipe-beverage-3",
    name: "Spicy Mango Michelada Mocktail",
    difficulty: "Easy (No Heat)",
    prepTime: "4 mins",
    description: "Sweet, sour, spicy, and deeply refreshing. Thick mango nectar combined with lime, ginger beer, and a heavy Tajin chili rim.",
    ingredients: [
      "1/2 cup Mango Nectar",
      "1 bottle cold Ginger Beer",
      "2 tbsp fresh Lime juice",
      "1 tbsp Chamoy sauce & 2 tbsp Tajín seasoning (for rimming)"
    ],
    instructions: [
      "Rim a tall glass with chamoy, then dip into Tajin chili seasoning.",
      "Fill the glass with crushed ice.",
      "Pour in the lime juice and mango nectar.",
      "Top off with ice-cold ginger beer, stir gently, and sip the sweet-and-spicy masterpiece."
    ],
    category: "beverage",
    rating: 4.7
  },

  // ==========================================
  // BEVERAGE - MEDIUM (STOVE/OVEN)
  // ==========================================
  {
    id: "recipe-beverage-4",
    name: "Blueberry Dream Sleepy Milk",
    difficulty: "Medium (Stove/Oven)",
    prepTime: "5 mins",
    description: "A soothing, pastel-purple hot beverage designed to ease you into sleep. Warm milk infused with fresh simmered blueberry syrup and vanilla.",
    ingredients: [
      "1.5 cups Milk (Oat milk or Whole milk work great)",
      "1/3 cup Blueberries (fresh or frozen)",
      "1 tbsp Honey or Maple Syrup",
      "1/2 tsp Vanilla extract",
      "A tiny pinch of cinnamon"
    ],
    instructions: [
      "In a small saucepan, combine blueberries, honey, vanilla, and cinnamon over medium heat. Simmer and smash with a fork for 2-3 minutes until jammy.",
      "Strain the purple blueberry juice/syrup into a mug.",
      "In the same saucepan, warm your milk over low heat until hot and steaming.",
      "Pour the hot milk into your mug, stirring it into the blueberry syrup to create a gorgeous purple sleep aid."
    ],
    category: "beverage",
    rating: 4.8
  },
  {
    id: "beverage-medium-2",
    name: "Warm Caramel Salted Cider",
    difficulty: "Medium (Stove/Oven)",
    prepTime: "6 mins",
    description: "Comfort in a mug. Real apple cider simmered with brown sugar and cinnamon, finished with a heavy swirl of liquid caramel and a pinch of sea salt.",
    ingredients: [
      "1.5 cups Apple Cider",
      "1 tbsp Brown Sugar",
      "1 Cinnamon stick",
      "2 tbsp Caramel sauce",
      "A pinch of sea salt"
    ],
    instructions: [
      "Combine apple cider, brown sugar, and the cinnamon stick in a small saucepan.",
      "Simmer over medium-low heat for 4-5 minutes until steaming and highly aromatic.",
      "Stir in the liquid caramel sauce and sea salt until dissolved.",
      "Pour into your favorite oversized mug and garnish with whipped cream if you're feeling extra cozy."
    ],
    category: "beverage",
    rating: 4.6
  },
  {
    id: "beverage-medium-3",
    name: "Chai Tea White Hot Chocolate",
    difficulty: "Medium (Stove/Oven)",
    prepTime: "5 mins",
    description: "A fragrant, luxurious late-night tea hybrid. Creamy milk simmered with white chocolate chips and an authentic chai spice blend.",
    ingredients: [
      "1.5 cups Whole Milk",
      "1/3 cup White Chocolate chips",
      "1 Chai Tea bag",
      "1/4 tsp Vanilla extract",
      "A pinch of ground nutmeg"
    ],
    instructions: [
      "Pour milk into a saucepan and add the chai tea bag. Simmer over low heat for 3 minutes to steep.",
      "Remove the tea bag, squeezing out the herbal juices.",
      "Add white chocolate chips and vanilla, stirring constantly until the chocolate melts into a velvety white hot cocoa.",
      "Pour into a mug and top with nutmeg."
    ],
    category: "beverage",
    rating: 4.7
  },

  // ==========================================
  // BEVERAGE - HIGH EFFORT (CULINARY MASTER)
  // ==========================================
  {
    id: "beverage-high-1",
    name: "Toasted Marshmallow Smoked Cold Brew",
    difficulty: "High Effort (Culinary Master)",
    prepTime: "15 mins",
    description: "A gorgeous, sweet, caffeinated dessert shake. Cold brew coffee blended with real oven-toasted marshmallows, vanilla bean ice cream, and finished with a burnt marshmallow skewer.",
    ingredients: [
      "1 cup strong Cold Brew coffee",
      "6 large Marshmallows",
      "3 scoops Vanilla Ice cream",
      "2 tbsp Chocolate Syrup"
    ],
    instructions: [
      "Arrange the marshmallows on a foil-lined sheet. Broil in the oven for 2 minutes, watching closely, until they are puffed and deeply blackened/toasted.",
      "Scrape 4 of the hot, sticky toasted marshmallows directly into a blender.",
      "Add cold brew, vanilla ice cream, and chocolate syrup. Blend on high until completely incorporated.",
      "Pour into a glass rimmed with chocolate syrup, and garnish with the remaining two toasted marshmallows on a toothpick."
    ],
    category: "beverage",
    rating: 4.9
  },
  {
    id: "beverage-high-2",
    name: "Fresh Raspberry Lime Caviar Soda",
    difficulty: "High Effort (Culinary Master)",
    prepTime: "20 mins",
    description: "A highly scientific and beautiful late-night molecular mocktail. Sweet sparkling lime soda featuring popping spheres of homemade raspberry juice caviar.",
    ingredients: [
      "1 cup fresh Raspberries",
      "1/2 cup Water & 2 tbsp sugar",
      "1 packet Gelatin or Agar Agar",
      "1 cup cold Vegetable Oil (chilled in freezer for 2 hours)",
      "1 bottle Sprite or Lime Sparkling Water"
    ],
    instructions: [
      "Simmer raspberries, water, and sugar in a pan. Strain to get pure raspberry syrup. Stir in gelatin.",
      "Fill a dropper or syringe with the warm raspberry mixture.",
      "Gently drip the raspberry syrup into the ice-cold vegetable oil. The drops will instantly form perfect spheres and sink.",
      "Strain the spheres out of the oil and rinse with cold water.",
      "Spoon your fresh raspberry caviar into a glass, pour ice-cold Sprite over it, and watch the crimson pearls dance."
    ],
    category: "beverage",
    rating: 4.8
  },
  {
    id: "beverage-high-3",
    name: "Galaxy Color-Changing Bubble Tea",
    difficulty: "High Effort (Culinary Master)",
    prepTime: "25 mins",
    description: "An incredibly visual, magical tea. Butterfly pea flower tea creates a deep blue liquid that turns pastel pink/purple when fresh lime juice is introduced over sweet tapioca pearls.",
    ingredients: [
      "2 tbsp dried Butterfly Pea Flowers",
      "1/2 cup warm Tapioca pearls (Boba)",
      "1 tbsp Honey or Brown Sugar syrup",
      "1/2 cup Milk or coconut milk",
      "1 tbsp fresh Lime juice"
    ],
    instructions: [
      "Steep the butterfly pea flowers in 1 cup of hot water for 5 minutes. Strain to get a royal blue tea, then let cool.",
      "In a serving glass, add the warm tapioca pearls and coat in brown sugar syrup.",
      "Add crushed ice to the top of the glass, then pour in the milk.",
      "Slowly pour in the blue butterfly pea tea, creating a gorgeous layered blue/white drink.",
      "Right before sipping, squeeze the fresh lime juice over the top. Watch the acidic citrus turn the blue tea into a sparkling violet purple galaxy."
    ],
    category: "beverage",
    rating: 4.9
  }
];
