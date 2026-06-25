import { Product } from "../types";

export const HYBRID_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Midnight Nachos OG Trippy Hoodie",
    price: 44.20,
    description: "Our signature heavyweight cozy hoodie. Features a retro-futuristic melting cheese design and our trippy mascot. Double-lined hood, kangaroo pocket, and cotton-blend fabric designed for maximum couch-surfing comfort.",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600", // cozy cooking aesthetic
    type: "apparel",
    buyUrl: "#",
    rating: 4.9,
    isCustomizable: true
  },
  {
    id: "prod-2",
    name: "The 'Cheese is Out There' Acid-Wash Tee",
    price: 28.50,
    description: "An ultra-soft 100% cotton acid-wash t-shirt with a vintage UFO illustration stealing a glowing plate of nachos. Fits relaxed, feels like a worn-in favorite from the very first wear.",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600", // classic tee placement
    type: "apparel",
    buyUrl: "#",
    rating: 4.8,
    isCustomizable: true
  },
  {
    id: "prod-3",
    name: "Munchies Master Corduroy Bucket Hat",
    price: 22.00,
    description: "Cozy mustard-yellow corduroy bucket hat embroidered with our smiling nacho logo. Keeps your head cozy on late-night snacks runs or outdoor star-gazing sessions.",
    imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=600", // cozy winter/fall hat vibe
    type: "apparel",
    buyUrl: "#",
    rating: 4.7,
    isCustomizable: false
  },
  {
    id: "prod-4",
    name: "Sunset Nebula Ambient Projector Lamp",
    price: 18.99,
    description: "Affiliate Item: Turn your bedroom or kitchen ceiling into a trippy, cosmic late-night sunset. Features 16 different color modes, a 360-degree rotating head, and remote control. Essential for stoner-friendly aesthetics.",
    imageUrl: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&q=80&w=600", // ambient light vibe
    type: "affiliate",
    buyUrl: "https://www.amazon.com/s?k=sunset+projector+lamp",
    rating: 4.6
  },
  {
    id: "prod-5",
    name: "Rapid Microwave Mac & Cheese Cooker",
    price: 12.99,
    description: "Affiliate Item: The ultimate tool for instant microwave optimization. Cooks perfect pasta in half the time without boiling water. Double-walled to stay cool to the touch. Dishwasher safe.",
    imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=600", // yummy pasta plate
    type: "affiliate",
    buyUrl: "https://www.amazon.com/s?k=microwave+mac+and+cheese+cooker",
    rating: 4.5
  },
  {
    id: "prod-6",
    name: "Retro Hot Air Tabletop Popcorn Maker",
    price: 24.99,
    description: "Affiliate Item: Launches fresh, hot, oil-free popcorn directly into your bowl in less than 2 minutes. Features a measuring cup that doubles as a butter-melting tray on top of the machine.",
    imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=600", // popcorn maker/popped popcorn
    type: "affiliate",
    buyUrl: "https://www.amazon.com/s?k=retro+hot+air+popcorn+maker",
    rating: 4.7
  }
];
