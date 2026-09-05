import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Audio ambiental armónico en bucle, generado con Web Audio.
 * Un acorde de pad (La menor 9: A2, E3, B3, C4) con filtros suaves,
 * movimiento lento de volumen (LFO) por voz y un leve pulso binaural
 * (110 Hz / 114 Hz) debajo. Entra y sale siempre con fundido.
 */
const VOCES: { freq: number; gain: number; lfoHz: number; lfoDepth: number }[] = [
  { freq: 110.0, gain: 0.5, lfoHz: 0.05, lfoDepth: 0.35 }, // A2 — base
  { freq: 164.81, gain: 0.32, lfoHz: 0.07, lfoDepth: 0.4 }, // E3
  { freq: 246.94, gain: 0.22, lfoHz: 0.09, lfoDepth: 0.45 }, // B3
  { freq: 261.63, gain: 0.16, lfoHz: 0.06, lfoDepth: 0.5 }, // C4
  { freq: 329.63, gain: 0.1, lfoHz: 0.11, lfoDepth: 0.5 }, // E4 — brillo
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

      // Pad armónico: cada voz es un triángulo filtrado con un LFO de volumen
      // lento y desfasado, así el acorde "respira" y nunca suena estático.
      VOCES.forEach((v, i) => {
        const osc = ctx!.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = v.freq;
        osc.detune.value = (i % 2 === 0 ? 1 : -1) * 3; // leve coro

        const filtro = ctx!.createBiquadFilter();
        filtro.type = "lowpass";
        filtro.frequency.value = 900;
        filtro.Q.value = 0.4;

        const voz = ctx!.createGain();
        voz.gain.value = v.gain;

        const lfo = ctx!.createOscillator();
        lfo.frequency.value = v.lfoHz;
        const lfoGain = ctx!.createGain();
        lfoGain.gain.value = v.gain * v.lfoDepth;
        lfo.connect(lfoGain).connect(voz.gain);

        const panner = ctx!.createStereoPanner();
        panner.pan.value = (i / (VOCES.length - 1)) * 1.2 - 0.6;

        osc.connect(filtro).connect(voz).connect(panner).connect(master);
        osc.start();
        lfo.start();
      });

      // Pulso binaural suave debajo (110 / 114 Hz → 4 Hz)
      const binaural = (freq: number, pan: number) => {
        const osc = ctx!.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        const g = ctx!.createGain();
        g.gain.value = 0.18;
        const panner = ctx!.createStereoPanner();
        panner.pan.value = pan;
        osc.connect(g).connect(panner).connect(master);
        osc.start();
      };
      binaural(110, -1);
      binaural(114, 1);
    }
    await ctx.resume();
    const g = gainRef.current;
    if (g) {
      const t = ctx.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0.14, t + 3); // fade-in
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
