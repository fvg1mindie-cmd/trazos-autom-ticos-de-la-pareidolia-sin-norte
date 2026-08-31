export interface Artwork {
  slug: string;
  catalogo: string;
  titulo: string;
  anio: number;
  tecnica: string;
  soporte: string;
  formato: string;
  descripcion: string;
  /** Ruta de la imagen de la obra; vacío hasta que el artista suba la suya. */
  imagen: string;
}

export const artworks: Artwork[] = [
  {
    slug: "obra-01",
    catalogo: "TA-01",
    titulo: "Obra 01",
    anio: 2024,
    tecnica: "—",
    soporte: "—",
    formato: "—",
    descripcion: "",
    imagen: "",
  },
  {
    slug: "obra-02",
    catalogo: "TA-02",
    titulo: "Obra 02",
    anio: 2024,
    tecnica: "—",
    soporte: "—",
    formato: "—",
    descripcion: "",
    imagen: "",
  },
  {
    slug: "obra-03",
    catalogo: "TA-03",
    titulo: "Obra 03",
    anio: 2024,
    tecnica: "—",
    soporte: "—",
    formato: "—",
    descripcion: "",
    imagen: "",
  },
  {
    slug: "obra-04",
    catalogo: "TA-04",
    titulo: "Obra 04",
    anio: 2024,
    tecnica: "—",
    soporte: "—",
    formato: "—",
    descripcion: "",
    imagen: "",
  },
  {
    slug: "obra-05",
    catalogo: "TA-05",
    titulo: "Obra 05",
    anio: 2024,
    tecnica: "—",
    soporte: "—",
    formato: "—",
    descripcion: "",
    imagen: "",
  },
  {
    slug: "obra-06",
    catalogo: "TA-06",
    titulo: "Obra 06",
    anio: 2024,
    tecnica: "—",
    soporte: "—",
    formato: "—",
    descripcion: "",
    imagen: "",
  },
];

export function getArtwork(slug: string): Artwork | undefined {
  return artworks.find((a) => a.slug === slug);
}

export function getNeighbors(slug: string): {
  prev: Artwork | undefined;
  next: Artwork | undefined;
} {
  const i = artworks.findIndex((a) => a.slug === slug);
  return {
    prev: i > 0 ? artworks[i - 1] : undefined,
    next: i >= 0 && i < artworks.length - 1 ? artworks[i + 1] : undefined,
  };
}
