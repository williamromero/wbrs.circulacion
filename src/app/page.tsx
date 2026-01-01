import VehicleSearch from "@/components/vehicle-search";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col p-4 md:p-8 space-y-8 bg-grid-pattern">
      
      {/* Header */}
      <header className="pb-8" style={{ borderBottom: '4px solid rgb(var(--border-color))' }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 
              className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-2"
              style={{ color: 'rgb(var(--primary))' }}
            >
              WBRS
              <br />
              Circulación
            </h1>
            <div 
              className="inline-block px-3 py-1 text-sm font-bold uppercase tracking-widest transform -rotate-2"
              style={{ 
                background: 'rgb(var(--secondary))',
                color: 'rgb(var(--background))'
              }}
            >
              Edición 2026
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="font-bold text-lg" style={{ color: 'rgb(var(--foreground))' }}>
              CONSULTA DE VALORES
            </p>
            <p className="text-sm font-mono" style={{ color: 'rgb(var(--foreground-secondary))' }}>
              BASE DE DATOS OFICIAL
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1">
        <VehicleSearch />
      </section>

      {/* Footer */}
      <footer 
        className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold uppercase"
        style={{ borderTop: '4px solid rgb(var(--border-color))' }}
      >
        <p style={{ color: 'rgb(var(--foreground))' }}>© 2025 WEBRES STUDIO</p>
        <p 
          className="px-2 py-1"
          style={{ 
            background: 'rgb(var(--primary))',
            color: 'rgb(var(--background))'
          }}
        >
          Desarrollado con Next.js
        </p>
      </footer>
    </main>
  );
}