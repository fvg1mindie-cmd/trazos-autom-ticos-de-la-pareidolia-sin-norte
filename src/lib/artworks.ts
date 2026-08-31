import obra01 from "@/assets/obra-01.jpg.asset.json";
import obra02 from "@/assets/obra-02.jpg.asset.json";
import obra03 from "@/assets/obra-03.jpg.asset.json";
import obra04 from "@/assets/obra-04.jpg.asset.json";
import obra05 from "@/assets/obra-05.jpg.asset.json";
import obra06 from "@/assets/obra-06.jpg.asset.json";
import obra07 from "@/assets/obra-07.jpg.asset.json";
import obra08 from "@/assets/obra-08.jpg.asset.json";

export interface Artwork {
  slug: string;
  catalogo: string;
  titulo: string;
  anio: number;
  tecnica: string;
  soporte: string;
  formato: string;
  descripcion: string;
  /** Ruta de la imagen de la obra. */
  imagen: string;
}

export const artworks: Artwork[] = [
  {
    slug: "obra-01",
    catalogo: "TA-01",
    titulo: "Obra 01",
    anio: 2026,
    tecnica: "—",
    soporte: "—",
    formato: "—",
    descripcion: "",
    imagen: obra01.url,
  },
  {
    slug: "obra-02",
    catalogo: "TA-02",
    titulo: "Obra 02",
    anio: 2026,
    tecnica: "—",
    soporte: "—",
    formato: "—",
    descripcion: "",
    imagen: obra02.url,
  },
  {
    slug: "obra-03",
    catalogo: "TA-03",
    titulo: "Obra 03",
    anio: 2026,
    tecnica: "—",
    soporte: "—",
    formato: "—",
    descripcion: "",
    imagen: obra03.url,
  },
  {
    slug: "obra-04",
    catalogo: "TA-04",
    titulo: "Obra 04",
    anio: 2026,
    tecnica: "—",
    soporte: "—",
    formato: "—",
    descripcion: "",
    imagen: obra04.url,
  },
  {
    slug: "obra-05",
    catalogo: "TA-05",
    titulo: "Obra 05",
    anio: 2026,
    tecnica: "—",
    soporte: "—",
    formato: "—",
    descripcion: "",
    imagen: obra05.url,
  },
  {
    slug: "obra-06",
    catalogo: "TA-06",
    titulo: "Obra 06",
    anio: 2026,
    tecnica: "—",
    soporte: "—",
    formato: "—",
    descripcion: "",
    imagen: obra06.url,
  },
  {
    slug: "obra-07",
    catalogo: "TA-07",
    titulo: "Obra 07",
    anio: 2026,
    tecnica: "—",
    soporte: "—",
    formato: "—",
    descripcion: "",
    imagen: obra07.url,
  },
  {
    slug: "obra-08",
    catalogo: "TA-08",
    titulo: "Obra 08",
    anio: 2026,
    tecnica: "—",
    soporte: "—",
    formato: "—",
    descripcion: "",
    imagen: obra08.url,
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
