import VehicleSearch from "@/components/vehicle-search";
import ThemeToggle from "@/components/theme-toggle";
import PaymentTutorialModal from "@/components/payment-tutorial-modal";
import InitialConfigModal from "@/components/initial-config-modal";
import { ExternalLink, Heart } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col min-h-screen p-4 md:p-8 space-y-8 bg-grid-pattern transition-colors duration-300">
      <InitialConfigModal />
      
      {/* Header */}
      <header className="border-b border-[rgb(var(--border))] sm:pb-6 mb-4 mt-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-start w-full mt-3">

               <div className="relative z-10">
                <div className="inline-block bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] px-3 py-1 text-xl font-bold uppercase tracking-widest rounded-full shadow-sm absolute right-0 -z-1 -top-3 ">
                  2026
                </div>
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--muted))] mb-1">Impuesto de</h3>
                 <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight uppercase leading-none mb-2 break-words text-[rgb(var(--foreground))]">
                  Circulación
                </h1>

               </div>
              <div className="md:hidden">
                 <ThemeToggle />
              </div>
            </div>
          
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <div className="text-right hidden md:block text-[rgb(var(--foreground))]">
              <p className="font-bold text-lg uppercase tracking-tight">Consulta de Valores</p>
              <div className="flex flex-col items-end gap-2 mt-1">
                <div className="flex items-center justify-end gap-1.5 text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--primary))] transition-opacity">
                  <span>BASE DE DATOS OFICIAL</span>
                  <a 
                    href="https://portal.sat.gob.gt/portal/tablas-y-acuerdos-vehiculos/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <PaymentTutorialModal />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 w-full max-w-7xl mx-auto">
        <VehicleSearch />
      </section>

      {/* Footer */}
      <footer className="relative mt-6 pt-8 border-t border-[rgb(var(--border))] flex flex-col md:flex-row justify-center items-center gap-2 text-sm font-bold uppercase text-[rgb(var(--muted))] mb-5">
        <div className="flex items-center gap-2 relative">
          <span>Hecho con</span>
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-heartbeat" />
          <span>POR</span>
          <span className="bg-[rgb(var(--foreground))] text-[rgb(var(--background))] px-2 py-1 pr-4 tracking-widest rounded-md">
            WEBRES STUDIO
          </span>
          <a 
            href="https://www.webres-studio.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center group transition-transform hover:scale-110 absolute -right-[3em]">
            <Image 
              src="/wbrs.svg" 
              alt="WBRS Logo" 
              width={55} 
              height={55} 
              className="-right-[3.5em] z-0"
            />
          </a>
        </div>
      </footer>
    </main>
  );
}