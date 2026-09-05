import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, RotateCw, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";

/**
 * Visor de obra con giro libre de 360° en el plano (rotación 2D sobre el eje Z).
 * Sin perspectiva ni transformaciones 3D: la textura del papel se conserva intacta.
 * "Sin norte": la obra no tiene orientación fija; el espectador la detiene donde quiera.
 */
export function RotateViewer({
  src,
  alt,
  storageKey,
  showControls = true,
  fill = false,
}: {
  src: string;
  alt: string;
  storageKey: string;
  /** Oculta con fundido la barra de controles (el gesto de giro sigue activo). */
  showControls?: boolean;
  /** Modo inmersivo: la obra ocupa todo el alto disponible, sin marco. */
  fill?: boolean;
}) {
  const [angle, setAngle] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startPointer: number; startAngle: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchState = useRef<{ distance: number; zoom: number } | null>(null);

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
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      if (a && b) {
        pinchState.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom };
        dragState.current = null;
      }
    } else {
      dragState.current = {
        startPointer: pointerAngle(e.clientX, e.clientY),
        startAngle: angle,
      };
    }
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (pointers.current.has(e.pointerId)) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }
    if (pointers.current.size === 2 && pinchState.current) {
      const [a, b] = [...pointers.current.values()];
      if (a && b) {
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        setZoom(Math.min(4, Math.max(1, pinchState.current.zoom * (distance / pinchState.current.distance))));
      }
      return;
    }
    if (!dragState.current) return;
    const delta = pointerAngle(e.clientX, e.clientY) - dragState.current.startPointer;
    setAngle(dragState.current.startAngle + delta);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchState.current = null;
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
  const changeZoom = (delta: number) => setZoom((value) => Math.min(4, Math.max(1, value + delta)));

  return (
    <div className={`select-none ${fill ? "flex h-full flex-col" : ""}`}>
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
        onWheel={(e) => {
          e.preventDefault();
          changeZoom(e.deltaY < 0 ? 0.2 : -0.2);
        }}
        onDoubleClick={reset}
        className={`touch-none overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          fill
            ? "flex-1 rounded-none"
            : "ring-glow rounded-2xl border border-border/70 bg-card"
        } ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {src ? (
          <div
            className={`flex w-full items-center justify-center ${
              fill ? "h-full p-0" : "aspect-square p-4"
            }`}
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="max-h-full max-w-full object-contain will-change-transform"
              style={{
                transform: `rotate(${angle}deg) scale(${zoom})`,
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

      {/* Controles de giro (colapsables con fundido) */}
      <div
        className={`transition-opacity duration-500 ${
          showControls ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!showControls}
      >
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => changeZoom(-0.25)}
            disabled={zoom <= 1}
            aria-label="Alejar la obra"
            className="rounded-full border border-border/70 bg-card/80 p-2.5 text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-30"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => step(-15)}
            aria-label="Girar 15 grados a la izquierda"
            className="rounded-full border border-border/70 bg-card/80 p-2.5 text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Volver a la orientación original"
            className="rounded-full border border-border/70 bg-card/80 px-4 py-2.5 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase backdrop-blur transition-colors hover:border-neon/50 hover:text-neon"
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
            className="rounded-full border border-border/70 bg-card/80 p-2.5 text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-primary"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => changeZoom(0.25)}
            disabled={zoom >= 4}
            aria-label="Agrandar la obra"
            className="rounded-full border border-border/70 bg-card/80 p-2.5 text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-30"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 pb-1 text-center font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
          Sin norte · arrastrá para girar la obra
        </p>
      </div>
    </div>
  );
}
