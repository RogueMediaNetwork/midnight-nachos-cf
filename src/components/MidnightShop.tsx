import React, { useState } from "react";
import { HYBRID_PRODUCTS } from "../data/products";
import { Product } from "../types";
import { ShoppingBag, Star, RefreshCw, Layers, Check, ExternalLink, Heart } from "lucide-react";

const APP_COLORS = [
  { name: "Cosmic Charcoal", hex: "#1e1e24", bg: "bg-slate-800" },
  { name: "Midnight Haze", hex: "#3b0764", bg: "bg-purple-950" },
  { name: "Golden Nacho", hex: "#eab308", bg: "bg-yellow-500" },
  { name: "Forest Chill", hex: "#064e3b", bg: "bg-emerald-950" }
];

export default function MidnightShop() {
  const [selectedType, setSelectedType] = useState<"all" | "apparel" | "affiliate">("all");
  
  // Customization state for apparel preview
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(HYBRID_PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState(APP_COLORS[0]);
  const [customText, setCustomText] = useState("MIDNIGHT CHILL");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "success">("cart");
  const [cartItem, setCartItem] = useState<Product | null>(null);

  const filteredProducts = HYBRID_PRODUCTS.filter((prod) => {
    if (selectedType === "all") return true;
    return prod.type === selectedType;
  });

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleOpenCustomizer = (prod: Product) => {
    if (prod.type === "apparel") {
      setCustomizingProduct(prod);
    }
  };

  const handleTriggerBuy = (prod: Product) => {
    if (prod.type === "affiliate") {
      // Open affiliate url
      window.open(prod.buyUrl, "_blank", "noopener,noreferrer");
    } else {
      // Apparel checkout simulation
      setCartItem(prod);
      setCheckoutStep("cart");
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div id="shop-page-container" className="mx-auto max-w-5xl px-4 py-8 font-sans text-slate-200">
      {/* Visual Title Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3 shadow-lg shadow-sky-500/5">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          The Midnight <span className="text-sky-400">Hybrid Shop</span>
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
          Cozy stoner apparel generated on-demand via Printify alongside curated Amazon affiliate gear to supercharge your late-night kitchen setup.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Products Grid (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shop filters bar */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedType === "all"
                  ? "bg-sky-500 text-black shadow-lg shadow-sky-500/20"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setSelectedType("apparel")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedType === "apparel"
                  ? "bg-sky-500 text-black shadow-lg shadow-sky-500/20"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
              }`}
            >
              POD Apparel
            </button>
            <button
              onClick={() => setSelectedType("affiliate")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedType === "affiliate"
                  ? "bg-sky-500 text-black shadow-lg shadow-sky-500/20"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
              }`}
            >
              Affiliate Gear
            </button>
          </div>

          {/* Grid list */}
          <div className="grid gap-6 sm:grid-cols-2">
            {filteredProducts.map((prod) => {
              const isFav = favorites.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md hover:border-white/20 transition-all duration-300 relative overflow-hidden"
                >
                  <div>
                    {/* Image block */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 mb-4">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Floating type badge */}
                      <span className={`absolute top-3 left-3 rounded-md px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase ${
                        prod.type === "apparel"
                          ? "bg-purple-500/90 text-white"
                          : "bg-amber-600/90 text-white"
                      }`}>
                        {prod.type === "apparel" ? "Printify POD" : "Affiliate"}
                      </span>

                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(prod.id)}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                      >
                        <Heart className={`h-4.5 w-4.5 ${isFav ? "fill-pink-500 text-pink-500" : ""}`} />
                      </button>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                        {prod.name}
                      </h3>
                      <div className="flex items-center gap-0.5 shrink-0 text-xs font-mono text-amber-400">
                        <Star className="h-3 w-3 fill-amber-400" />
                        <span>{prod.rating}</span>
                      </div>
                    </div>

                    {/* Price and info */}
                    <div className="text-base font-black text-white font-mono mb-2">
                      ${prod.price.toFixed(2)}
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {prod.type === "apparel" && (
                      <button
                        onClick={() => handleOpenCustomizer(prod)}
                        className="flex-1 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 py-2.5 text-xs font-semibold transition-all"
                      >
                        Customize
                      </button>
                    )}
                    <button
                      onClick={() => handleTriggerBuy(prod)}
                      className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        prod.type === "affiliate"
                          ? "bg-amber-500 text-black hover:bg-amber-400"
                          : "bg-sky-500 text-black hover:bg-sky-400"
                      }`}
                    >
                      <span>{prod.type === "affiliate" ? "Amazon Link" : "Order Custom"}</span>
                      {prod.type === "affiliate" && <ExternalLink className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Printify POD Interactive customizer (5 columns) */}
        <div className="lg:col-span-5">
          {customizingProduct ? (
            <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold font-mono">
                  Printify Customization Deck
                </span>
                <span className="text-[9px] font-mono rounded bg-white/10 px-2 py-0.5 text-slate-400">
                  Interactive Preview
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {customizingProduct.name}
              </h3>

              {/* T-Shirt / Hoodie Mockup Container with customizable styles */}
              <div 
                className="relative aspect-square w-full rounded-2xl flex items-center justify-center mb-6 shadow-xl overflow-hidden transition-colors duration-500 border border-white/5"
                style={{ backgroundColor: selectedColor.hex }}
              >
                {/* Background lighting effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Abstract overlay graphics */}
                <div className="absolute top-4 left-4 text-[9px] font-mono text-white/20 select-none uppercase tracking-widest">
                  Printify POD Layer-X
                </div>

                {/* Simulated Graphic Print on the shirt */}
                <div className="relative z-10 flex flex-col items-center text-center p-6 border-2 border-dashed border-white/30 rounded-xl bg-black/40 backdrop-blur-sm max-w-[200px]">
                  <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-xl shadow-lg mb-2 shadow-amber-500/25 animate-pulse">
                    ☄️
                  </div>
                  <p className="font-black text-xs text-white tracking-widest uppercase mb-1">
                    MIDNIGHT NACHOS
                  </p>
                  <p className="text-[10px] font-mono text-amber-400 font-semibold tracking-wider uppercase break-all px-1">
                    &ldquo;{customText || "Your Phrase Here"}&rdquo;
                  </p>
                  <p className="text-[8px] text-slate-400 mt-2">
                    Custom cheese melt print
                  </p>
                </div>
              </div>

              {/* Color selectors */}
              <div className="mb-5">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono font-bold block mb-2">
                  Select Apparel Base Color:
                </span>
                <div className="flex gap-2">
                  {APP_COLORS.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col)}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${col.bg} ${
                        selectedColor.name === col.name
                          ? "border-sky-400 scale-110 shadow-lg"
                          : "border-transparent hover:scale-105"
                      }`}
                      title={col.name}
                    />
                  ))}
                </div>
                <div className="mt-1 text-[10px] font-mono text-slate-500">
                  Current color: {selectedColor.name}
                </div>
              </div>

              {/* Custom Text input */}
              <div className="mb-6">
                <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-mono font-bold mb-1">
                  Custom Text Print (Embroidered):
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value.substring(0, 20).toUpperCase())}
                  placeholder="e.g., LATE NIGHT VIBE"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/50 transition-all font-mono"
                />
                <div className="mt-1 text-[9px] font-mono text-slate-500">
                  Max 20 chars, all caps automatically.
                </div>
              </div>

              {/* Purchase Custom Hoodie */}
              <button
                onClick={() => handleTriggerBuy(customizingProduct)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black py-3 font-bold text-xs tracking-wider transition-all cursor-pointer shadow-lg shadow-sky-500/10 active:scale-[0.98]"
              >
                <span>PROCEED TO PRINTIFY CHECKOUT</span>
                <span className="font-mono text-[10px] opacity-75">(${customizingProduct.price.toFixed(2)})</span>
              </button>
            </div>
          ) : (
            <div className="sticky top-24 rounded-3xl border border-dashed border-slate-800 bg-slate-950/20 p-8 text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-slate-700 mb-2" />
              <p className="text-xs text-slate-500">
                Select any custom Printify apparel on the left, then use this interactive terminal to preview customized threads before ordering!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Checkout Simulation Modal */}
      {isCheckoutOpen && cartItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#050505] p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-mono"
            >
              &times;
            </button>

            {checkoutStep === "cart" ? (
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">
                  Printify Checkout Desk
                </span>
                <h3 className="text-xl font-bold text-white">Review Custom Specifications</h3>
                
                {/* Specs Box */}
                <div className="rounded-2xl bg-white/5 border border-white/5 p-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Garment:</span>
                    <span className="text-white font-semibold">{cartItem.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Color Palette:</span>
                    <span className="text-white font-semibold">{selectedColor.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Custom Text Embroidery:</span>
                    <span className="text-sky-400 font-mono font-bold">&ldquo;{customText}&rdquo;</span>
                  </div>
                  <div className="flex justify-between text-xs pt-2 border-t border-white/10">
                    <span className="text-slate-400">Base Price:</span>
                    <span className="text-white">${cartItem.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">On-Demand Production (Printify):</span>
                    <span className="text-emerald-400">FREE / INCLUDED</span>
                  </div>
                  <div className="flex justify-between text-sm font-black pt-2 border-t border-white/10 text-white">
                    <span>Total Due:</span>
                    <span>${cartItem.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[10px] text-amber-400 leading-relaxed font-sans">
                  Demo notice: This is a direct Cloudflare integration simulation. In production, this links to our direct Printify Merchant Webhook to route print queues instantly!
                </div>

                <button
                  onClick={() => setCheckoutStep("success")}
                  className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 text-black py-3 text-xs font-bold transition-all shadow-lg shadow-sky-500/10"
                >
                  CONFIRM & PLACE ORDER
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Order Dispatched to Printify!</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    The cheese is melting and the thread counts are aligning. Since your order is custom, it will enter our instant print queue shortly. Keep your vibes cozy!
                  </p>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white py-2.5 text-xs font-semibold hover:bg-white/10 transition-all"
                >
                  Back to Shop
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
