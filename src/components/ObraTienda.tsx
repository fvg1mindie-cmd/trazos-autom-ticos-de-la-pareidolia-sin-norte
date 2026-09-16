import React, { useState } from 'react';
import { ModalPago } from './ModalPago';
import { Artwork } from '../data/obras';

interface ObraTiendaProps {
  obra: Artwork;
}

export const ObraTienda: React.FC<ObraTiendaProps> = ({ obra }) => {
  const [modalAbierto, setModalAbierto] = useState(false);

  const noDisponible = obra.originalVendido;
  const precioMostrar = obra.precioOriginal;
  const monedaMostrar = obra.moneda || 'USD';

  return (
    <div className="mt-8 border-t border-border/70 pt-6">
      {precioMostrar !== null && precioMostrar !== undefined && (
        <div className="mb-4 flex items-center justify-between font-mono">
          <span className="text-[12px] tracking-[0.15em] text-muted-foreground uppercase">
            Valor Estimado
          </span>
          <span className={`text-2xl font-bold ${noDisponible ? 'text-muted-foreground line-through' : 'text-primary'}`}>
            ${precioMostrar} {monedaMostrar}
          </span>
        </div>
      )}

      <button
        onClick={() => !noDisponible && setModalAbierto(true)}
        disabled={noDisponible}
        style={{
          width: '100%',
          backgroundColor: noDisponible ? '#27272a' : '#8b5cf6',
          color: noDisponible ? '#a1a1aa' : '#fff',
          fontWeight: 'bold',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          cursor: noDisponible ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          letterSpacing: '0.05em',
          transition: 'background-color 0.2s',
          boxShadow: noDisponible ? 'none' : '0 4px 14px rgba(139, 92, 246, 0.4)'
        }}
      >
        {noDisponible ? 'OBRA VENDIDA' : 'Comprar / Consultar Obra'}
      </button>

      <ModalPago
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        tituloObra={obra.titulo}
        catalogoObra={obra.catalogo || obra.slug}
      />
    </div>
  );
};
