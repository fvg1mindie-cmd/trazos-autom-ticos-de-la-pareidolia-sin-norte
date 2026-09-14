export interface Impresion {
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
  imagen: string;
  imagenes: string[];
  precioOriginal: number | null;
  originalVendido: boolean;
  impresiones: Impresion[];
  precioMarco: number;
  precioMarcoMagnetico: number;
  moneda: string;
}

export const OBRAS_DATA: Artwork[] = [
  {
    slug: "obra-a",
    catalogo: "OBRA-A",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/src/assets/obra-01.jpg",
    imagenes: [
      "/src/assets/obra-01.jpg",
      "/src/assets/obra-02.jpg",
      "/src/assets/obra-03.jpg",
      "/src/assets/obra-04.jpg"
    ],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  },
  {
    slug: "obra-b",
    catalogo: "OBRA-B",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/src/assets/obra-02.jpg",
    imagenes: [
      "/src/assets/obra-02.jpg",
      "/src/assets/obra-03.jpg",
      "/src/assets/obra-04.jpg",
      "/src/assets/obra-05.jpg"
    ],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  },
  {
    slug: "obra-c",
    catalogo: "OBRA-C",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/src/assets/obra-03.jpg",
    imagenes: [
      "/src/assets/obra-03.jpg",
      "/src/assets/obra-04.jpg",
      "/src/assets/obra-05.jpg",
      "/src/assets/obra-06.jpg"
    ],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  },
  {
    slug: "obra-d",
    catalogo: "OBRA-D",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/src/assets/obra-04.jpg",
    imagenes: [
      "/src/assets/obra-04.jpg",
      "/src/assets/obra-05.jpg",
      "/src/assets/obra-06.jpg",
      "/src/assets/obra-07.jpg"
    ],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  }
];
