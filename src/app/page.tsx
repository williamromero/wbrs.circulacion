import VehicleSearch from "@/components/vehicle-search";
import ThemeToggle from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col min-h-screen p-4 md:p-8 space-y-8 bg-grid-pattern transition-colors duration-300">
      
      {/* Header */}
      <header className="border-b-4 border-[rgb(var(--foreground))] pb-6 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex-1">
            <div className="flex flex-col justify-between items-start w-full">
              <h2 className="text-2xl md:text-xl md:text-base font-mono text-right text-[rgb(var(--foreground))] opacity-80">
                BUSCADOR DE IMPUESTO
              </h2>
               <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-2 break-words text-[rgb(var(--foreground))]">
                CIRCULACIÓN
              </h1>
              <div className="md:hidden">
                 <ThemeToggle />
              </div>
            </div>
           
            <div className="inline-block bg-[rgb(var(--foreground))] text-[rgb(var(--background))] px-3 py-1 text-sm font-bold uppercase tracking-widest transform -rotate-2 shadow-lg">
              Edición 2026
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <div className="text-right hidden md:block text-[rgb(var(--foreground))]">
              <p className="font-bold text-lg">CONSULTA DE VALORES</p>
              <p className="text-sm font-mono opacity-80">BASE DE DATOS OFICIAL</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 w-full max-w-7xl mx-auto">
        <VehicleSearch />
      </section>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t-4 border-[rgb(var(--foreground))] flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold uppercase text-[rgb(var(--foreground))]">
        <p>© 2025 WEBRES STUDIO</p>
        <div className="flex items-center gap-2">
           <span>Hecho con</span>
           <span className="bg-[rgb(var(--foreground))] text-[rgb(var(--background))] px-2 py-1">Next.js 15</span>
        </div>
      </footer>
    </main>
  );
}
