export interface Obra {
  id: string;
  titulo: string;
  descripcion?: string;
  precio?: number;
  imagenUrl?: string;
  estado?: 'disponible' | 'vendida' | 'regalada';
}

export const OBRAS: Obra[] = [
  {
    id: "obra-a",
    titulo: "Obra A",
    descripcion: "Serie Trazos Automáticos",
    precio: 30000,
    imagenUrl: "/assets/obra-a.jpg",
    estado: "vendida"
  },
  {
    id: "obra-b",
    titulo: "Obra B",
    descripcion: "Serie Trazos Automáticos",
    precio: 30000,
    imagenUrl: "/assets/obra-b.jpg",
    estado: "disponible"
  },
  {
    id: "obra-c",
    titulo: "Obra C",
    descripcion: "Serie Trazos Automáticos",
    precio: 30000,
    imagenUrl: "/assets/obra-c.jpg",
    estado: "disponible"
  },
  {
    id: "obra-d",
    titulo: "Obra D",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 30000,
    imagenUrl: "/assets/obra-d.jpg",
    estado: "regalada"
  },
  {
    id: "obra-e",
    titulo: "Obra E",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 30000,
    imagenUrl: "/assets/obra-e.jpg",
    estado: "disponible"
  },
  {
    id: "obra-f",
    titulo: "Obra F",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 30000,
    imagenUrl: "/assets/obra-f.jpg",
    estado: "disponible"
  },
  {
    id: "obra-g",
    titulo: "Obra G",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 30000,
    imagenUrl: "/assets/obra-g.jpg",
    estado: "disponible"
  },
  {
    id: "obra-h",
    titulo: "Obra H",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 30000,
    imagenUrl: "/assets/obra-h.jpg",
    estado: "disponible"
  },
  {
    id: "obra-i",
    titulo: "Obra I",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 30000,
    imagenUrl: "/assets/obra-i.jpg",
    estado: "disponible"
  },
  {
    id: "obra-j",
    titulo: "Obra J",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 30000,
    imagenUrl: "/assets/obra-j.jpg",
    estado: "disponible"
  },
  {
    id: "obra-k",
    titulo: "Obra K",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 30000,
    imagenUrl: "/assets/obra-k.jpg",
    estado: "disponible"
  },
  {
    id: "obra-l",
    titulo: "Obra L",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 30000,
    imagenUrl: "/assets/obra-l.jpg",
    estado: "disponible"
  },
  {
    id: "obra-m",
    titulo: "Obra M",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 30000,
    imagenUrl: "/assets/obra-m.jpg",
    estado: "disponible"
  },
  {
    id: "obra-n",
    titulo: "Obra N",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 30000,
    imagenUrl: "/assets/obra-n.jpg",
    estado: "disponible"
  },
  {
    id: "obra-ñ",
    titulo: "Obra Ñ",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 30000,
    imagenUrl: "/assets/obra-ñ.jpg",
    estado: "disponible"
  }
];

export default OBRAS;
