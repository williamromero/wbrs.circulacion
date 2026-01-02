"use client";

import { useEffect, useState } from "react";
import { X, Info, Search, FileText, CheckCircle, AlertTriangle } from "lucide-react";

export default function InitialConfigModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar si el modal ya ha sido visto
    const hasSeen = localStorage.getItem("wbrs_has_seen_intro");
    
    if (!hasSeen) {
      // Pequeño delay para una mejor UX
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    // Marcar como visto para no mostrar de nuevo
    localStorage.setItem("wbrs_has_seen_intro", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[rgb(var(--background))] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-[rgb(var(--border))]">
        
        {/* Header */}
        <div className="bg-[rgb(var(--secondary))] p-6 border-b border-[rgb(var(--border))] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-[rgb(var(--foreground))]">
              Bienvenido
            </h2>
            <p className="text-xs text-[rgb(var(--muted))] uppercase tracking-wide font-bold">
              Guía Rápida
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-[rgb(var(--accent))] transition-colors text-[rgb(var(--muted))]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-[rgb(var(--foreground))] leading-relaxed">
            Esta herramienta te permite consultar la tabla de valores imponibles del <strong>Impuesto Sobre Circulación de Vehículos (ISCV) para el año 2026</strong> de forma rápida y sencilla.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="bg-blue-100 p-2 rounded-full h-fit shrink-0">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase text-[rgb(var(--foreground))]">1. Busca tu Vehículo</h3>
                <p className="text-xs text-[rgb(var(--muted))] mt-1">
                  Utiliza los filtros de Marca, Línea y Tipo para encontrar tu vehículo en la base de datos oficial.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-green-100 p-2 rounded-full h-fit shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase text-[rgb(var(--foreground))]">2. Verifica el Impuesto</h3>
                <p className="text-xs text-[rgb(var(--muted))] mt-1">
                  Selecciona un resultado para ver el detalle del impuesto a pagar según el año del modelo. <strong>¡El descuento del 50% ya está calculado!</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-purple-100 p-2 rounded-full h-fit shrink-0">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase text-[rgb(var(--foreground))]">3. Genera tu Formulario</h3>
                <p className="text-xs text-[rgb(var(--muted))] mt-1">
                  Consulta la guía de ayuda en el menú superior para aprender a generar tu boleta de pago SAT-4091 en Declaraguate.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-[rgb(var(--secondary))] p-3 rounded-lg border border-[rgb(var(--border))]">
              <p className="text-xs text-[rgb(var(--muted))] flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Esta es una herramienta de consulta no oficial basada en la tabla publicada por la SAT. Para trámites oficiales, visita siempre los canales gubernamentales.
                  </span>
              </p>
            </div>

            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <p className="text-[10px] md:text-xs text-amber-800 flex items-start gap-2 leading-tight">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    <strong>AVISO IMPORTANTE:</strong> Se ha detectado que algunos datos son imprecisos para la marca <strong>MAZDA</strong>, ya que la base de datos oficial incluye modelos y líneas inexistentes.
                  </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[rgb(var(--secondary))/30] border-t border-[rgb(var(--border))]">
          <button
            onClick={handleClose}
            className="w-full brutal-btn bg-[rgb(var(--foreground))] text-[rgb(var(--background))] hover:bg-[rgb(var(--primary))] border-transparent hover:border-[rgb(var(--primary))] shadow-lg uppercase font-bold tracking-widest"
          >
            Entendido, Iniciar
          </button>
        </div>

      </div>
    </div>
  );
}