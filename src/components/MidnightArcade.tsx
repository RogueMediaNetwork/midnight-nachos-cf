import React, { useState, useEffect, useRef } from "react";
import { Gamepad2, Trophy, RotateCcw, Play, Sparkles, Flame } from "lucide-react";

// --- GAME 1: MUNCHIE CATCHER DATA ---
interface FallingItem {
  id: number;
  x: number;
  y: number;
  emoji: string;
  type: "good" | "bad";
  points: number;
  speed: number;
  label: string;
}

const GOOD_MUNCHIES = [
  { emoji: "🍕", label: "Nacho Slice", points: 10 },
  { emoji: "🧀", label: "Melting Cheese", points: 15 },
  { emoji: "🍪", label: "Magic Cookie", points: 10 },
  { emoji: "🍟", label: "Salter Fry", points: 5 },
  { emoji: "🍩", label: "Glazed Donut", points: 20 },
  { emoji: "🌮", label: "Late Taco", points: 15 }
];

const BAD_ITEMS = [
  { emoji: "🥦", label: "Raw Celery", points: -10 },
  { emoji: "⏰", label: "Early Alarm", points: -15 },
  { emoji: "🚨", label: "Buzzkill", points: -20 },
  { emoji: "🥬", label: "Boring Lettuce", points: -5 }
];

const STAR_FIELD = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  x: (index * 37 + 11) % 100,
  y: (index * 53 + 7) % 92,
  size: 1 + (index % 3),
  delay: (index % 9) * -0.7,
  duration: 2.8 + (index % 5) * 0.55,
}));

