import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { artworksQueryOptions } from "@/lib/artworks";
import { AmbientAudio } from "@/components/AmbientAudio";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(artworksQueryOptions),
  head: () => ({
    meta: [
      { title: "Trazos Automáticos de la Pareidolia Sin Norte — Archivo de obras" },
      {
        name: "description",
        content:
          "Dibujos sin arriba ni abajo: giralos 360° y detenelos donde tu mirada los complete. Archivo de trazos automáticos, originales e impresiones.",
      },
      {
        property: "og:title",
        content: "Trazos Automáticos de la Pareidolia Sin Norte — Archivo de obras",
      },
      {
        property: "og:description",
        content:
          "Dibujos sin arriba ni abajo: giralos 360° y detenelos donde tu mirada los complete.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <p className="font-display text-2xl font-light">
        El archivo no respondió. Recargá la página.
      </p>
    </div>
  ),
  notFoundComponent: () => null,
});

function Index() {
  const { data: artworks } = useSuspenseQuery(artworksQueryOptions);

  return (
    <div className="grain-overlay min-h-screen bg-background text-foreground">
      {/* Barra superior */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <span className="neon-flicker text-glow-primary font-mono text-[11px] tracking-[0.35em] text-primary uppercase">
            T·A·P·S·N
          </span>
          <nav className="flex items-center gap-6 font-mono text-[11px] tracking-[0.2em] uppercase">
            <a href="#muro" className="text-muted-foreground transition-colors hover:text-neon">
              Muro
            </a>
            <a href="#cuerpo" className="text-muted-foreground transition-colors hover:text-neon">
              Mente
            </a>
            <a href="#nota" className="text-muted-foreground transition-colors hover:text-neon">
              Nota
            </a>
            <AmbientAudio />
          </nav>
        </div>
      </header>

      {/* Portada */}
      <section className="nebula-bg relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <p className="rise-in font-mono text-[11px] tracking-[0.3em] text-neon uppercase">
            Archivo · {artworks.length} obras
          </p>
          <h1 className="rise-in font-display mt-8 text-[13vw] leading-[0.95] font-light tracking-tight text-balance sm:text-6xl md:text-8xl">
            Trazos automáticos
            <br />
            de la{" "}
            <em className="text-glow-primary font-normal text-primary italic">pareidolia</em>
            <br />
            sin norte
          </h1>
          <p className="rise-in mt-10 max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty">
            Movimientos espontáneos del trazo que despiertan figuras en el
            observador. La ilusión de encontrar sentido en lo impredecible.
          </p>
          <div className="hairline-glow mt-12 h-px w-full" />
        </div>
      </section>

      {/* Manifiesto: Pareidolia y el Trazo Vivo */}
      <section id="pareidolia" className="border-b border-border/60">
        <div className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16">
          <p className="font-mono text-[11px] tracking-[0.3em] text-neon uppercase">
            Pareidolia y el trazo vivo
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <p className="font-display text-2xl leading-snug font-light text-pretty md:text-3xl">
              Estas obras nacen sin orientación fija. No tienen arriba ni abajo,
              ni derecha ni revés: el norte fue la primera cosa que las abandonó.
            </p>
            <div className="space-y-5 text-[15px] leading-relaxed text-muted-foreground">
              <p>
                La pareidolia es esa insistencia del ojo en encontrar formas
                donde solo hay mancha: un rostro, un paisaje, un animal, unos
                ojos, un objeto que no estaba. Acá el trazo llega primero,
                automático, sin intención de decir nada; la figura aparece
                después, y aparece en vos.
              </p>
              <p>
                Por eso cada obra se puede girar 360° y detener en cualquier
                ángulo. La pieza no está terminada hasta que alguien elige la
                posición en que quiere verla. El dibujo lo hice yo; la imagen la
                hacés vos, y podés cambiarla cuando quieras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* La pareidolia en el cuerpo y la mente */}
      <section id="cuerpo" className="border-b border-border/60">
        <div className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16">
          <p className="font-mono text-[11px] tracking-[0.3em] text-neon uppercase">
            La pareidolia en el cuerpo y la mente
          </p>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
            La pareidolia es un fenómeno neurobiológico fascinante: el cerebro
            proc
