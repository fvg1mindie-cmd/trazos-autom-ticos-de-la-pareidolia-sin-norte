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
    imagen: "/A0001.jpg",
    imagenes: ["/A0001.jpg", "/A0002.jpg", "/A0003.jpg", "/A0004.jpg"],
    precioOriginal: 30,
    originalVendido: true,
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
    imagen: "/B0001.jpg",
    imagenes: ["/B0001.jpg", "/B0002.jpg", "/B0003.jpg", "/B0004.jpg"],
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
    imagen: "/C0001.jpg",
    imagenes: ["/C0001.jpg", "/C0002.jpg", "/C0003.jpg", "/C0004.jpg"],
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
    imagen: "/D0001.jpg",
    imagenes: ["/D0001.jpg", "/D0002.jpg", "/D0003.jpg", "/D0004.jpg"],
    precioOriginal: 30,
    originalVendido: true,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  },
  {
    slug: "obra-e",
    catalogo: "OBRA-E",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/E0001.jpg",
    imagenes: ["/E0001.jpg", "/E0002.jpg", "/E0003.jpg", "/E0004.jpg"],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  },
  {
    slug: "obra-f",
    catalogo: "OBRA-F",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/F0001.jpg",
    imagenes: ["/F0001.jpg", "/F0002.jpg", "/F0003.jpg", "/F0004.jpg"],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  },
  {
    slug: "obra-g",
    catalogo: "OBRA-G",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/G0001.jpg",
    imagenes: ["/G0001.jpg", "/G0002.jpg", "/G0003.jpg", "/G0004.jpg"],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  },
  {
    slug: "obra-h",
    catalogo: "OBRA-H",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/H0001.jpg",
    imagenes: ["/H0001.jpg", "/H0002.jpg", "/H0003.jpg", "/H0004.jpg"],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  },
  {
    slug: "obra-i",
    catalogo: "OBRA-I",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/I0001.jpg",
    imagenes: ["/I0001.jpg", "/I0002.jpg", "/I0003.jpg", "/I0004.jpg"],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  },
  {
    slug: "obra-j",
    catalogo: "OBRA-J",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/J0001.jpg",
    imagenes: ["/J0001.jpg", "/J0002.jpg", "/J0003.jpg", "/J0004.jpg"],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  },
  {
    slug: "obra-k",
    catalogo: "OBRA-K",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/K0001.jpg",
    imagenes: ["/K0001.jpg", "/K0002.jpg", "/K0003.jpg", "/K0004.jpg"],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  },
  {
    slug: "obra-l",
    catalogo: "OBRA-L",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/L0001.jpg",
    imagenes: ["/L0001.jpg", "/L0002.jpg", "/L0003.jpg", "/L0004.jpg"],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  },
  {
    slug: "obra-m",
    catalogo: "OBRA-M",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/M0001.jpg",
    imagenes: ["/M0001.jpg", "/M0002.jpg", "/M0003.jpg", "/M0004.jpg"],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  },
  {
    slug: "obra-n",
    catalogo: "OBRA-N",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/N0001.jpg",
    imagenes: ["/N0001.jpg", "/N0002.jpg", "/N0003.jpg", "/N0004.jpg"],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  },
  {
    slug: "obra-o",
    catalogo: "OBRA-O",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    imagen: "/O0001.jpg",
    imagenes: ["/O0001.jpg", "/O0002.jpg", "/O0003.jpg", "/O0004.jpg"],
    precioOriginal: 30,
    originalVendido: false,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD"
  }
];

export const OBRAS = OBRAS_DATA;
export default OBRAS_DATA;
