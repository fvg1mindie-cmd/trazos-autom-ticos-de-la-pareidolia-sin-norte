import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Eye, ZoomIn, ZoomOut, Info, Image as ImageIcon } from 'lucide-react';
import { ModalPago } from '../../components/ModalPago';

// Importar datos de obras
import * as obrasData from '../../data/obras';

export const Route = createFileRoute('/obras/$slug')({
  component: ObraDetalleRoute,
});

function ObraDetalleRoute() {
  const { slug } = Route.useParams();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vistaActiva, setVistaActiva] = useState<'obra' | 'ficha'>('obra');
  const [zoom, setZoom] = useState(false);

  // Buscar la obra correspondiente al slug actual
  const obrasList = (obrasData as any).OBRAS || (obrasData as any).OBRAS_DATA || (obrasData as any).default || [];
  const obra = obrasList.find((item: any) => item.id === slug || item.slug === slug || item.id === `obra-${slug}`);

  // Título e identificador
  const tituloObra = obra?.titulo || `Obra ${slug.toUpperCase()}`;
  const catalogoObra = obra?.catalogo || obra?.id || slug.toUpperCase();
  
  // Estado de la obra (disponible, vendida, regalada)
  const estadoObra = obra?.estado || 'disponible';
  const noDisponible = estadoObra === 'vendida' || estadoObra === 'regalada';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#fff', padding: '24px 16px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* BARRA DE HERRAMIENTAS Y CONTROLES (Ojito, Lupita y Pestañas de Vista) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', backgroundColor: '#18181b', padding: '12px 16px', borderRadius: '12px', border: '1px solid #27272a' }}>
        
        {/* Pestañas para cambiar entre Vista Obra y Ficha */}
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

        {/* Iconos interactivos: Ojito y Lupita */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Botón Ojito para alternar la vista rapido */}
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

          {/* Botón Lupita para Zoom */}
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

      {/* CONTENIDO PRINCIPAL SEGÚN LA PESTAÑA ACTIVA */}

      {/* 1. VISTA OBRA (IMAGEN PRINCIPAL CON ZOOM Y SELLO) */}
      {vistaActiva === 'obra' && (
        <div style={{ position: 'relative', width: '100%', marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#18181b', border: '1px solid #27272a' }}>
          {obra?.imagenUrl ? (
            <div style={{ overflow: 'auto', textAlign: 'center', cursor: zoom ? 'zoom-out' : 'zoom-in' }} onClick={() => setZoom(!zoom)}>
              <img 
                src={obra.imagenUrl} 
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
      )}

      {/* 2. VISTA FICHA TÉCNICA Y DETALLES */}
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

      {/* BLOQUE DE INFORMACIÓN Y BOTÓN DE ACCIÓN (Común a ambas vistas) */}
      <div style={{ backgroundColor: '#18181b', padding: '24px', borderRadius: '12px', border: '1px solid #27272a' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '1.8rem' }}>{tituloObra}</h1>
        
        {obra?.descripcion && (
          <p style={{ color: '#d4d4d8', lineHeight: '1.6', marginBottom: '20px', fontStyle: 'italic' }}>
            "{obra.descripcion}"
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

      {/* Componente Modal de Pago */}
      <ModalPago
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        tituloObra={tituloObra}
        catalogoObra={catalogoObra}
      />
    </div>
  );
}
