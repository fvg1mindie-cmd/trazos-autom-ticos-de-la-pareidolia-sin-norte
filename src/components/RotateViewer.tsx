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
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [initialRotation, setInitialRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) setRotation(Number(saved));
    }
  }, [storageKey]);

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

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

  // Lógica de interacción con la "manito"
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY - position.y });
    setInitialRotation(rotation);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    if (scale > 1) {
      // Con Zoom: la manito desplaza la imagen (Pan)
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - (dragStart.y - position.y)
      });
    } else {
      // Sin Zoom (escala 1): la manito gira la imagen al arrastrar horizontalmente
      const deltaX = e.clientX - dragStart.x;
      const newAngle = (initialRotation + deltaX * 0.5 + 360) % 360;
      setRotation(Math.round(newAngle));
    }
  };

  const handleMouseUp = () => {
    if (isDragging && storageKey) {
      localStorage.setItem(storageKey, String(rotation));
    }
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-background overflow-hidden select-none ${
        fill ? "min-h-[100svh]" : "min-h-[600px]"
      } ${isFullscreen ? "bg-black" : ""}`}
    >
      {/* Área interactiva de la imagen */}
      <div 
        className="w-full h-full flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain transition-transform duration-75 ease-out shadow-2xl pointer-events-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`,
            transformOrigin: "center center",
          }}
          draggable={false}
        />
      </div>

      {/* Flecha Anterior */}
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          title="Imagen anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 rounded-full bg-background/60 p-2 text-foreground/80 backdrop-blur hover:bg-background/90 hover:text-foreground transition-all shadow-md"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Flecha Siguiente */}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          title="Siguiente imagen"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 rounded-full bg-background/60 p-2 text-foreground/80 backdrop-blur hover:bg-background/90 hover:text-foreground transition-all shadow-md"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Barra de herramientas (Desplazada hacia la izquierda para despejar botones) */}
      {showControls && (
        <div className="absolute right-24 bottom-6 z-50 flex flex-col items-center gap-2 rounded-full border border-border/70 bg-background/80 p-2 backdrop-blur shadow-2xl">
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

          <button
            type="button"
            onClick={() => setScale((s) => Math.min(s + 0.3, 4))}
            title="Acercar (Zoom +)"
            className="rounded-full p-2 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              setScale((s) => {
                const nextScale = Math.max(s - 0.3, 1);
                if (nextScale === 1) setPosition({ x: 0, y: 0 });
                return nextScale;
              })
            }
            title="Alejar (Zoom -)"
            className="rounded-full p-2 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleReset}
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
