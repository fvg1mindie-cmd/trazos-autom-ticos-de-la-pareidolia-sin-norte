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
            Dibujos que se hacen solos. Lo que la mano no buscó y que la mirada,
            a pesar de todo, vuelve a encontrar: un rostro, una nube, una boca
            que no estaba.
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
                La pareidolia es esa insistencia del ojo en encontrar rostros
                donde solo hay mancha. Acá el trazo llega primero, automático,
                sin intención de decir nada; la figura aparece después, y
                aparece en vos.
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

      {/* Muro de galería */}
      <section id="muro" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16">
        <div className="mb-10 flex items-baseline justify-between">
          <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl">
            El muro
          </h2>
          <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
            01 — {String(artworks.length).padStart(2, "0")}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 md:grid-cols-3">
          {artworks.map((obra, i) => (
            <Link
              key={obra.slug}
              to="/obras/$slug"
              params={{ slug: obra.slug }}
              className={`group block ${i % 3 === 1 ? "sm:mt-10" : ""}`}
            >
              <figure>
                <div className="group-hover:ring-glow overflow-hidden rounded-2xl border border-border/70 bg-card transition-shadow duration-500">
                  {obra.imagen ? (
                    <img
                      src={obra.imagen}
                      alt={`${obra.titulo} — ${obra.tecnica}, ${obra.anio}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex aspect-[4/5] w-full items-center justify-center p-6">
                      <span className="text-center font-mono text-[11px] tracking-[0.3em] text-muted-foreground/60 uppercase">
                        {obra.catalogo}
                        <br />
                        <span className="tracking-normal normal-case">obra pendiente</span>
                      </span>
                    </div>
                  )}
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-normal tracking-tight transition-colors group-hover:text-primary">
                      {obra.titulo}
                    </h3>
                    <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                      {obra.tecnica} · {obra.anio || "—"}
                      {obra.originalVendido && (
                        <span className="ml-2 text-neon">· vendida</span>
                      )}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] tracking-[0.18em] text-neon/80">
                    {obra.catalogo}
                  </span>
                </figcaption>
              </figure>
            </Link>
          ))}
        </div>
      </section>

      {/* Nota */}
      <section id="nota" className="border-t border-border/60">
        <div className="mx-auto max-w-5xl scroll-mt-20 px-6 py-20">
          <p className="font-mono text-[11px] tracking-[0.3em] text-neon uppercase">
            Nota del proceso
          </p>
          <p className="font-display mt-8 max-w-2xl text-2xl leading-snug font-light text-pretty md:text-3xl">
            «La pareidolia sin norte no busca sentido. Dibuja con la mano
            abierta y deja que el trazo, sin mapa, se encuentre solo.»
          </p>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            Archivo abierto, sin edición posterior: las fotos conservan el color
            y el contraste originales del papel. Cada obra se numeró en el orden
            en que apareció. Cuando el original se vende, su edición se cierra
            para siempre.
          </p>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
            Trazos Automáticos · Pareidolia Sin Norte
          </p>
          <Link
            to="/admin"
            className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase transition-colors hover:text-neon"
          >
            Panel del artista
          </Link>
        </div>
      </footer>
    </div>
  );
}
