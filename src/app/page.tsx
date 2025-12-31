import VehicleSearch from "@/components/vehicle-search";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col p-4 md:p-8 space-y-8 bg-grid-pattern">
      
      {/* Header */}
      <header className="border-b-4 border-black pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-2">
              WBRS
              <br />
              Circulación
            </h1>
            <div className="inline-block bg-black text-white px-3 py-1 text-sm font-bold uppercase tracking-widest transform -rotate-2">
              Edición 2026
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="font-bold text-lg">CONSULTA DE VALORES</p>
            <p className="text-sm font-mono">BASE DE DATOS OFICIAL</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1">
        <VehicleSearch />
      </section>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold uppercase">
        <p>© 2025 WEBRES STUDIO</p>
        <p className="bg-black text-white px-2 py-1">Desarrollado con Next.js</p>
      </footer>
    </main>
  );
}