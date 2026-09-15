import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ModalPago } from '../../components/ModalPago';
import { DATOS_CONTACTO } from '../../data/contacto';

// Intentamos importar de las posibles ubicaciones de obras
import * as obrasData from '../../data/obras';

export const Route = createFileRoute('/obras/$slug')({
  component: ObraDetalleRoute,
});

function ObraDetalleRoute() {
  const { slug } = Route.useParams();
  const [modalAbierto, setModalAbierto] = useState(false);

  // Buscar la obra correspondiente al slug actual
  const obrasList = (obrasData as any).OBRAS || (obrasData as any).default || [];
  const obra = obrasList.find((item: any) => item.id === slug || item.slug === slug || item.id === `obra-${slug}`);

  // Título e identificador para el modal
  const tituloObra = obra?.titulo || `Obra ${slug.toUpperCase()}`;
  const catalogoObra = obra?.id || slug;
  
  // Estado de la obra (disponible, vendida, regalada)
  const estadoObra = obra?.estado || 'disponible';
  const noDisponible = estadoObra === 'vendida' || estadoObra === 'regalada';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#fff', padding: '24px 16px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Visualizador / Imagen de la obra con marca de agua */}
      <div style={{ position: 'relative', width: '100%', marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#18181b', border: '1px solid #27272a' }}>
        {obra?.imagenUrl ? (
          <img 
            src={obra.imagenUrl} 
            alt={tituloObra} 
            style={{ width: '100%', height: 'auto', display: 'block', filter: noDisponible ? 'brightness(0.65)' : 'none' }} 
          />
        ) : (
          <div style={{ padding: '80px 20px', textAlign: 'center', color: '#71717a' }}>
            <p style={{ margin: 0 }}>Vista previa de la obra: <strong>{tituloObra}</strong></p>
          </div>
        )}

        {/* Marca de agua / Sello si la obra está vendida o regalada */}
        {noDisponible && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-15deg)',
            backgroundColor: estadoObra === 'vendida' ? 'rgba(220, 38, 38, 0.9)' : 'rgba(147, 51, 234, 0.9)',
            color: '#fff',
            fontWeight: '900',
            fontSize: '1.5rem',
            letterSpacing: '2px',
            padding: '10px 28px',
            borderRadius: '8px',
            textTransform: 'uppercase',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
            border: '2px solid rgba(255,255,255,0.4)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}>
            {estadoObra === 'vendida' ? 'VENDIDA' : 'COLECCIÓN PRIVADA'}
          </div>
        )}
      </div>

      {/* Información detallada */}
      <div style={{ backgroundColor: '#18181b', padding: '24px', borderRadius: '12px', border: '1px solid #27272a' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '1.8rem' }}>{tituloObra}</h1>
        <p style={{ color: '#a1a1aa', margin: '0 0 16px 0', fontSize: '0.9rem' }}>
          Código de catálogo: <strong style={{ color: '#d4d4d8' }}>{catalogoObra}</strong>
        </p>

        {obra?.descripcion && (
          <p style={{ color: '#d4d4d8', lineHeight: '1.6', marginBottom: '20px' }}>
            {obra.descripcion}
          </p>
        )}

        {obra?.precio && (
          <div style={{ margin: '20px 0' }}>
            <span style={{ fontSize: '0.9rem', color: '#a1a1aa', display: 'block' }}>Valor estimado</span>
            <span style={{ 
              fontSize: '1.6rem', 
              fontWeight: 'bold', 
              color: noDisponible ? '#71717a' : '#00E676',
              textDecoration: noDisponible ? 'line-through' : 'none'
            }}>
              ${obra.precio.toLocaleString()} ARS
            </span>
          </div>
        )}

        {/* Botón de Reservar / Consultar */}
        <button
          onClick={() => !noDisponible && setModalAbierto(true)}
          disabled={noDisponible}
          style={{
            width: '100%',
            backgroundColor: noDisponible ? '#27272a' : '#8b5cf6',
            color: noDisponible ? '#a1a1aa' : '#fff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            padding: '16px',
            borderRadius: '10px',
            border: 'none',
            cursor: noDisponible ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            marginTop: '12px'
          }}
        >
          {noDisponible 
            ? (estadoObra === 'vendida' ? 'OBRA VENDIDA' : 'COLECCIÓN PRIVADA') 
            : 'RESERVAR / CONSULTAR'
          }
        </button>
      </div>

      {/* Componente Modal de Pago e Información de Contacto */}
      <ModalPago
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        tituloObra={tituloObra}
        catalogoObra={catalogoObra}
      />
    </div>
  );
}
