"use client";

import { useEffect, useState } from "react";
import { X, User, CreditCard, Save, ShieldCheck } from "lucide-react";

export default function InitialConfigModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [nit, setNit] = useState("");

  useEffect(() => {
    // Verificar si el modal ya ha sido visto
    const hasSeen = localStorage.getItem("wbrs_has_seen_config");
    
    if (!hasSeen) {
      // Cargar datos previos si existen (por si acaso)
      const storedName = localStorage.getItem("wbrs_owner_name");
      const storedNit = localStorage.getItem("wbrs_owner_nit");
      
      if (storedName) setName(storedName);
      if (storedNit) setNit(storedNit);
      
      // Pequeño delay para una mejor UX
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("wbrs_has_seen_config", "true");
    localStorage.setItem("wbrs_owner_name", name);
    localStorage.setItem("wbrs_owner_nit", nit);
    setIsOpen(false);
    
    // Disparar evento para que otros componentes se enteren (opcional)
    window.dispatchEvent(new Event("storage"));
  };

  const handleClose = () => {
    // Si cierra sin guardar, también marcamos como visto para no molestar
    localStorage.setItem("wbrs_has_seen_config", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[rgb(var(--background))] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-[rgb(var(--border))]">
        
        {/* Header */}
        <div className="bg-[rgb(var(--secondary))] p-6 border-b border-[rgb(var(--border))] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-[rgb(var(--foreground))]">
              Bienvenido
            </h2>
            <p className="text-xs text-[rgb(var(--muted))] uppercase tracking-wide font-bold">
              Configuración Inicial
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
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800">
              Personaliza tu experiencia guardando tus datos. Esta información se almacena localmente en tu navegador.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[rgb(var(--muted))] flex items-center gap-2">
                <User className="w-4 h-4" />
                Nombre del Propietario
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="brutal-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[rgb(var(--muted))] flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                NIT (Opcional)
              </label>
              <input
                type="text"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                placeholder="Ej. 123456-7"
                className="brutal-input"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[rgb(var(--secondary))/30] border-t border-[rgb(var(--border))]">
          <button
            onClick={handleSave}
            className="w-full brutal-btn bg-[rgb(var(--foreground))] text-[rgb(var(--background))] hover:bg-[rgb(var(--primary))] border-transparent hover:border-[rgb(var(--primary))] shadow-lg"
          >
            <Save className="w-4 h-4" />
            GUARDAR Y CONTINUAR
          </button>
        </div>

      </div>
    </div>
  );
}
