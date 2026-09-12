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
  /** Todas las tomas disponibles; la primera funciona como portada. */
  imagenes: string[];
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
  imagenes: unknown;
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
  "slug, catalogo, titulo, anio, tecnica, soporte, formato, descripcion, imagen_url, imagenes, precio_original, original_vendido, impresiones, precio_marco, precio_marco_magnetico, moneda";

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
  const imageRefs = rows.map((row) => {
    const additional = Array.isArray(row.imagenes)
      ? row.imagenes.filter((value): value is string => typeof value === "string" && value.length > 0)
      : [];
    return additional.length > 0 ? additional : [row.imagen_url];
  });
  const stored = imageRefs.flatMap((refs, rowIndex) =>
    refs.flatMap((ref, imageIndex) =>
      ref.startsWith(STORAGE_PREFIX)
        ? [{ rowIndex, imageIndex, path: ref.slice(STORAGE_PREFIX.length) }]
        : [],
    ),
  );

  const signedByKey = new Map<string, string>();
  if (stored.length > 0) {
    const { data: signed } = await supabase.storage
      .from("obras")
      .createSignedUrls(
        stored.map((s) => s.path),
        SIGNED_URL_TTL,
      );
    signed?.forEach((s, idx) => {
      const target = stored[idx];
      if (s?.signedUrl && target) {
        signedByKey.set(`${target.rowIndex}:${target.imageIndex}`, s.signedUrl);
      }
    });
  }

  return rows.map((r, rowIndex) => {
    const resolvedImages = imageRefs[rowIndex]?.map((ref, imageIndex) =>
      ref.startsWith(STORAGE_PREFIX)
        ? (signedByKey.get(`${rowIndex}:${imageIndex}`) ?? "")
        : ref,
    ).filter(Boolean) ?? [];
    return {
    slug: r.slug,
    catalogo: r.catalogo,
    titulo: r.titulo,
    anio: r.anio ?? 0,
    tecnica: r.tecnica?.trim() || "—",
    soporte: r.soporte?.trim() || "—",
    formato: r.formato?.trim() || "—",
    descripcion: r.descripcion ?? "",
    imagen: resolvedImages[0] ?? "",
    imagenes: resolvedImages,
    precioOriginal: r.precio_original === null ? null : Number(r.precio_original),
    originalVendido: Boolean(r.original_vendido),
    impresiones: parseImpresiones(r.impresiones),
    precioMarco: Number(r.precio_marco ?? 0),
    precioMarcoMagnetico: Number(r.precio_marco_magnetico ?? 0),
    moneda: r.moneda?.trim() || "USD",
    };
  });
}

export const artworksQueryOptions = queryOptions({
  queryKey: ["artworks"],
  queryFn: fetchArtworks,
  staleTime: 60_000,
});

export interface AdminArtwork {
  id: string;
  slug: string;
  catalogo: string;
  titulo: string;
  imagen_url: string;
  imagenes: string[];
  orden: number;
  original_vendido: boolean;
}

async function fetchAdminArtworks(): Promise<AdminArtwork[]> {
  const { data, error } = await supabase
    .from("artworks")
    .select(
      "id, slug, catalogo, titulo, imagen_url, imagenes, orden, original_vendido",
    )
    .order("orden", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as AdminArtwork[];
}

export const adminArtworksQueryOptions = queryOptions({
  queryKey: ["artworks", "admin"],
  queryFn: fetchAdminArtworks,
  staleTime: 30_000,
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
