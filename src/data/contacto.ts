import React, { useState } from 'react';
import { DATOS_CONTACTO } from '../data/contacto';

interface ModalPagoProps {
  isOpen: boolean;
  onClose: () => void;
  tituloObra: string;
  catalogoObra: string;
}

export const ModalPago: React.FC<ModalPagoProps> = ({ isOpen, onClose, tituloObra, catalogoObra }) => {
  const [copiado, setCopiado] = useState<string | null>(null);

  if (!isOpen) return null;

  const mensajeWhatsApp = encodeURIComponent(
    `Hola, estoy interesado/a en la obra "${catalogoObra} - ${tituloObra}". ¿Sigue disponible?`
  );

  const copiarTexto = (texto: string, clave: string) => {
    navigator.clipboard.writeText(texto);
    setCopiado(clave);
    setTimeout(() => setCopiado(null), 2000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
      <div style={{ backgroundColor: '#18181b', color: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '420px', width: '100%', border: '1px solid #27272a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Comprar / Consultar</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#a1a1aa', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '20px' }}>
          Obra seleccionada: <strong>{catalogoObra}</strong>
        </p>

        {/* Botón WhatsApp */}
        <a
          href={`https://wa.me/${DATOS_CONTACTO.whatsappNumber}?text=${mensajeWhatsApp}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', textAlign: 'center', backgroundColor: '#25D366', color: '#000', fontWeight: 'bold', padding: '12px', borderRadius: '8px', textDecoration: 'none', marginBottom: '16px' }}
        >
          💬 Consultar por WhatsApp
        </a>

        <hr style={{ borderColor: '#27272a', margin: '16px 0' }} />

        {/* Opción Lemon Cash */}
        <div style={{ backgroundColor: '#09090b', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #27272a' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#00E676' }}>🍋 Lemon Cash</p>
          <p style={{ margin: '2px 0', fontSize: '0.85rem' }}>Tag: {DATOS_CONTACTO.lemon.tag}</p>
          <p style={{ margin: '2px 0', fontSize: '0.85rem' }}>Alias: {DATOS_CONTACTO.lemon.alias}</p>
          <button
            onClick={() => copiarTexto(DATOS_CONTACTO.lemon.alias, 'lemon')}
            style={{ marginTop: '8px', width: '100%', padding: '6px', backgroundColor: '#27272a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            {copiado === 'lemon' ? '¡Alias copiado!' : 'Copiar Alias de Lemon'}
          </button>
        </div>

        {/* Opción AstroPay */}
        <div style={{ backgroundColor: '#09090b', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #27272a' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#FF4081' }}>🚀 AstroPay</p>
          <p style={{ margin: '2px 0', fontSize: '0.85rem' }}>Alias: {DATOS_CONTACTO.astroPay.alias}</p>
          <button
            onClick={() => copiarTexto(DATOS_CONTACTO.astroPay.alias, 'astro')}
            style={{ marginTop: '8px', width: '100%', padding: '6px', backgroundColor: '#27272a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            {copiado === 'astro' ? '¡Alias copiado!' : 'Copiar Alias de AstroPay'}
          </button>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#71717a', textAlign: 'center', margin: 0 }}>
          Tras realizar la transferencia, enviá el comprobante por WhatsApp para confirmar tu reserva.
        </p>
      </div>
    </div>
  );
};
