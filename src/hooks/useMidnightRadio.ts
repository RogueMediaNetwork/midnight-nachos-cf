import { useEffect, useRef, useState } from "react";

const modes = [[0, 3, 7, 10], [0, 2, 7, 9], [0, 5, 7, 10], [0, 3, 5, 8], [0, 2, 5, 9]];

export function useMidnightRadio() {
  const [playing, setPlaying] = useState(false); const contextRef = useRef<AudioContext | null>(null); const timerRef = useRef<number | null>(null); const nodesRef = useRef<AudioNode[]>([]);
  const stop = () => { if (timerRef.current) window.clearInterval(timerRef.current); timerRef.current = null; nodesRef.current.forEach(node => { try { node.disconnect(); } catch {} }); nodesRef.current = []; setPlaying(false); };
  const playMode = (index: number) => { const context = contextRef.current; if (!context) return; nodesRef.current.forEach(node => { try { node.disconnect(); } catch {} }); const master = context.createGain(); master.gain.value = 0.045; master.connect(context.destination); nodesRef.current = [master]; const now = context.currentTime; const root = 110 * Math.pow(2, index / 12); modes[index].forEach((step, note) => { const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.type = note % 2 ? "triangle" : "sine"; oscillator.frequency.value = root * Math.pow(2, step / 12); gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(0.1 / (note + 1), now + 1.8 + note * 0.2); gain.gain.exponentialRampToValueAtTime(0.0001, now + 17); oscillator.connect(gain).connect(master); oscillator.start(now); oscillator.stop(now + 17.5); nodesRef.current.push(oscillator, gain); }); };
  const toggle = async () => { if (playing) return stop(); const context = contextRef.current ?? new AudioContext(); contextRef.current = context; await context.resume(); let index = Math.floor(Math.random() * modes.length); playMode(index); timerRef.current = window.setInterval(() => { index = (index + 1) % modes.length; playMode(index); }, 18000); setPlaying(true); };
  useEffect(() => () => stop(), []);
  return { playing, toggle };
}
