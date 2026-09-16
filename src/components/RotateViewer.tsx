import React, { useState, useRef, useEffect } from "react";
import { 
  RotateCw, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize, 
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface RotateViewerProps {
  src: string;
  alt: string;
  storageKey?: string;
  showControls?: boolean;
  fill?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

export function RotateViewer({
  src,
  alt,
  storageKey,
  showControls = true,
  fill = false,
  onPrev,
  onNext
}: RotateViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState<number>(0);
  // Arranca con zoom inicial aplicado (1.5x)
  const [scale, setScale] = useState<number>(1.5);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) setRotation(Number(saved));
    }
  }, [storageKey]);

  // Centrar el scroll del visor cuando carga o cambia la foto
  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    }
  }, [src]);

  const handleRotate = (degrees: number) => {
    const newRot = (rotation + degrees + 360) % 360;
    setRotation(newRot);
    if (storageKey) {
      localStorage.setItem(storageKey, String(newRot));
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => console.error(err));
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => console.error(err));
    }
  };

  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-background overflow-auto ${
        fill ? "min-h-[100svh]" : "min-h-[600px]"
      } ${isFullscreen ? "bg-black" : ""}`}
    >
      {/* Área flexible que permite expansión limpia al hacer zoom sin desfasar el inicio */}
      <div className="min-w-full min-h-full flex items-center justify-center p-20">
        <div 
          className="transition-transform duration-300 ease-out flex items-center justify-center m-auto"
          style={{
            transform: `rotate(${rotation}deg) scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-none w-auto h-auto max-h-[70vh] object-contain select-none pointer-events-auto shadow-2xl"
            draggable={false}
          />
        </div>
      </div>

      {/* Flecha Anterior (Izquierda) */}
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          title="Imagen anterior"
          className="fixed left-3 top-1/2 -translate-y-1/2 z-40 rounded-full bg-background/50 p-2 text-foreground/80 backdrop-blur hover:bg-background/80 hover:text-foreground transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Flecha Siguiente (Derecha) */}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          title="Siguiente imagen"
          className="fixed right-3 top-1/2 -translate-y-1/2 z-40 rounded-full bg-background/50 p-2 text-foreground/80 backdrop-blur hover:bg-background/80 hover:text-foreground transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Barra de herramientas en la posición actual */}
      {showControls && (
        <div className="fixed right-14 bottom-6 z-50 flex flex-col items-center gap-2 rounded-full border border-border/70 bg-background/80 p-2 backdrop-blur shadow-2xl">
          <button
            type="button"
            onClick={() => handleRotate(-90)}
            title="Girar 90° a la izquierda"
            className="rounded-full p-2 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => handleRotate(90)}
            title="Girar 90° a la derecha"
            className="rounded-full p-2 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          <span className="w-4 h-[1px] bg-border/60 my-1" />

          {/* Zoom en pasos de 0.25 hasta máximo 3.0 */}
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(s + 0.25, 3.0))}
            title="Acercar (Zoom +)"
            className="rounded-full p-2 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          {/* Zoom para alejar en pasos de 0.25 hasta mínimo 0.4 */}
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(s - 0.25, 0.4))}
            title="Alejar (Zoom -)"
            className="rounded-full p-2 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setScale(1.5);
              setRotation(0);
            }}
            title="Restablecer vista"
            className="rounded-full p-2 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <span className="w-4 h-[1px] bg-border/60 my-1" />

          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            className="rounded-full p-2 text-primary hover:bg-primary/20 transition-colors"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
