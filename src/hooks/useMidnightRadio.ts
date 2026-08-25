import { useEffect, useRef, useState } from "react";

type WebkitWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

const modes = [
  { root: 146.83, notes: [0, 3, 7, 10, 7, 3, 12, 10] },
  { root: 164.81, notes: [0, 2, 7, 9, 7, 2, 12, 9] },
  { root: 174.61, notes: [0, 5, 7, 10, 7, 5, 12, 10] },
  { root: 130.81, notes: [0, 3, 5, 8, 5, 3, 10, 8] },
  { root: 155.56, notes: [0, 2, 5, 9, 5, 2, 12, 9] },
];

export function useMidnightRadio() {
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const modeTimerRef = useRef<number | null>(null);
  const noteTimerRef = useRef<number | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);

  const clearNodes = () => {
    nodesRef.current.forEach(node => {
      try { if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) node.stop(); } catch {}
      try { node.disconnect(); } catch {}
    });
    nodesRef.current = [];
  };

  const stop = () => {
    if (modeTimerRef.current) window.clearInterval(modeTimerRef.current);
    if (noteTimerRef.current) window.clearInterval(noteTimerRef.current);
    modeTimerRef.current = null;
    noteTimerRef.current = null;
    clearNodes();
    setPlaying(false);
  };

  const playMode = (modeIndex: number) => {
    const context = contextRef.current;
    if (!context) return;
    if (noteTimerRef.current) window.clearInterval(noteTimerRef.current);
    noteTimerRef.current = null;
    clearNodes();
    const mode = modes[modeIndex];
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    master.gain.setValueAtTime(0.18, context.currentTime);
    compressor.threshold.value = -22;
    compressor.knee.value = 16;
    compressor.ratio.value = 7;
    compressor.attack.value = 0.02;
    compressor.release.value = 0.3;
    master.connect(compressor).connect(context.destination);
    nodesRef.current = [master, compressor];

    const makePad = (frequency: number, level: number, type: OscillatorType) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      filter.type = "lowpass";
      filter.frequency.value = 1_050;
      filter.Q.value = 0.7;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(level, context.currentTime + 1.1);
      oscillator.connect(filter).connect(gain).connect(master);
      oscillator.start();
      nodesRef.current.push(oscillator, filter, gain);
    };

    makePad(mode.root / 2, 0.11, "sine");
    makePad(mode.root * Math.pow(2, 7 / 12) / 2, 0.045, "triangle");

    const playNote = (step: number) => {
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      oscillator.type = step % 3 === 0 ? "sine" : "triangle";
      oscillator.frequency.value = mode.root * Math.pow(2, (mode.notes[step % mode.notes.length] + 12) / 12);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1_850, now);
      filter.frequency.exponentialRampToValueAtTime(620, now + 1.35);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.19, now + 0.045);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.45);
      oscillator.connect(filter).connect(gain).connect(master);
      oscillator.start(now);
      oscillator.stop(now + 1.55);
      nodesRef.current.push(oscillator, filter, gain);
    };

    let step = 0;
    playNote(step);
    noteTimerRef.current = window.setInterval(() => { step += 1; playNote(step); }, 1_550);
  };

  const toggle = async () => {
    if (playing) return stop();
    const AudioContextConstructor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
    if (!AudioContextConstructor) { setUnavailable(true); return; }
    try {
      const context = contextRef.current ?? new AudioContextConstructor();
      contextRef.current = context;
      await context.resume();
      let modeIndex = Math.floor(Math.random() * modes.length);
      playMode(modeIndex);
      modeTimerRef.current = window.setInterval(() => { modeIndex = (modeIndex + 1) % modes.length; playMode(modeIndex); }, 18_600);
      setUnavailable(false);
      setPlaying(true);
    } catch {
      stop();
      setUnavailable(true);
    }
  };

  useEffect(() => () => stop(), []);
  return { playing, unavailable, toggle };
}
