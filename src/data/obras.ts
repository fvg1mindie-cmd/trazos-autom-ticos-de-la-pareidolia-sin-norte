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
    estado: "vendida" // 👈 Poné "vendida" para el sello de vendida
  },
  {
    id: "obra-d",
    titulo: "Obra D",
    descripcion: "Serie Pareidolia Sin Norte",
    precio: 30000,
    imagenUrl: "/assets/obra-d.jpg",
    estado: "disponible" // 👈 Poné "disponible" para poder comprarla
  }
];

export default OBRAS;
