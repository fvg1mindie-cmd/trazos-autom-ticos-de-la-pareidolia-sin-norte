import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Campo binaural armónico generado con Web Audio.
 * Cada nota del acorde La menor 9 suena como un par estéreo separado por 4 Hz:
 * el oído percibe armonía y, con auriculares, un pulso binaural suave.
 */
const VOCES: { freq: number; gain: number; lfoHz: number }[] = [
  { freq: 110, gain: 0.34, lfoHz: 0.035 }, // A2
  { freq: 164.81, gain: 0.24, lfoHz: 0.043 }, // E3
  { freq: 220, gain: 0.2, lfoHz: 0.051 }, // A3
  { freq: 246.94, gain: 0.14, lfoHz: 0.039 }, // B3
  { freq: 261.63, gain: 0.17, lfoHz: 0.047 }, // C4
];

export function AmbientAudio({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  async function start() {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    let ctx = ctxRef.current;
    if (!ctx) {
      ctx = new AC();
      ctxRef.current = ctx;
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      gainRef.current = master;

      // Cada nota se duplica en los canales izquierdo y derecho con 4 Hz
      // de diferencia. El conjunto forma un acorde, no un tono aislado.
      VOCES.forEach((v, i) => {
        const voz = ctx!.createGain();
        voz.gain.value = v.gain;
        const lfo = ctx!.createOscillator();
        lfo.frequency.value = v.lfoHz;
        const lfoGain = ctx!.createGain();
        lfoGain.gain.value = v.gain * 0.22;
        lfo.connect(lfoGain).connect(voz.gain);
        voz.connect(master);

        [-1, 1].forEach((pan) => {
          const osc = ctx!.createOscillator();
          osc.type = i < 2 ? "sine" : "triangle";
          osc.frequency.value = v.freq + (pan === 1 ? 4 : 0);
          const filtro = ctx!.createBiquadFilter();
          filtro.type = "lowpass";
          filtro.frequency.value = 720;
          filtro.Q.value = 0.35;
          const canal = ctx!.createGain();
          canal.gain.value = 0.5;
          const panner = ctx!.createStereoPanner();
          panner.pan.value = pan;
          osc.connect(filtro).connect(canal).connect(panner).connect(voz);
          osc.start();
        });
        lfo.start();
      });
    }
    await ctx.resume();
    const g = gainRef.current;
    if (g) {
      const t = ctx.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0.16, t + 3); // fade-in
    }
  }

  function stop() {
    const ctx = ctxRef.current;
    const g = gainRef.current;
    if (!ctx || !g) return;
    const t = ctx.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value, t);
    g.gain.linearRampToValueAtTime(0.0001, t + 2); // fade-out
  }

  function toggle() {
    if (on) {
      stop();
      setOn(false);
    } else {
      void start();
      setOn(true);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Silenciar el ambiente sonoro" : "Activar el ambiente sonoro"}
      title={on ? "Silenciar ambiente" : "Ambiente armónico"}
      className={`rounded-full border border-border/70 bg-card/70 p-2.5 backdrop-blur transition-colors ${
        on ? "border-neon/50 text-neon" : "text-muted-foreground hover:text-primary"
      } ${className}`}
    >
      {on ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </button>
  );
}
