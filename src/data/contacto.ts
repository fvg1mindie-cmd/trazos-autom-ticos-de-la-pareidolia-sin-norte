export interface ContactoInfo {
  email: string;
  instagram?: string;
  telefono?: string;
  ubicacion?: string;
}

export const CONTACTO_INFO: ContactoInfo = {
  email: "contacto@pareidolia.com",
  instagram: "@pareidolia.sin.norte",
  ubicacion: "Mendoza, Argentina"
};

export default CONTACTO_INFO;
