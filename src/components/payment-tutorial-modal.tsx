"use client";

import { useState } from "react";
import { X, PlayCircle, HelpCircle, YoutubeIcon } from "lucide-react";

export default function PaymentTutorialModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wide text-[rgb(var(--muted))] hover:text-[rgb(var(--primary))] transition-colors"
      >
        <YoutubeIcon className="w-5 h-5 text-red-600" />
        <span>Genera formulario SAT-4091</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-[rgb(var(--background))] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative border border-[rgb(var(--border))]">
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-[rgb(var(--border))] bg-[rgb(var(--secondary))]">
              <h2 className="text-lg md:text-xl font-black uppercase flex items-center gap-2 text-[rgb(var(--foreground))]">
                <PlayCircle className="w-6 h-6 text-red-600" />
                Guía para Presentar Formulario 4091
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-[rgb(var(--accent))] transition-colors text-[rgb(var(--foreground))]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Video Content */}
            <div className="relative w-full aspect-video bg-black">
              <video 
                className="absolute top-0 left-0 w-full h-full"
                controls
                autoPlay
                src="/formulario-declaraguate-4091.mp4"
              >
                Tu navegador no soporta el elemento de video.
              </video>
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 bg-[rgb(var(--background))] text-center">
              <p className="text-sm text-[rgb(var(--muted))]">
                Sigue los pasos del video oficial de la SAT para realizar tu pago correctamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
