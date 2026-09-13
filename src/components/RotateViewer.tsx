import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, RotateCw, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";

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
  showControls?: boolean;
  fill?: boolean;
}) {
  const [angle, setAngle] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startPointer: number; startAngle: number } | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved !== null) setAngle(Number(saved) || 0);
    } catch {
      /* sin almacenamiento */
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

  const changeZoom = useCallback(
    (delta: number) => setZoom((value) => Math.min(4, Math.max(1, value + delta))),
    [],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    // Solo capturar si es con el botón primario o touch single
    dragState.current = {
      startPointer: pointerAngle(e.clientX, e.clientY),
      startAngle: angle,
    };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current || !dragging) return;
    const delta = pointerAngle(e.clientX, e.clientY) - dragState.current.startPointer;
    setAngle(dragState.current.startAngle + delta);
  };

  const onPointerUp = () => {
    dragState.current = null;
    setDragging(false);
    persist(angle);
  };

  const step = (delta: number) => persist(Math.round(angle + delta));
  const reset = () => persist(0);

  return (
    <div className={`select-none ${fill ? "flex h-full flex-col" : ""}`}>
      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onDoubleClick={reset}
        style={{ touchAction: "pan-y" }}
        className={`overflow-hidden outline-none ${
          fill
            ? "flex-1 rounded-none"
            : "ring-glow rounded-2xl border border-border/70 bg-card"
        } ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {src ? (
          <div
            className={`flex w-full items-center justify-center ${
              fill ? "h-full px-4 pt-16 pb-10" : "aspect-square p-4"
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
          </div>
        )}
      </div>

      <div
        className={`transition-opacity duration-500 ${
          showControls ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => changeZoom(-0.25)}
            disabled={zoom <= 1}
            className="rounded-full border border-border/70 bg-card/80 p-2.5 text-muted-foreground backdrop-blur hover:text-primary"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => step(-15)}
            className="rounded-full border border-border/70 bg-card/80 p-2.5 text-muted-foreground backdrop-blur hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-border/70 bg-card/80 px-4 py-2.5 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase backdrop-blur hover:text-neon"
          >
            <span className="inline-flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              {Math.round(((angle % 360) + 360) % 360)}°
            </span>
          </button>
          <button
            type="button"
            onClick={() => step(15)}
            className="rounded-full border border-border/70 bg-card/80 p-2.5 text-muted-foreground backdrop-blur hover:text-primary"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => changeZoom(0.25)}
            disabled={zoom >= 4}
            className="rounded-full border border-border/70 bg-card/80 p-2.5 text-muted-foreground backdrop-blur hover:text-primary"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
