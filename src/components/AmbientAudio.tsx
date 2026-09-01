import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Audio ambiental / binaural en bucle, generado con Web Audio.
 * Dos osciladores levemente desafinados (200 Hz / 204 Hz) separados por canal
 * producen un pulso binaural de 4 Hz. Entra y sale siempre con fundido suave.
 */
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

      const build = (freq: number, pan: number) => {
        const osc = ctx!.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        const panner = ctx!.createStereoPanner();
        panner.pan.value = pan;
        osc.connect(panner).connect(master);
        osc.start();
      };
      build(200, -1);
      build(204, 1);
    }
    await ctx.resume();
    const g = gainRef.current;
    if (g) {
      const t = ctx.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0.06, t + 2.5); // fade-in
    }
  }

  function stop() {
    const ctx = ctxRef.current;
    const g = gainRef.current;
    if (!ctx || !g) return;
    const t = ctx.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value, t);
    g.gain.linearRampToValueAtTime(0.0001, t + 1.8); // fade-out
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
      title={on ? "Silenciar ambiente binaural" : "Ambiente binaural"}
      className={`rounded-full border border-border/70 bg-card/70 p-2.5 backdrop-blur transition-colors ${
        on ? "border-neon/50 text-neon" : "text-muted-foreground hover:text-primary"
      } ${className}`}
    >
      {on ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </button>
  );
}
