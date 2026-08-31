import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, RotateCw, RefreshCw } from "lucide-react";

/**
 * Visor de obra con giro libre de 360°.
 * "Sin norte": la obra no tiene orientación fija; el espectador decide.
 * - Arrastrar sobre la imagen gira libremente.
 * - Botones giran en pasos de 15°; doble clic / botón central reorienta a 0°.
 */
export function RotateViewer({
  src,
  alt,
  storageKey,
}: {
  src: string;
  alt: string;
  storageKey: string;
}) {
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startPointer: number; startAngle: number } | null>(null);

  // Restaurar la orientación elegida la última vez
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved !== null) setAngle(Number(saved) || 0);
    } catch {
      /* sin almacenamiento disponible */
    }
  }, [storageKey]);

  const persist = useCallback(
    (a: number) => {
      setAngle(a);
      try {
        window.localStorage.setItem(storageKey, String(Math.round(a)));
      } catch {
        /* ignorar */
      }
    },
    [storageKey],
  );

  const pointerAngle = (clientX: number, clientY: number) => {
    const el = frameRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const dx = clientX - (r.left + r.width / 2);
    const dy = clientY - (r.top + r.height / 2);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragState.current = {
      startPointer: pointerAngle(e.clientX, e.clientY),
      startAngle: angle,
    };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const delta = pointerAngle(e.clientX, e.clientY) - dragState.current.startPointer;
    setAngle(dragState.current.startAngle + delta);
  };

  const onPointerUp = () => {
    if (!dragState.current) return;
    dragState.current = null;
    setDragging(false);
    setAngle((a) => {
      try {
        window.localStorage.setItem(storageKey, String(Math.round(a)));
      } catch {
        /* ignorar */
      }
      return a;
    });
  };

  const step = (delta: number) => persist(Math.round(angle + delta));
  const reset = () => persist(0);

  return (
    <div className="select-none">
      <div
        ref={frameRef}
        role="slider"
        aria-label="Orientación de la obra"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(((angle % 360) + 360) % 360)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-15);
          if (e.key === "ArrowRight") step(15);
          if (e.key === "Home") reset();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={reset}
        className={`ring-glow touch-none overflow-hidden rounded-2xl border border-border/70 bg-card outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {src ? (
          <div className="flex aspect-square w-full items-center justify-center p-4">
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="max-h-full max-w-full object-contain will-change-transform"
              style={{
                transform: `rotate(${angle}deg)`,
                transition: dragging ? "none" : "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)",
              }}
            />
          </div>
        ) : (
          <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
              Obra pendiente
            </span>
            <span className="max-w-[22ch] text-sm text-muted-foreground/70">
              La imagen de esta obra aún no fue subida al archivo.
            </span>
          </div>
        )}
      </div>

      {/* Controles de giro */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => step(-15)}
          aria-label="Girar 15 grados a la izquierda"
          className="rounded-full border border-border/70 bg-card p-2.5 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Volver a la orientación original"
          className="rounded-full border border-border/70 bg-card px-4 py-2.5 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:border-neon/50 hover:text-neon"
        >
          <span className="inline-flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            {Math.round(((angle % 360) + 360) % 360)}°
          </span>
        </button>
        <button
          type="button"
          onClick={() => step(15)}
          aria-label="Girar 15 grados a la derecha"
          className="rounded-full border border-border/70 bg-card p-2.5 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <RotateCw className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
        Sin norte · arrastrá para girar la obra
      </p>
    </div>
  );
}
