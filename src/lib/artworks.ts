export const STORAGE_PREFIX = 'trazos_artworks_';
import { queryOptions } from "@tanstack/react-query";
import { OBRAS_DATA, Artwork, Impresion } from "@/data/obras";

export type { Artwork, Impresion };

async function fetchArtworks(): Promise<Artwork[]> {
  return OBRAS_DATA;
}

export const artworksQueryOptions = queryOptions({
  queryKey: ["artworks"],
  queryFn: fetchArtworks,
  staleTime: Infinity,
});

export interface AdminArtwork extends Artwork {
  id: string;
  orden: number;
  imagen_url: string;
  original_vendido: boolean;
  precio_original: number | null;
  precio_marco: number;
  precio_marco_magnetico: number;
}

async function fetchAdminArtworks(): Promise<AdminArtwork[]> {
  return OBRAS_DATA.map((item, index) => ({
    ...item,
    id: String(index + 1),
    orden: index + 1,
    imagen_url: item.imagen,
    original_vendido: item.originalVendido,
    precio_original: item.precioOriginal,
    precio_marco: item.precioMarco,
    precio_marco_magnetico: item.precioMarcoMagnetico,
  }));
}

export const adminArtworksQueryOptions = queryOptions({
  queryKey: ["artworks", "admin"],
  queryFn: fetchAdminArtworks,
  staleTime: Infinity,
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
