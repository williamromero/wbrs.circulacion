import VehicleSearch from "@/components/vehicle-search";
import ThemeToggle from "@/components/theme-toggle";
import { ExternalLink, Heart } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col min-h-screen p-4 md:p-8 space-y-8 bg-grid-pattern transition-colors duration-300">
      
      {/* Header */}
      <header className="border-b border-[rgb(var(--border))] pb-6 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-start w-full">
               <div className="relative z-10">
                 <h3 className="text-sm font-medium text-[rgb(var(--muted))] mb-1">Consulta de</h3>
                 <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none mb-2 text-[rgb(var(--foreground))]">
                  Impuesto de Circulación
                </h1>
                
                {/* Logo Section */}
                <div className="absolute -right-4 sm:-right-20 bottom-1 flex flex-row items-center -z-10 opacity-80">
                   <a 
                     href="https://www.webres-studio.com" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex flex-col items-center group transition-transform hover:scale-105"
                   >
                     <Image 
                       src="/wbrs.svg" 
                       alt="WBRS Logo" 
                       width={48} 
                       height={48} 
                     />
                   </a>
                </div>

               </div>
              <div className="md:hidden">
                 <ThemeToggle />
              </div>
            </div>
           
            <div className="flex items-center gap-4 mt-4">
                <div className="inline-block bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm">
                  Edición 2026
                </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <div className="text-right hidden md:block text-[rgb(var(--foreground))]">
              <p className="font-semibold text-lg">Consulta Oficial</p>
              <div className="flex items-center justify-end gap-1.5 text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--primary))] transition-colors">
                <span>Fuente SAT</span>
                <a 
                  href="https://portal.sat.gob.gt/portal/tablas-y-acuerdos-vehiculos/" 
                  target="_blank" 
                  rel="noopener noreferrer"
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
      <footer className="mt-12 pt-8 border-t border-[rgb(var(--border))] flex flex-col md:flex-row justify-center items-center gap-2 text-sm text-[rgb(var(--muted))]">
        <div className="flex items-center gap-2">
           <span>Hecho con</span>
           <Heart className="w-4 h-4 text-red-500 fill-red-500" />
           <span>por</span>
           <span className="font-semibold text-[rgb(var(--foreground))]">Webres Studio</span>
        </div>
      </footer>
    </main>
  );
}