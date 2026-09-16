export interface Obra {
  id: string;
  slug: string;
  titulo: string;
  descripcion?: string;
  precio: number;
  imagenUrl?: string;
  estado?: 'disponible' | 'vendida' | 'regalada';
}

export const OBRAS: Obra[] = [
  {
    id: "obra-a",
    slug: "obra-a",
    titulo: "Obra A",
    descripcion: "Serie Trazos Automáticos",
    precio: 0,
    imagenUrl: "/assets/obra-a.jpg",
    estado: "vendida"
  },
  {
    id: "obra-b",
    slug: "obra-b",
    titulo: "Obra B",
    descripcion: "Serie Trazos Automáticos",
    precio: 0,
    imagenUrl: "/assets/obra-b.jpg",
    estado: "disponible"
  },
  {
    id: "obra-c",
    slug: "obra-c",
    titulo: "Obra C",
    descripcion: "Serie Trazos Automáticos",
    precio: 0,
    imagenUrl: "/assets/obra-c.jpg",
    estado: "disponible"
  },
  {
    id: "obra-d",
    slug: "obra-d",
    titulo: "Obra D",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/assets/obra-d.jpg",
    estado: "regalada"
  },
  {
    id: "obra-e",
    slug: "obra-e",
    titulo: "Obra E",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/assets/obra-e.jpg",
    estado: "disponible"
  },
  {
    id: "obra-f",
    slug: "obra-f",
    titulo: "Obra F",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/assets/obra-f.jpg",
    estado: "disponible"
  },
  {
    id: "obra-g",
    slug: "obra-g",
    titulo: "Obra G",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/assets/obra-g.jpg",
    estado: "disponible"
  },
  {
    id: "obra-h",
    slug: "obra-h",
    titulo: "Obra H",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/assets/obra-h.jpg",
    estado: "disponible"
  },
  {
    id: "obra-i",
    slug: "obra-i",
    titulo: "Obra I",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/assets/obra-i.jpg",
    estado: "disponible"
  },
  {
    id: "obra-j",
    slug: "obra-j",
    titulo: "Obra J",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/assets/obra-j.jpg",
    estado: "disponible"
  },
  {
    id: "obra-k",
    slug: "obra-k",
    titulo: "Obra K",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/assets/obra-k.jpg",
    estado: "disponible"
  },
  {
    id: "obra-l",
    slug: "obra-l",
    titulo: "Obra L",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/assets/obra-l.jpg",
    estado: "disponible"
  },
  {
    id: "obra-m",
    slug: "obra-m",
    titulo: "Obra M",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/assets/obra-m.jpg",
    estado: "disponible"
  },
  {
    id: "obra-n",
    slug: "obra-n",
    titulo: "Obra N",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/assets/obra-n.jpg",
    estado: "disponible"
  },
  {
    id: "obra-ñ",
    slug: "obra-n-2",
    titulo: "Obra Ñ",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/assets/obra-ñ.jpg",
    estado: "disponible"
  }
];

export const OBRAS_DATA = OBRAS;

export default OBRAS;
