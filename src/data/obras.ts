export interface Obra {
  id: string;
  slug?: string;
  catalogo?: string;
  titulo: string;
  anio?: number;
  tecnica?: string;
  soporte?: string;
  formato?: string;
  descripcion?: string;
  precio?: number;
  imagenUrl: string;
  estado?: 'disponible' | 'vendida' | 'regalada';
}

export const OBRAS_DATA: Obra[] = [
  {
    id: "obra-a",
    slug: "obra-a",
    catalogo: "OBRA-A",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/A0001.jpg",
    estado: "vendida"
  },
  {
    id: "obra-b",
    slug: "obra-b",
    catalogo: "OBRA-B",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/B0001.jpg",
    estado: "disponible"
  },
  {
    id: "obra-c",
    slug: "obra-c",
    catalogo: "OBRA-C",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/C0001.jpg",
    estado: "disponible"
  },
  {
    id: "obra-d",
    slug: "obra-d",
    catalogo: "OBRA-D",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/D0001.jpg",
    estado: "regalada"
  },
  {
    id: "obra-e",
    slug: "obra-e",
    catalogo: "OBRA-E",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/E0001.jpg",
    estado: "disponible"
  },
  {
    id: "obra-f",
    slug: "obra-f",
    catalogo: "OBRA-F",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/F0001.jpg",
    estado: "disponible"
  },
  {
    id: "obra-g",
    slug: "obra-g",
    catalogo: "OBRA-G",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/G0001.jpg",
    estado: "disponible"
  },
  {
    id: "obra-h",
    slug: "obra-h",
    catalogo: "OBRA-H",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/H0001.jpg",
    estado: "disponible"
  },
  {
    id: "obra-i",
    slug: "obra-i",
    catalogo: "OBRA-I",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/I0001.jpg",
    estado: "disponible"
  },
  {
    id: "obra-j",
    slug: "obra-j",
    catalogo: "OBRA-J",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/J0001.jpg",
    estado: "disponible"
  },
  {
    id: "obra-k",
    slug: "obra-k",
    catalogo: "OBRA-K",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/K0001.jpg",
    estado: "disponible"
  },
  {
    id: "obra-l",
    slug: "obra-l",
    catalogo: "OBRA-L",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/L0001.jpg",
    estado: "disponible"
  },
  {
    id: "obra-m",
    slug: "obra-m",
    catalogo: "OBRA-M",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/M0001.jpg",
    estado: "disponible"
  },
  {
    id: "obra-n",
    slug: "obra-n",
    catalogo: "OBRA-N",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/N0001.jpg",
    estado: "disponible"
  },
  {
    id: "obra-o",
    slug: "obra-o",
    catalogo: "OBRA-O",
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones",
    precio: 30,
    imagenUrl: "/O0001.jpg",
    estado: "disponible"
  }
];

export const OBRAS = OBRAS_DATA;
export default OBRAS_DATA;
