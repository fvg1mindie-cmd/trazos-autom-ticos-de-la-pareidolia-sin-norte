import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Eye, EyeOff, RotateCw } from "lucide-react";
import { artworksQueryOptions, findArtwork, findNeighbors } from "@/lib/artworks";
import { RotateViewer } from "@/components/RotateViewer";
import { AmbientAudio } from "@/components/AmbientAudio";
import { ObraTienda } from "@/components/ObraTienda";

export const Route = createFileRoute("/obras/$slug")({
  loader: ({ context }) => context.queryClient.ensureQueryData(artworksQueryOptions),
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Trazos Automáticos de la Pareidolia Sin Norte` },
      {
        name: "description",
        content:
          "Obra sin arriba ni abajo: giranla 360° y detenela donde tu mirada la complete.",
      },
      { property: "og:title", content: "Obra — T·A·P·S·N" },
      {
        property: "og:description",
        content:
          "Obra sin arriba ni abajo: giranla 360° y detenela donde tu mirada la complete.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ObraPage,
  errorComponent: () => <Aviso texto="No pudimos abrir esta obra" />,
  notFoundComponent: () => <Aviso texto="Esta obra no está en el archivo" />,
});

function Aviso({ texto }: { texto: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <p className="font-display text-3xl font-light">{texto}</p>
        <Link
          to="/"
          className="text-glow-primary mt-6 inline-block font-mono text-[11px] tracking-[0.25em] text-primary uppercase"
        >
          ← Volver al muro
        </Link>
      </div>
    </div>
  );
}

function ObraPage() {
  const { slug } = Route.useParams();
  const { data: lista } = useSuspenseQuery(artworksQueryOptions);
  const obra = findArtwork(lista, slug);
  const { prev, next } = findNeighbors(lista, slug);
  const [uiVisible, setUiVisible] = useState(false);
  // Aviso sutil de que la obra se puede girar; se oculta solo o al primer gesto.
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setHint(false), 6000);
    return () => window.clearTimeout(t);
  }, [slug]);

  if (!obra) return <Aviso texto="Esta obra no está en el archivo" />;

  const fade = (visible: boolean) =>
    `transition-opacity duration-500 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`;
  // La ficha/tienda solo ocupa espacio cuando está visible; oculta no genera scroll en blanco.
  const fichaShell = (visible: boolean) =>
    visible ? "" : "hidden";

  return (
    <div className="grain-overlay min-h-screen bg-background text-foreground">
      {/* Lienzo inmersivo */}
      <section
        className="relative h-[100svh] w-full"
        onPointerDown={() => setHint(false)}
      >
        <RotateViewer
          src={obra.imagen}
          alt={`${obra.titulo} — ${obra.tecnica}, ${obra.anio}`}
          storageKey={`orientacion-${obra.slug}`}
          showControls={uiVisible}
          fill
        />

        {/* Encabezado flotante */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex h-14 items-center justify-between px-5 ${fade(uiVisible)}`}
        >
          <Link
            to="/"
            className="pointer-events-auto rounded-full border border-border/60 bg-background/60 px-4 py-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase backdrop-blur transition-colors hover:text-neon"
          >
            ← Muro
          </Link>
          <span className="rounded-full border border-border/60 bg-background/60 px-4 py-2 font-mono text-[10px] tracking-[0.3em] text-neon uppercase backdrop-blur">
            {obra.catalogo}
          </span>
        </div>

        {/* Indicador sutil de giro */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-24 z-20 flex justify-center transition-opacity duration-700 ${
            hint && !uiVisible ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!hint}
        >
          <span className="flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase backdrop-blur">
            <RotateCw className="h-3.5 w-3.5 animate-[spin_3s_linear_infinite] text-neon" />
            Arrastrá para girar la obra
          </span>
        </div>

        {/* Toggles siempre disponibles */}
        <div className="absolute right-5 bottom-6 z-30 flex flex-col gap-2">
          <AmbientAudio />
          <button
            type="button"
            onClick={() => setUiVisible((v) => !v)}
            aria-pressed={uiVisible}
            aria-label={uiVisible ? "Ocultar la interfaz" : "Mostrar la interfaz"}
            className="rounded-full border border-border/70 bg-card/70 p-2.5 text-muted-foreground backdrop-blur transition-colors hover:text-primary"
          >
            {uiVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </section>

      {/* Ficha + tienda */}
      <section
        id="ficha"
        className={`nebula-bg border-t border-border/60 ${fade(uiVisible)} ${fichaShell(uiVisible)}`}
        aria-hidden={!uiVisible}
      >
        <div className="mx-auto max-w-2xl px-6 py-16">
          <p className="font-mono text-[11px] tracking-[0.3em] text-neon uppercase">
            Ficha de obra
          </p>
          <h1 className="font-display mt-4 text-4xl leading-tight font-light tracking-tight text-balance md:text-5xl">
            {obra.titulo}
          </h1>
          {obra.descripcion && (
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground text-pretty">
              {obra.descripcion}
            </p>
          )}

          <dl className="mt-10 space-y-3 border-t border-border/70 pt-6 font-mono text-[12px] tracking-[0.15em] uppercase">
            {[
              ["Técnica", obra.tecnica],
              ["Soporte", obra.soporte],
              ["Formato", obra.formato],
              ["Año", String(obra.anio || "—")],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-6">
              <dt className="text-muted-foreground">Catálogo</dt>
              <dd className="text-glow-primary text-right text-primary">{obra.catalogo}</dd>
            </div>
          </dl>

          <ObraTienda obra={obra} />
        </div>

        <nav className="border-t border-border/60">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-8">
            {prev ? (
              <Link
                to="/obras/$slug"
                params={{ slug: prev.slug }}
                className="group flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                {prev.titulo}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to="/obras/$slug"
                params={{ slug: next.slug }}
                className="group flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-primary"
              >
                {next.titulo}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </nav>
      </section>
    </div>
  );
}
