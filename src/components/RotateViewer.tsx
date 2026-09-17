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
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [startAngle, setStartAngle] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) setRotation(Number(saved));
    }
  }, [storageKey]);

  const saveRotation = (newRot: number) => {
    setRotation(newRot);
    if (storageKey) {
      localStorage.setItem(storageKey, String(newRot));
    }
  };

  const handleRotateButton = (degrees: number) => {
    const newRot = (rotation + degrees + 360) % 360;
    saveRotation(newRot);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    saveRotation(0);
  };

  const getAngle = (clientX: number, clientY: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radians = Math.atan2(clientY - centerY, clientX - centerX);
    return radians * (180 / Math.PI);
  };

  const startInteraction = (clientX: number, clientY: number) => {
    setIsInteracting(true);
    if (scale > 1) {
      setDragStart({ x: clientX - position.x, y: clientY - position.y });
    } else {
      const currentAngle = getAngle(clientX, clientY);
      setStartAngle(currentAngle - rotation);
    }
  };

  const moveInteraction = (clientX: number, clientY: number) => {
    if (!isInteracting) return;

    if (scale > 1) {
      setPosition({
        x: clientX - dragStart.x,
        y: clientY - dragStart.y
      });
    } else {
      const currentAngle = getAngle(clientX, clientY);
      const newRotation = (currentAngle - startAngle + 360) % 360;
      setRotation(Math.round(newRotation));
    }
  };

  const endInteraction = () => {
    if (isInteracting) {
      setIsInteracting(false);
      if (scale === 1) {
        saveRotation(rotation);
      }
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
      className={`relative w-full h-full bg-background overflow-hidden select-none touch-none ${
        fill ? "min-h-[100svh]" : "min-h-[500px] md:min-h-[600px]"
      } ${isFullscreen ? "bg-black" : ""}`}
    >
      {/* Área interactiva */}
      <div 
        className={`w-full h-full flex items-center justify-center p-4 md:p-8 ${
          scale > 1 ? "cursor-move" : "cursor-grab active:cursor-grabbing"
        }`}
        onMouseDown={(e) => startInteraction(e.clientX, e.clientY)}
        onMouseMove={(e) => moveInteraction(e.clientX, e.clientY)}
        onMouseUp={endInteraction}
        onMouseLeave={endInteraction}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            startInteraction(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 1) {
            moveInteraction(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchEnd={endInteraction}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-[85vw] md:max-w-[75vw] max-h-[60vh] md:max-h-[70vh] object-contain shadow-2xl pointer-events-none transition-transform duration-75 ease-out"
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
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 rounded-full bg-background/60 p-2 text-foreground/80 backdrop-blur hover:bg-background/90 hover:text-foreground transition-all shadow-md"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      )}

      {/* Flecha Siguiente */}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          title="Siguiente imagen"
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 rounded-full bg-background/60 p-2 text-foreground/80 backdrop-blur hover:bg-background/90 hover:text-foreground transition-all shadow-md"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      )}

      {/* Barra de Herramientas Responsive */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:right-28 md:translate-x-0 md:bottom-6 z-50 flex flex-row md:flex-col items-center gap-1.5 md:gap-2 rounded-full border border-border/70 bg-background/90 p-1.5 md:p-2 backdrop-blur shadow-2xl">
          <button
            type="button"
            onClick={() => handleRotateButton(-90)}
            title="Girar 90° a la izquierda"
            className="rounded-full p-1.5 md:p-2 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => handleRotateButton(90)}
            title="Girar 90° a la derecha"
            className="rounded-full p-1.5 md:p-2 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          <span className="h-4 w-[1px] md:w-4 md:h-[1px] bg-border/60 mx-1 md:my-1" />

          <button
            type="button"
            onClick={() => setScale((s) => Math.min(s + 0.3, 4))}
            title="Acercar (Zoom +)"
            className="rounded-full p-1.5 md:p-2 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setScale((s) => {
              const newScale = Math.max(s - 0.3, 1);
              if (newScale === 1) setPosition({ x: 0, y: 0 });
              return newScale;
            })}
            title="Alejar (Zoom -)"
            className="rounded-full p-1.5 md:p-2 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Restablecer vista"
            className="rounded-full p-1.5 md:p-2 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <span className="h-4 w-[1px] md:w-4 md:h-[1px] bg-border/60 mx-1 md:my-1" />

          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            className="rounded-full p-1.5 md:p-2 text-primary hover:bg-primary/20 transition-colors"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
