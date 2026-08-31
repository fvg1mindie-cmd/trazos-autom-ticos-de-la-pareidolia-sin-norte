import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getArtwork, getNeighbors } from "@/lib/artworks";
import { RotateViewer } from "@/components/RotateViewer";

export const Route = createFileRoute("/obras/$slug")({
  beforeLoad: ({ params }) => {
    if (!getArtwork(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const obra = getArtwork(params.slug);
    return {
      meta: [
        { title: `${obra?.titulo ?? "Obra"} — Trazos Automáticos de la Pareidolia Sin Norte` },
        {
          name: "description",
          content: obra?.descripcion ?? "",
        },
        { property: "og:title", content: `${obra?.titulo} — T·A·P·S·N` },
        { property: "og:description", content: obra?.descripcion ?? "" },
      ],
    };
  },
  component: ObraPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <p className="font-display text-3xl font-light">Esta obra no está en el archivo</p>
        <Link
          to="/"
          className="mt-6 inline-block font-mono text-[11px] tracking-[0.25em] text-primary uppercase text-glow-primary"
        >
          ← Volver al muro
        </Link>
      </div>
    </div>
  ),
});

function ObraPage() {
  const { slug } = Route.useParams();
  const obra = getArtwork(slug)!;
  const { prev, next } = getNeighbors(slug);

  return (
    <div className="grain-overlay min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link
            to="/"
            className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase transition-colors hover:text-neon"
          >
            ← Muro
          </Link>
          <span className="font-mono text-[11px] tracking-[0.3em] text-neon uppercase">
            {obra.catalogo}
          </span>
        </div>
      </header>

      <main className="nebula-bg">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr] md:gap-14 md:py-20">
          {/* Imagen */}
          <figure className="rise-in">
            <RotateViewer
              src={obra.imagen}
              alt={`${obra.titulo} — ${obra.tecnica}, ${obra.anio}`}
              storageKey={`orientacion-${obra.slug}`}
            />
          </figure>

          {/* Ficha */}
          <div className="rise-in self-center" style={{ animationDelay: "120ms" }}>
            <p className="font-mono text-[11px] tracking-[0.3em] text-neon uppercase">
              Ficha de obra
            </p>
            <h1 className="font-display mt-4 text-4xl leading-tight font-light tracking-tight text-balance md:text-5xl">
              {obra.titulo}
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty">
              {obra.descripcion}
            </p>

            <dl className="mt-10 space-y-3 border-t border-border/70 pt-6 font-mono text-[12px] tracking-[0.15em] uppercase">
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Técnica</dt>
                <dd className="text-right">{obra.tecnica}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Soporte</dt>
                <dd className="text-right">{obra.soporte}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Formato</dt>
                <dd className="text-right">{obra.formato}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Año</dt>
                <dd className="text-right">{obra.anio}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Catálogo</dt>
                <dd className="text-right text-primary text-glow-primary">{obra.catalogo}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Anterior / siguiente */}
        <nav className="border-t border-border/60">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
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
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto px-6 py-8 max-w-5xl">
          <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
            © 2024 · Trazos Automáticos de la Pareidolia Sin Norte
          </p>
        </div>
      </footer>
    </div>
  );
}
