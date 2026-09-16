import React, { useState } from 'react';
import { Artwork } from '../data/obras';
import { ModalPago } from './ModalPago';

interface ObraTiendaProps {
  obra: Artwork;
}

export const ObraTienda: React.FC<ObraTiendaProps> = ({ obra }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoCompra, setTipoCompra] = useState<'original' | 'impresion'>('original');
  const [escalaSeleccionada, setEscalaSeleccionada] = useState<string>('');
  const [incluyeMarco, setIncluyeMarco] = useState(false);
  const [incluyeMarcoMagnetico, setIncluyeMarcoMagnetico] = useState(false);

  const noDisponible = obra.originalVendido;
  const moneda = obra.moneda || 'USD';

  // Cálculo del precio base
  let precioBase = 0;
  if (tipoCompra === 'original') {
    precioBase = obra.precioOriginal ?? 0;
  } else {
    const imp = obra.impresiones?.find((i) => i.escala === escalaSeleccionada);
    precioBase = imp ? imp.precio : 0;
  }

  // Adicionales por marcos
  const adicionalMarco = incluyeMarco ? obra.precioMarco || 0 : 0;
  const adicionalMarcoMag = incluyeMarcoMagnetico ? obra.precioMarcoMagnetico || 0 : 0;
  const precioTotal = precioBase + adicionalMarco + adicionalMarcoMag;

  return (
    <div className="mt-8 border-t border-border/70 pt-6 space-y-6 font-mono text-[13px]">
      {/* Selector: Obra Original vs Impresión */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            setTipoCompra('original');
            setEscalaSeleccionada('');
          }}
          className={`flex-1 rounded-lg border px-4 py-3 text-center transition-all ${
            tipoCompra === 'original'
              ? 'border-primary bg-primary/10 text-primary font-bold'
              : 'border-border/60 bg-card/40 text-muted-foreground hover:border-border'
          }`}
        >
          <div>Original</div>
          <div className="text-[11px] opacity-80">
            {noDisponible ? 'Vendido' : `$${obra.precioOriginal} ${moneda}`}
          </div>
        </button>

        {obra.impresiones && obra.impresiones.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setTipoCompra('impresion');
              if (obra.impresiones.length > 0) {
                setEscalaSeleccionada(obra.impresiones[0].escala);
              }
            }}
            className={`flex-1 rounded-lg border px-4 py-3 text-center transition-all ${
              tipoCompra === 'impresion'
                ? 'border-primary bg-primary/10 text-primary font-bold'
                : 'border-border/60 bg-card/40 text-muted-foreground hover:border-border'
            }`}
          >
            <div>Impresión / Reproducción</div>
            <div className="text-[11px] opacity-80">Edición en alta calidad</div>
          </button>
        )}
      </div>

      {/* Opciones de Impresión (escalas) */}
      {tipoCompra === 'impresion' && obra.impresiones && obra.impresiones.length > 0 && (
        <div className="space-y-2 rounded-lg border border-border/60 bg-card/30 p-4">
          <label className="block text-[11px] tracking-wider text-muted-foreground uppercase">
            Seleccionar Escala / Tamaño:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {obra.impresiones.map((imp) => (
              <button
                key={imp.escala}
                type="button"
                onClick={() => setEscalaSeleccionada(imp.escala)}
                className={`rounded-md border p-2 text-left text-[12px] transition-all ${
                  escalaSeleccionada === imp.escala
                    ? 'border-primary bg-primary/20 text-foreground font-semibold'
                    : 'border-border/50 bg-background/50 text-muted-foreground'
                }`}
              >
                <div>{imp.escala}</div>
                <div className="text-[10px] text-primary">${imp.precio} {moneda}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Opciones de Marcos */}
      <div className="space-y-3 rounded-lg border border-border/60 bg-card/30 p-4">
        <span className="block text-[11px] tracking-wider text-muted-foreground uppercase">
          Enmarcado y Soporte Opciónal:
        </span>
        
        {obra.precioMarco > 0 && (
          <label className="flex items-center justify-between cursor-pointer text-muted-foreground hover:text-foreground">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={incluyeMarco}
                onChange={(e) => {
                  setIncluyeMarco(e.target.checked);
                  if (e.target.checked) setIncluyeMarcoMagnetico(false);
                }}
                className="accent-primary h-4 w-4 rounded"
              />
              Marco Tradicional (+${obra.precioMarco} {moneda})
            </span>
          </label>
        )}

        {obra.precioMarcoMagnetico > 0 && (
          <label className="flex items-center justify-between cursor-pointer text-muted-foreground hover:text-foreground">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={incluyeMarcoMagnetico}
                onChange={(e) => {
                  setIncluyeMarcoMagnetico(e.target.checked);
                  if (e.target.checked) setIncluyeMarco(false);
                }}
                className="accent-primary h-4 w-4 rounded"
              />
              Dispositivo Marco Magnético Giratorio 360° (+${obra.precioMarcoMagnetico} {moneda})
            </span>
          </label>
        )}
      </div>

      {/* Resumen de Valor Estimado Total */}
      <div className="flex items-center justify-between rounded-xl bg-card/60 p-4 border border-border/70">
        <div>
          <span className="block text-[11px] tracking-wider text-muted-foreground uppercase">
            Valor Estimado Total
          </span>
          <span className="text-[11px] text-muted-foreground">
            {tipoCompra === 'original' ? 'Obra Original' : `Impresión (${escalaSeleccionada})`}
            {incluyeMarco && ' + Marco Tradicional'}
            {incluyeMarcoMagnetico && ' + Marco Magnético 360°'}
          </span>
        </div>
        <div className={`text-2xl font-bold ${noDisponible && tipoCompra === 'original' ? 'text-muted-foreground line-through' : 'text-primary'}`}>
          ${precioTotal} {moneda}
        </div>
      </div>

      {/* Botón Violeta de Compra / Consulta */}
      <button
        type="button"
        onClick={() => !(noDisponible && tipoCompra === 'original') && setModalAbierto(true)}
        disabled={noDisponible && tipoCompra === 'original'}
        style={{
          width: '100%',
          backgroundColor: noDisponible && tipoCompra === 'original' ? '#27272a' : '#8b5cf6',
          color: noDisponible && tipoCompra === 'original' ? '#a1a1aa' : '#fff',
          fontWeight: 'bold',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          cursor: noDisponible && tipoCompra === 'original' ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          letterSpacing: '0.05em',
          transition: 'background-color 0.2s',
          boxShadow: noDisponible && tipoCompra === 'original' ? 'none' : '0 4px 14px rgba(139, 92, 246, 0.4)'
        }}
      >
        {noDisponible && tipoCompra === 'original' ? 'OBRA VENDIDA (Ver Impresiones)' : 'Comprar / Consultar Obra'}
      </button>

      <ModalPago
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        tituloObra={`${obra.titulo} (${tipoCompra === 'original' ? 'Original' : 'Impresión'})`}
        catalogoObra={obra.catalogo || obra.slug}
      />
    </div>
  );
};
