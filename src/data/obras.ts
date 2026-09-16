export interface Obra {
  id: string;
  slug: string;
  titulo: string;
  descripcion?: string;
  precio: number;
  imagenUrl?: string;
  imagen?: string;
  image?: string;
  imagenes?: string[];
  estado?: 'disponible' | 'vendida' | 'regalada';
}

export const OBRAS: Obra[] = [
  {
    id: "obra-a",
    slug: "obra-a",
    titulo: "Obra A",
    descripcion: "Serie Trazos Automáticos",
    precio: 0,
    imagenUrl: "/A0001.jpg",
    imagen: "/A0001.jpg",
    image: "/A0001.jpg",
    imagenes: ["/A0001.jpg", "/A0002.jpg", "/A0003.jpg", "/A0004.jpg"],
    estado: "vendida"
  },
  {
    id: "obra-b",
    slug: "obra-b",
    titulo: "Obra B",
    descripcion: "Serie Trazos Automáticos",
    precio: 0,
    imagenUrl: "/B0001.jpg",
    imagen: "/B0001.jpg",
    image: "/B0001.jpg",
    imagenes: ["/B0001.jpg", "/B0002.jpg", "/B0003.jpg", "/B0004.jpg"],
    estado: "disponible"
  },
  {
    id: "obra-c",
    slug: "obra-c",
    titulo: "Obra C",
    descripcion: "Serie Trazos Automáticos",
    precio: 0,
    imagenUrl: "/C0001.jpg",
    imagen: "/C0001.jpg",
    image: "/C0001.jpg",
    imagenes: ["/C0001.jpg", "/C0002.jpg", "/C0003.jpg", "/C0004.jpg"],
    estado: "disponible"
  },
  {
    id: "obra-d",
    slug: "obra-d",
    titulo: "Obra D",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/D0001.jpg",
    imagen: "/D0001.jpg",
    image: "/D0001.jpg",
    imagenes: ["/D0001.jpg"],
    estado: "regalada"
  },
  {
    id: "obra-e",
    slug: "obra-e",
    titulo: "Obra E",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/E0001.jpg",
    imagen: "/E0001.jpg",
    image: "/E0001.jpg",
    imagenes: ["/E0001.jpg"],
    estado: "disponible"
  },
  {
    id: "obra-f",
    slug: "obra-f",
    titulo: "Obra F",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/F0001.jpg",
    imagen: "/F0001.jpg",
    image: "/F0001.jpg",
    imagenes: ["/F0001.jpg"],
    estado: "disponible"
  },
  {
    id: "obra-g",
    slug: "obra-g",
    titulo: "Obra G",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/G0001.jpg",
    imagen: "/G0001.jpg",
    image: "/G0001.jpg",
    imagenes: ["/G0001.jpg"],
    estado: "disponible"
  },
  {
    id: "obra-h",
    slug: "obra-h",
    titulo: "Obra H",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/H0001.jpg",
    imagen: "/H0001.jpg",
    image: "/H0001.jpg",
    imagenes: ["/H0001.jpg"],
    estado: "disponible"
  },
  {
    id: "obra-i",
    slug: "obra-i",
    titulo: "Obra I",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/I0001.jpg",
    imagen: "/I0001.jpg",
    image: "/I0001.jpg",
    imagenes: ["/I0001.jpg"],
    estado: "disponible"
  },
  {
    id: "obra-j",
    slug: "obra-j",
    titulo: "Obra J",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/J0001.jpg",
    imagen: "/J0001.jpg",
    image: "/J0001.jpg",
    imagenes: ["/J0001.jpg"],
    estado: "disponible"
  },
  {
    id: "obra-k",
    slug: "obra-k",
    titulo: "Obra K",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/K0001.jpg",
    imagen: "/K0001.jpg",
    image: "/K0001.jpg",
    imagenes: ["/K0001.jpg"],
    estado: "disponible"
  },
  {
    id: "obra-l",
    slug: "obra-l",
    titulo: "Obra L",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/L0001.jpg",
    imagen: "/L0001.jpg",
    image: "/L0001.jpg",
    imagenes: ["/L0001.jpg"],
    estado: "disponible"
  },
  {
    id: "obra-m",
    slug: "obra-m",
    titulo: "Obra M",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/M0001.jpg",
    imagen: "/M0001.jpg",
    image: "/M0001.jpg",
    imagenes: ["/M0001.jpg", "/M0002.jpg", "/M0003.jpg"],
    estado: "disponible"
  },
  {
    id: "obra-n",
    slug: "obra-n",
    titulo: "Obra N",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/N0001.jpg",
    imagen: "/N0001.jpg",
    image: "/N0001.jpg",
    imagenes: ["/N0001.jpg", "/N0002.jpg", "/N0003.jpg", "/N0004.jpg"],
    estado: "disponible"
  },
  {
    id: "obra-ñ",
    slug: "obra-n-2",
    titulo: "Obra Ñ",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 0,
    imagenUrl: "/Ñ0001.jpg",
    imagen: "/Ñ0001.jpg",
    image: "/Ñ0001.jpg",
    imagenes: ["/Ñ0001.jpg", "/Ñ0002.jpg", "/Ñ0003.jpg", "/Ñ0004.jpg"],
    estado: "disponible"
  }
];

export const OBRAS_DATA = OBRAS;

export default OBRAS;
