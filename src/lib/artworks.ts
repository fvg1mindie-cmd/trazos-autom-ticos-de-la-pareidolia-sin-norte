import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
}

const SIGNED_URL_TTL = 60 * 60 * 24 * 365; // 1 año

export const STORAGE_PREFIX = "storage:";

async function fetchArtworks(): Promise<Artwork[]> {
  const { data, error } = await supabase
    .from("artworks")
    .select(
      "slug, catalogo, titulo, anio, tecnica, soporte, formato, descripcion, imagen_url",
    )
    .order("orden", { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as ArtworkRow[];

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
      if (s?.signedUrl) signedByIndex.set(stored[idx].i, s.signedUrl);
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
  }));
}

export const artworksQueryOptions = queryOptions({
  queryKey: ["artworks"],
  queryFn: fetchArtworks,
  staleTime: 60_000,
});

export function findArtwork(
  list: Artwork[],
  slug: string,
): Artwork | undefined {
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
