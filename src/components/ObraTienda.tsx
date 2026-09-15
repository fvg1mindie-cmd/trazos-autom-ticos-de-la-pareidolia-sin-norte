import React, { useState } from 'react';
import { ModalPago } from './ModalPago';

interface Obra {
  id: string;
  titulo: string;
  descripcion?: string;
  precio?: number;
  imagenUrl?: string;
  disponible?: boolean;
}

interface ObraTiendaProps {
  obra: Obra;
}

export const ObraTienda: React.FC<ObraTiendaProps> = ({ obra }) => {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div className="obra-tienda-container" style={{ padding: '20px', backgroundColor: '#09090b', borderRadius: '12px', color: '#fff' }}>
      {obra.imagenUrl && (
        <img 
          src={obra.imagenUrl} 
          alt={obra.titulo} 
          style={{ width: '100%', borderRadius: '8px', marginBottom: '16px', objectFit: 'cover' }} 
        />
      )}
      <h2 style={{ margin: '0 0 8px 0' }}>{obra.titulo}</h2>
      <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '12px' }}>Código: {obra.id}</p>
      
      {obra.descripcion && (
        <p style={{ color: '#d4d4d8', marginBottom: '16px' }}>{obra.descripcion}</p>
      )}

      {obra.precio && (
        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>
          ${obra.precio.toLocaleString()} ARS
        </p>
      )}

      <button
        onClick={() => setModalAbierto(true)}
        style={{
          width: '100%',
          backgroundColor: '#8b5cf6',
          color: '#fff',
          fontWeight: 'bold',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'background-color 0.2s'
        }}
      >
        Comprar / Consultar Obra
      </button>

      <ModalPago
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        tituloObra={obra.titulo}
        catalogoObra={obra.id}
      />
    </div>
  );
};
