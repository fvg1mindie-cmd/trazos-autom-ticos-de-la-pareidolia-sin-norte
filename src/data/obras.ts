export type EstadoObra = "disponible" | "vendida" | "obsequiada";

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
  estado: EstadoObra;
  // Se calcula solo a partir de "estado": es true si la obra ya no está disponible.
  originalVendido: boolean;
  impresiones: Impresion[];
  precioMarco: number;
  precioMarcoMagnetico: number;
  moneda: string;
}

const DESCRIPCION =
  "No hago descripciones la obra es sin norte cada persona completa la obra al observar la colocando la en la posición que deseé no hay posición correcta ni arriba ni abajo para no predisponer sus observaciones";

/**
 * Arma una obra a partir de su letra y su estado.
 * Los datos que se repiten en todas las obras están acá, en un solo lugar.
 * Si alguna obra necesita un dato distinto (por ejemplo otro precio),
 * se pasa como tercer parámetro: crearObra("B", "disponible", { precioOriginal: 50 })
 */
function crearObra(
  letra: string,
  estado: EstadoObra = "disponible",
  cambios: Partial<Omit<Artwork, "estado" | "originalVendido">> = {},
): Artwork {
  const L = letra.toUpperCase();
  return {
    slug: `obra-${letra.toLowerCase()}`,
    catalogo: `OBRA-${L}`,
    titulo: "El título es propio del observador",
    anio: 2026,
    tecnica: "TRAZOS AUTOMÁTICOS",
    soporte: "PAPEL",
    formato: "32x22 cm",
    descripcion: DESCRIPCION,
    imagen: `/${L}0001.jpg`,
    imagenes: [1, 2, 3, 4].map((n) => `/${L}000${n}.jpg`),
    precioOriginal: 30,
    impresiones: [],
    precioMarco: 10,
    precioMarcoMagnetico: 18,
    moneda: "USD",
    ...cambios,
    estado,
    originalVendido: estado !== "disponible",
  };
}

/*
 * ESTADO DE CADA OBRA
 * Para cambiarlo, modificá solo la palabra entre comillas de esa línea:
 *   "disponible"  -> a la venta
 *   "vendida"     -> vendida (se cierra la edición)
 *   "obsequiada"  -> regalada, no está en venta (se cierra la edición)
 * Si no ponés nada, la obra queda "disponible".
 */
export const OBRAS_DATA: Artwork[] = [
  crearObra("A", "obsequiada"),
  crearObra("B", "disponible"),
  crearObra("C", "disponible"),
  crearObra("D", "obsequiada"),
  crearObra("E", "disponible"),
  crearObra("F", "disponible"),
  crearObra("G", "disponible"),
  crearObra("H", "disponible"),
  crearObra("I", "disponible"),
  crearObra("J", "disponible"),
  crearObra("K", "disponible"),
  crearObra("L", "disponible"),
  crearObra("M", "disponible"),
  crearObra("N", "disponible"),
  crearObra("O", "disponible"),
];

export const OBRAS = OBRAS_DATA;
export default OBRAS_DATA;
