import React, { useState } from 'react';
import { ModalPago } from './ModalPago';

export interface Obra {
  id: string;
  titulo: string;
  descripcion?: string;
  precio?: number;
  imagenUrl?: string;
  estado?: 'disponible' | 'vendida' | 'regalada';
}

interface ObraTiendaProps {
  obra: Obra;
}

export const ObraTienda: React.FC<ObraTiendaProps> = ({ obra }) => {
  const [modalAbierto, setModalAbierto] = useState(false);

  const estadoObra = obra.estado || 'disponible';
  const noDisponible = estadoObra === 'vendida' || estadoObra === 'regalada';

  return (
    <div className="obra-tienda-container" style={{ padding: '20px', backgroundColor: '#09090b', borderRadius: '12px', color: '#fff' }}>
      
      <div style={{ position: 'relative', width: '100%', marginBottom: '16px', overflow: 'hidden', borderRadius: '8px' }}>
        {obra.imagenUrl && (
          <img 
            src={obra.imagenUrl} 
            alt={obra.titulo} 
            style={{ 
              width: '100%', 
              display: 'block', 
              objectFit: 'cover',
              filter: noDisponible ? 'brightness(0.65)' : 'none'
            }} 
          />
        )}

        {noDisponible && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-15deg)',
            backgroundColor: estadoObra === 'vendida' ? 'rgba(220, 38, 38, 0.9)' : 'rgba(147, 51, 234, 0.9)',
            color: '#fff',
            fontWeight: '900',
            fontSize: '1.4rem',
            letterSpacing: '2px',
            padding: '8px 24px',
            borderRadius: '6px',
            textTransform: 'uppercase',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            border: '2px solid rgba(255,255,255,0.3)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}>
            {estadoObra === 'vendida' ? 'VENDIDA' : 'COLECCIÓN PRIVADA'}
          </div>
        )}
      </div>

      <h2 style={{ margin: '0 0 8px 0' }}>{obra.titulo}</h2>
      <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '12px' }}>Código: {obra.id}</p>
      
      {obra.descripcion && (
        <p style={{ color: '#d4d4d8', marginBottom: '16px' }}>{obra.descripcion}</p>
      )}

      {obra.precio && (
        <p style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          textDecoration: noDisponible ? 'line-through' : 'none',
          color: noDisponible ? '#71717a' : '#fff'
        }}>
          ${obra.precio.toLocaleString()} ARS
        </p>
      )}

      <button
        onClick={() => !noDisponible && setModalAbierto(true)}
        disabled={noDisponible}
        style={{
          width: '100%',
          backgroundColor: noDisponible ? '#27272a' : '#8b5cf6',
          color: noDisponible ? '#a1a1aa' : '#fff',
          fontWeight: 'bold',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          cursor: noDisponible ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          transition: 'background-color 0.2s'
        }}
      >
        {noDisponible 
          ? (estadoObra === 'vendida' ? 'Obra Vendida' : 'Colección Privada') 
          : 'Comprar / Consultar Obra'
        }
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
