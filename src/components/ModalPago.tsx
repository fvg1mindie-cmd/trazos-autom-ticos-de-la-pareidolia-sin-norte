import React from 'react';

interface ModalPagoProps {
  isOpen: boolean;
  onClose: () => void;
  tituloObra: string;
  catalogoObra: string;
}

export const ModalPago: React.FC<ModalPagoProps> = ({ isOpen, onClose, tituloObra, catalogoObra }) => {
  if (!isOpen) return null;

  const mensajeWhatsApp = encodeURIComponent(
    `Hola, quiero consultar / adquirir la obra: ${tituloObra} (Código: ${catalogoObra})`
  );

  // Enlaces de tus medios de pago y contacto
  const linkWhatsApp = `https://wa.me/5492610000000?text=${mensajeWhatsApp}`; // Modificar con tu número de WhatsApp
  const linkLemon = `https://lemon.me`; // Enlace a tu alias / tag de Lemon
  const linkAstroPay = `https://astropay.com`; // Enlace a tu opción de AstroPay

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '420px',
        width: '100%',
        color: '#fff',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Adquirir / Consultar Obra</h3>
          <button 
            onClick={onClose}
            style={{ backgroundColor: 'transparent', border: 'none', color: '#a1a1aa', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '20px' }}>
          Seleccioná un medio de pago o contacto directo para coordinar la entrega de <strong>{catalogoObra}</strong>:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Botón WhatsApp */}
          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              backgroundColor: '#25D366',
              color: '#000',
              fontWeight: 'bold',
              padding: '14px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '0.95rem'
            }}
          >
            Consultar por WhatsApp
          </a>

          {/* Botón Lemon Cash */}
          <a
            href={linkLemon}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              backgroundColor: '#00E676',
              color: '#000',
              fontWeight: 'bold',
              padding: '14px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '0.95rem'
            }}
          >
            Pagar con Lemon Cash
          </a>

          {/* Botón AstroPay */}
          <a
            href={linkAstroPay}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              backgroundColor: '#3b82f6',
              color: '#fff',
              fontWeight: 'bold',
              padding: '14px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '0.95rem'
            }}
          >
            Pagar con AstroPay
          </a>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: '1px solid #3f3f46',
            color: '#a1a1aa',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '16px',
            fontSize: '0.85rem'
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
