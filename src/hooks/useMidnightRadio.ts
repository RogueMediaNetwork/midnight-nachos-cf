import { useEffect, useRef, useState } from "react";

export function useMidnightRadio() {
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  const toggle = async () => {
    if (playing) return stop();
    try {
      const audio = audioRef.current ?? new Audio("/audio/psychedelic-crater.mp3");
      audio.preload = "auto";
      audio.loop = true;
      audio.volume = 0.42;
      audioRef.current = audio;
      await audio.play();
      setUnavailable(false);
      setPlaying(true);
    } catch {
      stop();
      setUnavailable(true);
    }
  };

  useEffect(() => () => { audioRef.current?.pause(); audioRef.current = null; }, []);
  return { playing, unavailable, toggle };
}
