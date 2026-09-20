import { ModalPago } from './ModalPago';
import { useMemo, useState } from "react";
import { Magnet, Frame, FileImage, Lock } from "lucide-react";
import { formatPrecio, type Artwork } from "@/lib/artworks";

type Pieza = "original" | "impresion";
type Montaje = "lamina" | "marco" | "magnetico";

/**
 * Tienda de la obra: original y/o impresiones, con selector de escala y montaje.
 * Regla de exclusividad: si el original está vendido u obsequiado, la edición
 * se cierra para siempre y las impresiones quedan bloqueadas.
 */
export function ObraTienda({ obra }: { obra: Artwork }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const cerrada = obra.estado !== "disponible";
  const obsequiada = obra.estado === "obsequiada";
  const hayImpresiones = obra.impresiones && obra.impresiones.length > 0;

  const [pieza, setPieza] = useState<Pieza>(
    obra.precioOriginal !== null ? "original" : "impresion",
  );
  const [escala, setEscala] = useState(0);
  const [montaje, setMontaje] = useState<Montaje>("lamina");

  const base = useMemo(() => {
    if (pieza === "original") return obra.precioOriginal ?? 0;
    return obra.impresiones[escala]?.precio ?? 0;
  }, [pieza, escala, obra]);

  const extra =
    montaje === "marco"
      ? obra.precioMarco
      : montaje === "magnetico"
        ? obra.precioMarcoMagnetico
        : 0;

  const total = base + extra;

  const montajes: { id: Montaje; titulo: string; nota: string; icon: typeof Frame; precio: number }[] = [
    {
      id: "lamina",
      titulo: "Lámina / sin enmarcar",
      nota: "Solo el papel: obra original o impresión, lista para enmarcar donde quieras.",
      icon: FileImage,
      precio: 0,
    },
    {
      id: "marco",
      titulo: "Enmarcado tradicional",
      nota: "Marco fijo, con una única orientación elegida por vos al encargarla.",
      icon: Frame,
      precio: obra.precioMarco,
    },
    {
      id: "magnetico",
      titulo: "Enmarcado con dispositivo magnético rotativo",
      nota: "Soporte magnético de pared: gira la obra 360° o la fija en 4 posiciones. Cuatro obras en una.",
      icon: Magnet,
      precio: obra.precioMarcoMagnetico,
    },
  ];

  if (cerrada) {
    return (
      <section className="mt-10 rounded-2xl border border-border/70 bg-card/50 p-6">
        <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-neon uppercase">
          <Lock className="h-3.5 w-3.5" /> {obsequiada ? "Obra obsequiada" : "Edición cerrada"}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {obsequiada
            ? "El original de esta obra fue obsequiado y no está a la venta. Por la regla de exclusividad del archivo, su edición se cierra para siempre: no se imprimen ni se venden reproducciones de esta pieza. Existe una sola, y ya tiene pared."
            : "El original de esta obra fue vendido. Por la regla de exclusividad del archivo, su edición se cierra para siempre: no se imprimen ni se venden reproducciones de esta pieza. Existe una sola, y ya tiene pared."}
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10 rounded-2xl border border-border/70 bg-card/50 p-6">
      <p className="font-mono text-[11px] tracking-[0.3em] text-neon uppercase">Adquirir</p>

      {/* Pieza */}
      <div className="mt-5 flex flex-wrap gap-2">
        {obra.precioOriginal !== null && (
          <button
            type="button"
            onClick={() => setPieza("original")}
            className={`rounded-full border px-4 py-2 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors ${
              pieza === "original"
                ? "border-primary text-primary font-bold"
                : "border-border/70 text-muted-foreground hover:text-foreground"
            }`}
          >
            Original · {formatPrecio(obra.precioOriginal, obra.moneda)}
          </button>
        )}
        {hayImpresiones && (
          <button
            type="button"
            onClick={() => setPieza("impresion")}
            className={`rounded-full border px-4 py-2 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors ${
              pieza === "impresion"
                ? "border-primary text-primary font-bold"
                : "border-border/70 text-muted-foreground hover:text-foreground"
            }`}
          >
            Impresiones de arte
          </button>
        )}
      </div>

      {obra.precioOriginal === null && !hayImpresiones && (
        <p className="mt-4 text-sm text-muted-foreground">
          Precios aún no publicados para esta obra. Consultá por disponibilidad.
        </p>
      )}

      {/* Escalas */}
      {pieza === "impresion" && hayImpresiones && (
        <div className="mt-5">
          <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
            Escala
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {obra.impresiones.map((imp, i) => (
              <button
                key={`${imp.escala}-${i}`}
                type="button"
                onClick={() => setEscala(i)}
                className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                  escala === i
                    ? "border-primary text-primary font-bold"
                    : "border-border/70 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="block">{imp.escala}</span>
                <span className="mt-1 block font-mono text-[10px] tracking-[0.15em]">
                  {formatPrecio(imp.precio, obra.moneda)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Montaje */}
      <div className="mt-7">
        <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
          Montaje
        </p>
        <div className="mt-3 space-y-2">
          {montajes.map((m) => {
            const Icon = m.icon;
            const activo = montaje === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMontaje(m.id)}
                className={`flex w-full gap-3 rounded-xl border p-4 text-left transition-colors ${
                  activo
                    ? "border-primary/70 bg-primary/5"
                    : "border-border/70 hover:border-primary/40"
                }`}
              >
                <Icon
                  className={`mt-0.5 h-4 w-4 shrink-0 ${activo ? "text-primary" : "text-muted-foreground"}`}
                />
                <span className="flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-sm">{m.titulo}</span>
                    <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
                      {m.precio > 0 ? `+ ${formatPrecio(m.precio, obra.moneda)}` : "incluido"}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {m.nota}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explicación del dispositivo magnético */}
      <div className="mt-6 rounded-xl border border-neon/25 bg-neon/[0.04] p-4">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-neon uppercase">
          <Magnet className="h-3.5 w-3.5" /> El dispositivo magnético
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Lo que hacés acá con el dedo o el cursor —girar la obra hasta que
          aparezca lo que solo vos ves— también sucede en tu pared. El soporte
          magnético sostiene la pieza sin tornillos ni presión sobre el papel y
          la deja girar 360°: la soltás y queda donde la dejaste, o la encajás
          en cualquiera de las 4 posiciones principales. Cada giro cambia la
          figura que la mirada completa. Cuatro obras en una, y las de la mitad
          del camino.
        </p>
      </div>

      {/* Total y botón de consulta violeta */}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-5">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
            Total estimado
          </p>
          <p className="font-display mt-1 text-2xl font-light">
            {formatPrecio(total, obra.moneda)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalAbierto(true)}
          style={{
            backgroundColor: '#8b5cf6',
            color: '#fff',
            fontWeight: 'bold',
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
          }}
        >
          Comprar / Consultar
        </button>
      </div>

      {/* Modal interactivo con los medios de pago */}
      <ModalPago
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        tituloObra={`${obra.titulo} (${pieza === "original" ? "Original" : "Impresión"})`}
        catalogoObra={obra.catalogo}
      />
    </section>
  );
}
