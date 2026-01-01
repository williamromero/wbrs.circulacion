import VehicleSearch from "@/components/vehicle-search";
import ThemeToggle from "@/components/theme-toggle";
import { ExternalLink, Heart } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col min-h-screen p-4 md:p-8 space-y-8 bg-grid-pattern transition-colors duration-300">
      
      {/* Header */}
      <header className="border-b-4 border-[rgb(var(--foreground))] pb-6 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-start w-full">
               <div className="relative z-10">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-1">Impuesto de</h3>
                 <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-2 break-words text-[rgb(var(--foreground))]">
                  Circulación
                </h1>
                
                {/* Logo Section - Visible on all screens */}
                <div className="absolute -right-4 sm:-right-20 -bottom- transform -translate-y-1/2 flex flex-row items-center -z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60 group-hover:opacity-100 group-hover:text-[rgb(var(--primary))]">Por</span>
                   <a 
                     href="https://www.webres-studio.com" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex flex-col items-center group transition-transform hover:scale-110"
                   >
                     <Image 
                       src="/wbrs.svg" 
                       alt="WBRS Logo" 
                       width={55} 
                       height={55} 
                     />
                   </a>
                </div>

               </div>
              <div className="md:hidden">
                 <ThemeToggle />
              </div>
            </div>
           
            <div className="flex items-center gap-4 mt-2">
                <div className="inline-block bg-[rgb(var(--foreground))] text-[rgb(var(--background))] px-3 py-1 text-sm font-bold uppercase tracking-widest transform -rotate-2 shadow-lg">
                  Edición 2026
                </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <div className="text-right hidden md:block text-[rgb(var(--foreground))]">
              <p className="font-bold text-lg uppercase tracking-tight">Consulta de Valores</p>
              <div className="flex items-center justify-end gap-1.5 text-sm font-mono opacity-80 hover:opacity-100 transition-opacity">
                <span>BASE DE DATOS OFICIAL</span>
                <a 
                  href="https://portal.sat.gob.gt/portal/tablas-y-acuerdos-vehiculos/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[rgb(var(--primary))] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
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
      <footer className="mt-12 pt-8 border-t-4 border-[rgb(var(--foreground))] flex flex-col md:flex-row justify-center items-center gap-2 text-sm font-bold uppercase text-[rgb(var(--foreground))]">
        <div className="flex items-center gap-2">
           <span>Hecho con</span>
           <Heart className="w-4 h-4 text-[#ff00ff] fill-[#ff00ff]" />
           <span>por</span>
           <span className="bg-[rgb(var(--foreground))] text-[rgb(var(--background))] px-2 py-1 tracking-widest">WEBRES STUDIO</span>
        </div>
      </footer>
    </main>
  );
}