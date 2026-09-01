import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Impresion {
  /** Escala / tamaño, ej. "A3 · 30 × 42 cm" */
  escala: string;
  precio: number;
}

export interface Artwork {
  slug: string;
  catalogo: string;
  titulo: string;
  anio: number;
  tecnica: string;
  soporte: string;
  formato: string;
  descripcion: string;
  /** URL lista para <img>: CDN de assets o URL firmada del storage. */
  imagen: string;
  /** Tienda */
  precioOriginal: number | null;
  originalVendido: boolean;
  impresiones: Impresion[];
  precioMarco: number;
  precioMarcoMagnetico: number;
  moneda: string;
}

interface ArtworkRow {
  slug: string;
  catalogo: string;
  titulo: string;
  anio: number | null;
  tecnica: string | null;
  soporte: string | null;
  formato: string | null;
  descripcion: string | null;
  imagen_url: string;
  precio_original: number | null;
  original_vendido: boolean | null;
  impresiones: unknown;
  precio_marco: number | null;
  precio_marco_magnetico: number | null;
  moneda: string | null;
}

const SIGNED_URL_TTL = 60 * 60 * 24 * 365; // 1 año

export const STORAGE_PREFIX = "storage:";

const SELECT_COLS =
  "slug, catalogo, titulo, anio, tecnica, soporte, formato, descripcion, imagen_url, precio_original, original_vendido, impresiones, precio_marco, precio_marco_magnetico, moneda";

function parseImpresiones(value: unknown): Impresion[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => {
      const o = v as { escala?: unknown; precio?: unknown };
      return {
        escala: typeof o?.escala === "string" ? o.escala : "",
        precio: Number(o?.precio ?? 0),
      };
    })
    .filter((i) => i.escala !== "" && Number.isFinite(i.precio));
}

async function fetchArtworks(): Promise<Artwork[]> {
  const { data, error } = await supabase
    .from("artworks")
    .select(SELECT_COLS)
    .order("orden", { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as unknown as ArtworkRow[];

  // Resolver URLs firmadas para imágenes guardadas en el bucket privado.
  const stored = rows
    .map((r, i) =>
      r.imagen_url.startsWith(STORAGE_PREFIX)
        ? { i, path: r.imagen_url.slice(STORAGE_PREFIX.length) }
        : null,
    )
    .filter((s): s is { i: number; path: string } => s !== null);

  const signedByIndex = new Map<number, string>();
  if (stored.length > 0) {
    const { data: signed } = await supabase.storage
      .from("obras")
      .createSignedUrls(
        stored.map((s) => s.path),
        SIGNED_URL_TTL,
      );
    signed?.forEach((s, idx) => {
      const target = stored[idx];
      if (s?.signedUrl && target) signedByIndex.set(target.i, s.signedUrl);
    });
  }

  return rows.map((r, i) => ({
    slug: r.slug,
    catalogo: r.catalogo,
    titulo: r.titulo,
    anio: r.anio ?? 0,
    tecnica: r.tecnica?.trim() || "—",
    soporte: r.soporte?.trim() || "—",
    formato: r.formato?.trim() || "—",
    descripcion: r.descripcion ?? "",
    imagen: r.imagen_url.startsWith(STORAGE_PREFIX)
      ? (signedByIndex.get(i) ?? "")
      : r.imagen_url,
    precioOriginal: r.precio_original === null ? null : Number(r.precio_original),
    originalVendido: Boolean(r.original_vendido),
    impresiones: parseImpresiones(r.impresiones),
    precioMarco: Number(r.precio_marco ?? 0),
    precioMarcoMagnetico: Number(r.precio_marco_magnetico ?? 0),
    moneda: r.moneda?.trim() || "USD",
  }));
}

export const artworksQueryOptions = queryOptions({
  queryKey: ["artworks"],
  queryFn: fetchArtworks,
  staleTime: 60_000,
});

export function findArtwork(list: Artwork[], slug: string): Artwork | undefined {
  return list.find((a) => a.slug === slug);
}

export function findNeighbors(
  list: Artwork[],
  slug: string,
): { prev: Artwork | undefined; next: Artwork | undefined } {
  const i = list.findIndex((a) => a.slug === slug);
  return {
    prev: i > 0 ? list[i - 1] : undefined,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined,
  };
}

export function formatPrecio(valor: number, moneda: string): string {
  return `${moneda} ${valor.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
}
