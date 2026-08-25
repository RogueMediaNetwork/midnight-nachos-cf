export interface StonerStory {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  tags: string[];
  createdAt: string;
}

export interface StoryComment {
  id: string;
  content: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  name: string;
  difficulty: 'Easy (No Heat)' | 'Medium (Stove/Oven)' | 'High Effort (Culinary Master)';
  prepTime: string;
  ingredients: string[];
  instructions: string[];
  description: string;
  category: 'sweet' | 'savory' | 'beverage' | 'weird-combo';
  rating: number; // fun rating, like 4.8 / 5 high-ness
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  type: 'apparel' | 'affiliate'; // apparel (Printify style), affiliate (Amazon style munchie gadgets)
  buyUrl: string;
  rating: number;
  isCustomizable?: boolean;
}

export interface GeneratedMunchie {
  name: string;
  description: string;
  highnessRequired: string; // e.g., "3/5 (Cozy Buzz)", "5/5 (Interstellar)"
  ingredients: string[];
  instructions: string[];
  trippyTip: string;
}
