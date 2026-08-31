import rostroEnLaNiebla from "@/assets/obras/rostro-en-la-niebla.jpg";
import nubeConNino from "@/assets/obras/nube-con-nino.jpg";
import ojo009 from "@/assets/obras/ojo-009.jpg";
import aveDeTintaSeca from "@/assets/obras/ave-de-tinta-seca.jpg";
import manoACiegas from "@/assets/obras/mano-a-ciegas.jpg";
import dosQueNoSon from "@/assets/obras/dos-que-no-son.jpg";

export interface Artwork {
  slug: string;
  catalogo: string;
  titulo: string;
  anio: number;
  tecnica: string;
  soporte: string;
  formato: string;
  descripcion: string;
  imagen: string;
}

export const artworks: Artwork[] = [
  {
    slug: "rostro-en-la-niebla",
    catalogo: "TA-01",
    titulo: "Rostro en la niebla",
    anio: 2024,
    tecnica: "Carbón y tinta",
    soporte: "Papel de algodón 300 g",
    formato: "40 × 50 cm",
    descripcion:
      "Una boca se abre donde no había nada. Se dibuja sola, sin dirección, y al secarse ya es casi un retrato.",
    imagen: rostroEnLaNiebla,
  },
  {
    slug: "nube-con-nino",
    catalogo: "TA-02",
    titulo: "Nube con niño",
    anio: 2024,
    tecnica: "Tinta diluida",
    soporte: "Papel de algodón 300 g",
    formato: "38 × 48 cm",
    descripcion:
      "La nube decidió ser habitada. La mano solo siguió el borde de algo que ya estaba mirando hacia afuera.",
    imagen: nubeConNino,
  },
  {
    slug: "ojo-009",
    catalogo: "TA-03",
    titulo: "Ojo 009",
    anio: 2024,
    tecnica: "Óxido y grafito",
    soporte: "Papel negro 250 g",
    formato: "30 × 42 cm",
    descripcion:
      "Del garabato salió un ojo. No se le pidió permiso a la mano ni a la página; simplemente se quedó abierto.",
    imagen: ojo009,
  },
  {
    slug: "ave-de-tinta-seca",
    catalogo: "TA-04",
    titulo: "Ave de tinta seca",
    anio: 2023,
    tecnica: "Tinta china",
    soporte: "Papel verjurado 200 g",
    formato: "35 × 45 cm",
    descripcion:
      "Un ave hecha de lo que quedó en el pincel. Voló antes de existir, que es la manera más honesta de volar.",
    imagen: aveDeTintaSeca,
  },
  {
    slug: "mano-a-ciegas",
    catalogo: "TA-05",
    titulo: "Mano a ciegas",
    anio: 2023,
    tecnica: "Lápiz y albayalde",
    soporte: "Papel de algodón 300 g",
    formato: "30 × 42 cm",
    descripcion:
      "Dibujada sin mirar el papel. La mano dibuja la mano: el trazo se reconoce a sí mismo y se equivoca feliz.",
    imagen: manoACiegas,
  },
  {
    slug: "dos-que-no-son",
    catalogo: "TA-06",
    titulo: "Dos que no son",
    anio: 2024,
    tecnica: "Gouache y carbón",
    soporte: "Papel de algodón 300 g",
    formato: "50 × 40 cm",
    descripcion:
      "Dos figuras se cruzan en la niebla y ninguna confirma a la otra. La pareidolia insiste: son alguien.",
    imagen: dosQueNoSon,
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
