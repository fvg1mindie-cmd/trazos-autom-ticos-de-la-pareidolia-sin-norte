import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Eye, ZoomIn, ZoomOut, Info, Image as ImageIcon } from 'lucide-react';
import { ModalPago } from '../../components/ModalPago';
import { OBRAS_DATA, Artwork } from '../../data/obras';

export const Route = createFileRoute('/obras/$slug')({
  component: ObraDetalleRoute,
});

function ObraDetalleRoute() {
  const { slug } = Route.useParams();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vistaActiva, setVistaActiva] = useState<'obra' | 'ficha'>('obra');
  const [zoom, setZoom] = useState(false);

  // Buscar la obra usando la estructura original
  const obra: Artwork | undefined = OBRAS_DATA.find(
    (item) => item.slug === slug || item.slug === `obra-${slug}` || item.catalogo.toLowerCase() === slug.toLowerCase()
  );

  const tituloObra = obra?.titulo || `Obra ${slug.toUpperCase()}`;
  const catalogoObra = obra?.catalogo || slug.toUpperCase();
  const noDisponible = obra?.originalVendido ?? false;
  const imagenMostrar = obra?.imagen || '';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#fff', padding: '24px 16px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* BARRA DE HERRAMIENTAS (Ojito, Lupita y Pestañas) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', backgroundColor: '#18181b', padding: '12px 16px', borderRadius: '12px', border: '1px solid #27272a' }}>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setVistaActiva('obra')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: vistaActiva === 'obra' ? '#8b5cf6' : '#27272a',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            <ImageIcon size={18} />
            Obra
          </button>
          
          <button
            onClick={() => setVistaActiva('ficha')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: vistaActiva === 'ficha' ? '#8b5cf6' : '#27272a',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            <Info size={18} />
            Ficha Técnica
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setVistaActiva(prev => prev === 'obra' ? 'ficha' : 'obra')}
            title="Cambiar vista (Ojito)"
            style={{
              backgroundColor: '#27272a',
              border: '1px solid #3f3f46',
              color: '#fff',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Eye size={20} color={vistaActiva === 'ficha' ? '#8b5cf6' : '#fff'} />
          </button>

          <button
            onClick={() => setZoom(!zoom)}
            title="Lupa (Zoom)"
            style={{
              backgroundColor: zoom ? '#8b5cf6' : '#27272a',
              border: '1px solid #3f3f46',
              color: '#fff',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {zoom ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
          </button>
        </div>
      </div>

      {/* VISTA OBRA */}
      {vistaActiva === 'obra' && (
        <div style={{ position: 'relative', width: '100%', marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#18181b', border: '1px solid #27272a' }}>
          {imagenMostrar ? (
            <div style={{ overflow: 'auto', textAlign: 'center', cursor: zoom ? 'zoom-out' : 'zoom-in' }} onClick={() => setZoom(!zoom)}>
              <img 
                src={imagenMostrar} 
                alt={tituloObra} 
                style={{ 
                  width: zoom ? '160%' : '100%', 
                  height: 'auto', 
                  display: 'block', 
                  margin: '0 auto',
                  transition: 'width 0.3s ease',
                  filter: noDisponible ? 'brightness(0.65)' : 'none' 
                }} 
              />
            </div>
          ) : (
            <div style={{ padding: '80px 20px', textAlign: 'center', color: '#71717a' }}>
              <p style={{ margin: 0 }}>Sin imagen cargada para: <strong>{tituloObra}</strong></p>
            </div>
          )}

          {noDisponible && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-15deg)',
              backgroundColor: 'rgba(220, 38, 38, 0.9)',
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
              VENDIDA
            </div>
          )}
        </div>
      )}

      {/* VISTA FICHA TÉCNICA */}
      {vistaActiva === 'ficha' && (
        <div style={{ backgroundColor: '#18181b', padding: '24px', borderRadius: '12px', border: '1px solid #27272a', marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0, color: '#8b5cf6', fontSize: '1.4rem' }}>Ficha Técnica</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '20px 0' }}>
            <div>
              <span style={{ color: '#71717a', fontSize: '0.85rem', display: 'block' }}>Código de Catálogo</span>
              <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{catalogoObra}</strong>
            </div>
            {obra?.anio && (
              <div>
                <span style={{ color: '#71717a', fontSize: '0.85rem', display: 'block' }}>Año</span>
                <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{obra.anio}</strong>
              </div>
            )}
            {obra?.tecnica && (
              <div>
                <span style={{ color: '#71717a', fontSize: '0.85rem', display: 'block' }}>Técnica</span>
                <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{obra.tecnica}</strong>
              </div>
            )}
            {obra?.soporte && (
              <div>
                <span style={{ color: '#71717a', fontSize: '0.85rem', display: 'block' }}>Soporte</span>
                <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{obra.soporte}</strong>
              </div>
            )}
            {obra?.formato && (
              <div>
                <span style={{ color: '#71717a', fontSize: '0.85rem', display: 'block' }}>Formato / Medidas</span>
                <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{obra.formato}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BLOQUE DE INFORMACIÓN */}
      <div style={{ backgroundColor: '#18181b', padding: '24px', borderRadius: '12px', border: '1px solid #27272a' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '1.8rem' }}>{tituloObra}</h1>
        
        {obra?.descripcion && (
          <p style={{ color: '#d4d4d8', lineHeight: '1.6', marginBottom: '20px', fontStyle: 'italic' }}>
            "{obra.descripcion}"
          </p>
        )}

        {obra?.precioOriginal !== null && obra?.precioOriginal !== undefined && (
          <div style={{ margin: '20px 0' }}>
            <span style={{ fontSize: '0.9rem', color: '#a1a1aa', display: 'block' }}>Valor estimado</span>
            <span style={{ 
              fontSize: '1.6rem', 
              fontWeight: 'bold', 
              color: noDisponible ? '#71717a' : '#00E676',
              textDecoration: noDisponible ? 'line-through' : 'none'
            }}>
              ${obra.precioOriginal} {obra.moneda}
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
            fontSize: '1.1rem',
            padding: '16px',
            borderRadius: '10px',
            border: 'none',
            cursor: noDisponible ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            marginTop: '12px'
          }}
        >
          {noDisponible ? 'OBRA VENDIDA' : 'RESERVAR / CONSULTAR'}
        </button>
      </div>

      <ModalPago
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        tituloObra={tituloObra}
        catalogoObra={catalogoObra}
      />
    </div>
  );
}