export default function MidnightArcade() {
  const [activeGame, setActiveGame] = useState<"catcher" | "mandala">("catcher");

  // --- GAME 1: MUNCHIE CATCHER STATES ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("munchie_catcher_highscore") || "0");
  });
  const [basketX, setBasketX] = useState(50); // percentage (0 to 100)
  const basketXRef = useRef(basketX);
  useEffect(() => {
    basketXRef.current = basketX;
  }, [basketX]);

  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [gameFeedback, setGameFeedback] = useState<{ id: number; text: string; x: number; y: number; color: string }[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const itemSpawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const itemCounterRef = useRef(0);
  const lastFrameTimeRef = useRef<number | null>(null);

  // Keyboard controls for game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === "ArrowLeft") {
        setBasketX((prev) => Math.max(0, prev - 6));
      } else if (e.key === "ArrowRight") {
        setBasketX((prev) => Math.min(100, prev + 6));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  // Touch and Mouse Slide controls for game
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(2, Math.min(98, x)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isPlaying || !gameAreaRef.current || e.touches.length === 0) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(2, Math.min(98, x)));
  };

  // Start / Stop game logic
  const startGame = () => {
    setScore(0);
    setFallingItems([]);
    setGameFeedback([]);
    lastFrameTimeRef.current = null;
    setIsPlaying(true);
  };

  const stopGame = () => {
    setIsPlaying(false);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (itemSpawnTimerRef.current) {
      clearInterval(itemSpawnTimerRef.current);
      itemSpawnTimerRef.current = null;
    }
    lastFrameTimeRef.current = null;
  };

  // Game ticks and Spawner
  useEffect(() => {
    if (isPlaying) {
      // Game physics ticker
      const updatePhysics = (timestamp: number) => {
        const previousFrame = lastFrameTimeRef.current ?? timestamp;
        const elapsedSeconds = Math.min((timestamp - previousFrame) / 1000, 0.05);
        lastFrameTimeRef.current = timestamp;
        setFallingItems((prevItems) => {
          const updated: FallingItem[] = [];
          for (let item of prevItems) {
            const nextY = item.y + item.speed * elapsedSeconds;
            
            // The basket occupies the lower fifth of the stage. Checking a range
            // lets a player slide beneath a snack before it passes the rim.
            const matchesX = Math.abs(item.x - basketXRef.current) < 10;
            const matchesY = nextY >= 80 && nextY <= 94;

            if (matchesX && matchesY) {
              // Caught item!
              setScore((s) => {
                const nextScore = Math.max(0, s + item.points);
                setHighScore((prevHigh) => {
                  if (nextScore > prevHigh) {
                    localStorage.setItem("munchie_catcher_highscore", String(nextScore));
                    return nextScore;
                  }
                  return prevHigh;
                });
                return nextScore;
              });

              // Add floating splash text
              const feedText = item.points > 0 ? `+${item.points} ${item.label}!` : `${item.points} ${item.label}!`;
              const feedColor = item.points > 0 ? "text-amber-400" : "text-red-400";
              setGameFeedback((prev) => [
                ...prev,
                { id: item.id + Math.random(), text: feedText, x: item.x, y: 75, color: feedColor }
              ]);
              continue;
            }

            if (nextY < 100) {
              updated.push({ ...item, y: nextY });
            }
          }
          return updated;
        });

        // Decay feedback splash words
        setGameFeedback((prev) => prev.map((f) => ({ ...f, y: f.y - 24 * elapsedSeconds })).filter((f) => f.y > 40));

        gameLoopRef.current = requestAnimationFrame(updatePhysics);
      };

      gameLoopRef.current = requestAnimationFrame(updatePhysics);

      // Spawner ticker
      itemSpawnTimerRef.current = setInterval(() => {
        itemCounterRef.current += 1;
        
        // 75% chance good munchie, 25% chance bad distraction
        const isGood = Math.random() > 0.25;
        const preset = isGood 
          ? GOOD_MUNCHIES[Math.floor(Math.random() * GOOD_MUNCHIES.length)]
          : BAD_ITEMS[Math.floor(Math.random() * BAD_ITEMS.length)];

        const newItem: FallingItem = {
          id: itemCounterRef.current,
          x: Math.random() * 90 + 5, // 5% to 95%
          y: -5,
          emoji: preset.emoji,
          type: isGood ? "good" : "bad",
          points: preset.points,
          speed: Math.random() * 7 + 17, // percentage points per second: ~4–6 seconds to the bowl
          label: preset.label
        };

        setFallingItems((prev) => [...prev, newItem]);
      }, 1100);

    } else {
      stopGame();
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      if (itemSpawnTimerRef.current) {
        clearInterval(itemSpawnTimerRef.current);
        itemSpawnTimerRef.current = null;
      }
    };
  }, [isPlaying]);


  // --- GAME 2: PSYCHEDELIC MANDALA MAKER ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [symmetry, setSymmetry] = useState(8);
  const [colorTheme, setColorTheme] = useState<"cheese" | "haze" | "acid" | "rainbow">("rainbow");
  const [lineWidth] = useState(4);
  const [autoRotate, setAutoRotate] = useState(true);
  const rotationAngleRef = useRef(0);
  const isDrawingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Render automatic rotation of elements in Mandala Canvas
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear background with soft transparency for trails
    const drawTrail = () => {
      ctx.fillStyle = "rgba(10, 10, 15, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (autoRotate) {
        rotationAngleRef.current += 0.005;
        // Generate automatic ambient sparkles in center
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotationAngleRef.current);

        const r = 50 + Math.sin(Date.now() / 800) * 20;
        ctx.beginPath();
        for (let i = 0; i < symmetry; i++) {
          ctx.rotate((Math.PI * 2) / symmetry);
          
          let color = "#eab308"; // default cheese
          if (colorTheme === "haze") color = "#d946ef";
          if (colorTheme === "acid") color = "#22c55e";
          if (colorTheme === "rainbow") color = `hsl(${(Date.now() / 20) % 360}, 90%, 65%)`;

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(r, 0, 3 + Math.sin(Date.now() / 200) * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "rgba(255,255,255,0.03)";
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.lineTo(r, 0);
          ctx.stroke();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(drawTrail);
    };

    drawTrail();

    return () => cancelAnimationFrame(animId);
  }, [symmetry, colorTheme, autoRotate]);

  // Handle Resize of Mandala Canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = Math.max(350, canvas.parentElement.clientHeight || 450);
      
      // Paint Initial Background
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0a0a0f";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeGame]);

  // Drawing kaleidoscope lines
  const drawMandalaLine = (x1: number, y1: number, x2: number, y2: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Translate to center
    const rx1 = x1 - cx;
    const ry1 = y1 - cy;
    const rx2 = x2 - cx;
    const ry2 = y2 - cy;

    ctx.save();
    ctx.translate(cx, cy);

    let strokeColor = "#eab308";
    if (colorTheme === "haze") strokeColor = `hsl(${280 + Math.sin(Date.now()/500)*30}, 95%, 60%)`;
    else if (colorTheme === "acid") strokeColor = `hsl(${120 + Math.cos(Date.now()/500)*20}, 95%, 55%)`;
    else if (colorTheme === "rainbow") strokeColor = `hsl(${(Date.now() / 15) % 360}, 95%, 60%)`;
    else if (colorTheme === "cheese") strokeColor = `hsl(${45 + Math.sin(Date.now()/300)*10}, 100%, 55%)`;

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Add glowing filter
    ctx.shadowBlur = 10;
    ctx.shadowColor = strokeColor;

    for (let i = 0; i < symmetry; i++) {
      ctx.rotate((Math.PI * 2) / symmetry);
      
      // Normal slice
      ctx.beginPath();
      ctx.moveTo(rx1, ry1);
      ctx.lineTo(rx2, ry2);
      ctx.stroke();

      // Mirror reflection slice
      ctx.beginPath();
      ctx.moveTo(rx1, -ry1);
      ctx.lineTo(rx2, -ry2);
      ctx.stroke();
    }

    ctx.restore();
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    lastMousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    drawMandalaLine(
      lastMousePosRef.current.x,
      lastMousePosRef.current.y,
      curX,
      curY
    );

    lastMousePosRef.current = { x: curX, y: curY };
  };

  const handleCanvasMouseUpOrLeave = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };


  return (
    <div id="midnight-arcade-container" className="mx-auto max-w-5xl px-4 py-8 font-sans text-slate-200">
      {/* Title block */}
      <div className="mb-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3 shadow-lg shadow-purple-500/5">
          <Gamepad2 className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          The Midnight <span className="text-purple-400">Bodega Arcade</span>
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
          Chill, visually rich toys and retro games to keep your mind stimulated and cozy while hanging out in our late-night couch corner.
        </p>
      </div>

      {/* Tabs Selection Bar */}
      <div className="mb-6 flex justify-center gap-2">
        <button
          onClick={() => {
            setActiveGame("catcher");
            stopGame();
          }}
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
            activeGame === "catcher"
              ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/10"
              : "bg-white/5 hover:bg-white/10 text-slate-400 border-white/5"
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>🎮 Munchie Catcher</span>
        </button>
        <button
          onClick={() => {
            setActiveGame("mandala");
            stopGame();
          }}
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
            activeGame === "mandala"
              ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/10"
              : "bg-white/5 hover:bg-white/10 text-slate-400 border-white/5"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>🌌 Acid Mandala Maker</span>
        </button>
      </div>

      {/* Game Frame Area */}
      <div className="rounded-3xl border border-white/10 bg-black/60 p-1 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {activeGame === "catcher" ? (
          /* MUNCHIE CATCHER GAMEBOARD */
          <div className="p-6">
            <div className="flex flex-col justify-between gap-4 border-b border-white/5 pb-4 mb-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Munchie Catcher 2D</span>
                  <span className="text-xs font-normal text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                    Retro
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Slide your bowl (mouse/drag/touch) left & right to catch snacks. Avoid Alarm Clocks & green veggies!
                </p>
              </div>

              {/* Scoreboard stats */}
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-white/5 px-4 py-2 text-center border border-white/5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-bold">
                    Chill Score
                  </div>
                  <div className="text-xl font-black font-mono text-amber-400">
                    {score}
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 px-4 py-2 text-center border border-white/5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-bold flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-yellow-500 inline" />
                    <span>High Score</span>
                  </div>
                  <div className="text-xl font-black font-mono text-white">
                    {highScore}
                  </div>
                </div>
              </div>
            </div>

            {/* Core Game stage */}
            <div 
              ref={gameAreaRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative h-[380px] w-full rounded-2xl bg-[#030306] border border-white/5 overflow-hidden cursor-crosshair select-none"
            >
              {/* Star background decoration */}
              <div className="arcade-starfield" aria-hidden="true">
                {STAR_FIELD.map((star) => (
                  <span
                    className="arcade-star"
                    key={star.id}
                    style={{
                      left: `${star.x}%`,
                      top: `${star.y}%`,
                      width: `${star.size}px`,
                      height: `${star.size}px`,
                      animationDelay: `${star.delay}s`,
                      animationDuration: `${star.duration}s`,
                    }}
                  />
                ))}
              </div>

              {/* Falling Emojis */}
              {fallingItems.map((item) => (
                <div
                  key={item.id}
                  className="arcade-falling-item absolute text-3xl select-none"
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {item.emoji}
                </div>
              ))}

              {/* Floating score text feedback animations */}
              {gameFeedback.map((f) => (
                <div
                  key={f.id}
                  className={`absolute font-black text-sm tracking-wider font-mono select-none pointer-events-none transition-all duration-300 ${f.color}`}
                  style={{
                    left: `${f.x}%`,
                    top: `${f.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {f.text}
                </div>
              ))}

              {/* Catcher Basket representation */}
              <div
                className="absolute bottom-5 h-12 w-20 rounded-2xl bg-gradient-to-t from-purple-900 to-purple-600 flex flex-col items-center justify-center border-2 border-purple-400/50 shadow-lg shadow-purple-500/10 select-none transition-transform duration-75"
                style={{
                  left: `${basketX}%`,
                  transform: "translateX(-50%)",
                }}
              >
                {/* Emoji in bowl */}
                <span className="text-2xl mt-[-15px]">🥣</span>
                <span className="text-[9px] font-bold font-mono tracking-wider text-purple-200 mt-0.5">
                  MUNCHIE BAG
                </span>
                {/* Visual wheels or energy pads */}
                <div className="absolute -bottom-1 flex justify-between w-full px-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                  <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                </div>
              </div>

              {/* Overlay states (Play / Reset) */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm z-10">
                  <div className="h-14 w-14 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                    <Gamepad2 className="h-7 w-7 text-purple-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Midnight Snack Raid</h4>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
                    A shower of delicious late-night munchies is falling from the starry sky! Move your bowl to catch them and score points, but watch out for alarms and greens!
                  </p>
                  <button
                    onClick={startGame}
                    className="rounded-full bg-purple-500 hover:bg-purple-400 text-black px-8 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20 active:scale-95"
                  >
                    <Play className="h-4 w-4 fill-black" />
                    <span>Start Raid</span>
                  </button>
                </div>
              )}
            </div>

            {/* Keyboard tips */}
            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>⌨️ Pro-tip: You can also use Left & Right arrow keys</span>
              <span>Couch Level: Maximum Fun</span>
            </div>
          </div>
        ) : (
          /* PSYCHEDELIC MANDALA KALEIDOSCOPE */
          <div className="p-6">
            <div className="flex flex-col justify-between gap-4 border-b border-white/5 pb-4 mb-4 md:flex-row md:items-center">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Acid Mandala Canvas</span>
                  <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Hypnotic
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Drag, draw, or slide your cursor over the canvas to create glowing symmetric geometric trails. Pure relaxation.
                </p>
              </div>

              {/* Controls and theme selections */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Theme Selector */}
                <div className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold mr-1">
                    Haze:
                  </span>
                  {(["cheese", "haze", "acid", "rainbow"] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setColorTheme(theme)}
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded transition-all ${
                        colorTheme === theme
                          ? "bg-purple-500 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>

                {/* Symmetry Control */}
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 border border-white/5 text-xs">
                  <span className="text-slate-500 font-mono">Symmetry:</span>
                  <select
                    value={symmetry}
                    onChange={(e) => setSymmetry(parseInt(e.target.value))}
                    className="bg-transparent text-white font-mono font-bold focus:outline-none cursor-pointer text-xs"
                  >
                    <option value={4} className="bg-slate-950 text-white">4 Slices</option>
                    <option value={6} className="bg-slate-950 text-white">6 Slices</option>
                    <option value={8} className="bg-slate-950 text-white">8 Slices</option>
                    <option value={12} className="bg-slate-950 text-white">12 Slices</option>
                    <option value={16} className="bg-slate-950 text-white">16 Slices</option>
                  </select>
                </div>

                {/* Auto Rotate button */}
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all border ${
                    autoRotate
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {autoRotate ? "Auto-Pilot: On" : "Auto-Pilot: Off"}
                </button>

                {/* Reset Board */}
                <button
                  onClick={clearCanvas}
                  className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-1.5 text-xs font-bold transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5 inline mr-1" />
                  Reset
                </button>
              </div>
            </div>

            {/* Core Mandala Area */}
            <div className="relative rounded-2xl overflow-hidden bg-[#0a0a0f] border border-white/5">
              <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUpOrLeave}
                onMouseLeave={handleCanvasMouseUpOrLeave}
                className="block w-full h-[380px] cursor-crosshair select-none"
              />

              {/* Floating user prompt */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500 bg-slate-950/80 px-4 py-1.5 rounded-full border border-white/5 tracking-wider uppercase pointer-events-none text-center">
                ✨ Paint with your mouse or tap to ignite trails
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
