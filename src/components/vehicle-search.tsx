"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Papa from "papaparse";
import { Search, ArrowRight, ArrowLeft, Loader2, Database, X, Calendar, Car, Filter, Check, ChevronDown } from "lucide-react";

// --- Types ---
type Vehicle = {
  MARCA: string;
  LINEA: string;
  TIPO_VEHICULO: string;
  CILINDRAJE: string;
  POTENCIA: string;
  TONELAJE: string;
  CARROCERIA: string;
  COMBUSTIBLE: string;
  TRANSMISION: string;
  EJES: string;
  TRACCION: string;
  PUERTAS: string;
  PASAJEROS: string;
  CODIGO: string;
  VALOR_VEHICULO: string;
  "ISCV_2026_2%": string;
  "ISCV_2025_1.8%": string;
  "ISCV_2024_1.6%": string;
  "ISCV_2023_1.4%": string;
  "ISCV_2022_1.2%": string;
  "ISCV_2021_1.0%": string;
  "ISCV_2020_0.8%": string;
  "ISCV_2019_0.6%": string;
  "ISCV_2018_0.4%": string;
  "ISCV_2017_0.2%": string;
  [key: string]: string;
};

// --- Helper Functions ---
const parseCurrency = (val: string): number => {
  if (!val) return 0;
  return parseFloat(val.replace(/[Q,\s]/g, ""));
};

const formatCurrency = (val: number): string => {
  return "Q " + val.toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const calculateDiscountedValue = (val: string): string => {
  const num = parseCurrency(val);
  return formatCurrency(num / 2);
};

// --- Components ---

// Searchable Select Component
function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  placeholder,
  disabled = false
}: { 
  options: string[], 
  value: string, 
  onChange: (val: string) => void, 
  placeholder: string,
  disabled?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!filter) return options;
    return options.filter(opt => opt.toLowerCase().includes(filter.toLowerCase()));
  }, [options, filter]);

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        className={`brutal-input flex items-center justify-between cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={!value ? "text-[rgb(var(--muted))]" : ""}>
          {value || placeholder}
        </span>
        <ChevronDown className="w-4 h-4" />
      </div>

      {isOpen && !disabled && (
        <div 
          className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto brutal-border brutal-shadow"
          style={{ background: 'rgb(var(--background))' }}
        >
          <div className="p-2 sticky top-0 bg-[rgb(var(--background))] border-b-2 border-[rgb(var(--border))]">
            <input
              type="text"
              className="w-full p-2 border-2 border-[rgb(var(--border))] focus:outline-none text-sm"
              placeholder="Filtrar..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              autoFocus
            />
          </div>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt}
                className="p-2 hover:bg-[rgb(var(--accent))] hover:text-[rgb(var(--primary))] cursor-pointer transition-colors text-sm"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                  setFilter("");
                }}
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-[rgb(var(--muted))]">No hay resultados</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function VehicleSearch() {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedLinea, setSelectedLinea] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetch("/data.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse<Vehicle>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data);
            setLoading(false);
          },
        });
      });
  }, []);

  // Get unique lists for filters
  const uniqueMarcas = useMemo(() => Array.from(new Set(data.map(v => v.MARCA))).sort(), [data]);
  
  const uniqueTypes = useMemo(() => {
      let filtered = data;
      if (selectedMarca) filtered = filtered.filter(v => v.MARCA === selectedMarca);
      return Array.from(new Set(filtered.map(v => v.TIPO_VEHICULO))).sort();
  }, [data, selectedMarca]);
  
  const uniqueLineas = useMemo(() => {
    let filtered = data;
    if (selectedMarca) filtered = filtered.filter(v => v.MARCA === selectedMarca);
    return Array.from(new Set(filtered.map(v => v.LINEA))).sort();
  }, [data, selectedMarca]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // 1. Marca Filter
      if (selectedMarca && row.MARCA !== selectedMarca) return false;
      // 2. Linea Filter
      if (selectedLinea && row.LINEA !== selectedLinea) return false;
      // 3. Type Filter
      if (selectedType && row.TIPO_VEHICULO !== selectedType) return false;
      
      // 4. General Search (checks ALL values)
      if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        // Concatenate relevant fields for faster search instead of Object.values
        const searchableText = `${row.MARCA} ${row.LINEA} ${row.CODIGO} ${row.TIPO_VEHICULO}`.toLowerCase();
        return searchableText.includes(lowerTerm);
      }
      
      return true;
    });
  }, [data, searchTerm, selectedMarca, selectedLinea, selectedType]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedMarca, selectedLinea, selectedType]);

  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 
          className="w-12 h-12 animate-spin p-1 rounded-full" 
          style={{ 
            border: '4px solid rgb(var(--border))',
            color: 'rgb(var(--foreground))'
          }}
        />
        <p className="font-mono text-xl font-bold uppercase tracking-widest">
          Cargando Datos...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Advanced Search Section */}
      <div 
        className="p-4 md:p-6 brutal-shadow brutal-border transition-colors duration-300"
        style={{ background: 'rgb(var(--secondary))' }}
      >
        <h2 className="text-xl font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros de Búsqueda
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* General Search */}
          <div className="lg:col-span-4">
             <label className="block text-xs font-bold mb-2 uppercase tracking-widest">
                Búsqueda Rápida (Código, Marca, Línea)
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="brutal-input pr-10"
                  placeholder="EJ: P0123ABC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
              </div>
          </div>

          {/* Marca Filter */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold mb-2 uppercase tracking-widest">Marca</label>
            <SearchableSelect 
              options={uniqueMarcas}
              value={selectedMarca}
              onChange={(val) => {
                setSelectedMarca(val);
                setSelectedLinea("");
              }}
              placeholder="Todas las Marcas"
            />
          </div>

          {/* Linea Filter */}
          <div className="lg:col-span-1">
             <label className="block text-xs font-bold mb-2 uppercase tracking-widest">Línea</label>
             <SearchableSelect 
              options={uniqueLineas}
              value={selectedLinea}
              onChange={setSelectedLinea}
              placeholder="Todas las Líneas"
              disabled={!selectedMarca && uniqueLineas.length > 100} // Opt optimization
            />
          </div>

           {/* Type Filter */}
           <div className="lg:col-span-1">
             <label className="block text-xs font-bold mb-2 uppercase tracking-widest">Tipo</label>
             <SearchableSelect 
              options={uniqueTypes}
              value={selectedType}
              onChange={setSelectedType}
              placeholder="Todos los Tipos"
            />
          </div>
        </div>

        {/* Results Count and Clear Filters */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t-2 border-[rgb(var(--border))]">
          <div className="flex items-center gap-2 text-sm font-mono">
            <Database className="w-4 h-4" />
            <span className="font-bold">{filteredData.length}</span> RESULTADOS
          </div>
          {(selectedMarca || selectedLinea || selectedType || searchTerm) && (
            <button
              onClick={() => {
                setSelectedMarca("");
                setSelectedLinea("");
                setSelectedType("");
                setSearchTerm("");
              }}
              className="brutal-btn w-full sm:w-auto text-xs"
            >
              <X className="w-4 h-4" />
              Limpiar Todo
            </button>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="brutal-shadow brutal-border overflow-hidden bg-[rgb(var(--background))]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr 
                className="uppercase text-xs tracking-wider"
                style={{ 
                  background: 'rgb(var(--foreground))',
                  color: 'rgb(var(--background))'
                }}
              >
                <th className="p-3 border-r border-[rgb(var(--background))] hidden md:table-cell">Código</th>
                <th className="p-3 border-r border-[rgb(var(--background))]">Marca / Línea</th>
                <th className="p-3 border-r border-[rgb(var(--background))]">Tipo</th>
                <th className="p-3 border-r border-[rgb(var(--background))] text-center hidden md:table-cell">C.C.</th>
                <th className="p-3 border-r border-[rgb(var(--background))] text-center hidden md:table-cell">Combustible</th>
                <th className="p-3 text-center bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]">Acción</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedVehicle(row)}
                  className="cursor-pointer group hover:bg-[rgb(var(--accent))] hover:text-[rgb(var(--primary))] transition-colors border-b border-[rgb(var(--border))]"
                >
                  <td className="p-3 font-bold border-r border-[rgb(var(--border))] hidden md:table-cell">{row.CODIGO}</td>
                  <td className="p-3 border-r border-[rgb(var(--border))]">
                    <div className="font-bold">{row.MARCA}</div>
                    <div className="text-xs opacity-70">{row.LINEA}</div>
                  </td>
                  <td className="p-3 border-r border-[rgb(var(--border))] text-xs">{row.TIPO_VEHICULO}</td>
                  <td className="p-3 text-center font-bold border-r border-[rgb(var(--border))] hidden md:table-cell">
                    {row.CILINDRAJE}
                  </td>
                   <td className="p-3 text-center opacity-70 border-r border-[rgb(var(--border))] hidden md:table-cell text-xs">
                    {row.COMBUSTIBLE}
                  </td>
                  <td className="p-3 text-center min-w-[120px]">
                    <button className="brutal-btn w-full bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] text-[10px] md:text-xs py-2 shadow-none group-hover:bg-white group-hover:text-black font-black">
                       <span className="md:hidden">IMPUESTO A PAGAR</span>
                       <span className="hidden md:inline">VER IMPUESTO</span>
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-lg font-bold uppercase">
                      No se encontraron resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 brutal-shadow brutal-border bg-[rgb(var(--secondary))]">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="brutal-btn disabled:opacity-50 disabled:shadow-none w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" /> ANTERIOR
          </button>
          <span className="font-bold font-mono text-center">
            PÁGINA {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="brutal-btn disabled:opacity-50 disabled:shadow-none w-full sm:w-auto"
          >
            SIGUIENTE <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal with 50% Discount Logic */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto brutal-border shadow-2xl animate-in zoom-in-95 duration-200"
            style={{ background: 'rgb(var(--background))' }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex justify-between items-start p-4 md:p-6 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] border-b-4 border-[rgb(var(--border))]">
              <div>
                <div className="inline-block px-2 py-0.5 mb-2 text-xs font-bold uppercase bg-[rgb(var(--accent))] text-[rgb(var(--primary))] border border-[rgb(var(--background))]">
                  {selectedVehicle.TIPO_VEHICULO}
                </div>
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight leading-none">
                  {selectedVehicle.MARCA} {selectedVehicle.LINEA}
                </h2>
                <p className="font-mono text-sm mt-1 opacity-80">REF: {selectedVehicle.CODIGO}</p>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="bg-[rgb(var(--background))] text-[rgb(var(--foreground))] p-2 hover:bg-[rgb(var(--accent))] transition-colors border-2 border-transparent hover:border-[rgb(var(--background))]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 md:p-8 space-y-8">
              {/* Discount Alert */}
              <div className="bg-yellow-400 p-4 border-2 border-black flex items-start gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                 <div className="bg-black text-white p-1 rounded-full shrink-0">
                    <Check className="w-4 h-4" />
                 </div>
                 <div>
                    <h3 className="font-black uppercase text-black text-lg">¡50% DE DESCUENTO APLICADO!</h3>
                    <p className="text-sm font-bold text-black/80">
                        Los valores mostrados a continuación ya incluyen la rebaja del 50% según el acuerdo vigente para 2026.
                    </p>
                 </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Tax Table */}
                  <div className="brutal-border p-4 bg-[rgb(var(--secondary))]">
                      <h3 className="font-black uppercase mb-4 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Tabla de Impuestos (Con Descuento 50%)
                      </h3>
                      <div className="space-y-1 pr-2">
                          {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map((year) => {
                              const key = Object.keys(selectedVehicle).find(k => k.startsWith(`ISCV_${year}`)) || "";
                              const originalValue = selectedVehicle[key];
                              if (!originalValue) return null;
                              const discountedValue = calculateDiscountedValue(originalValue);
                              
                              return (
                                  <div key={year} className="flex justify-between items-center p-2 bg-[rgb(var(--background))] border border-[rgb(var(--border))] hover:border-[rgb(var(--primary))] transition-colors">
                                      <span className="font-bold text-xs md:text-sm">
                                          Año {year} {year === 2017 ? "y anteriores" : ""}
                                      </span>
                                      <div className="text-right">
                                          <div className="font-black text-sm md:text-lg text-[rgb(var(--primary))]">{discountedValue}</div>
                                          <div className="text-[10px] line-through opacity-50">{originalValue}</div>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>

                 {/* Specs */}
                 <div className="space-y-6">
                    <div>
                        <h3 className="font-black uppercase border-b-2 border-[rgb(var(--border))] mb-3">Especificaciones</h3>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <dt className="font-bold opacity-70">Cilindraje:</dt> <dd className="text-right font-mono">{selectedVehicle.CILINDRAJE || "-"}</dd>
                            <dt className="font-bold opacity-70">Combustible:</dt> <dd className="text-right font-mono">{selectedVehicle.COMBUSTIBLE || "-"}</dd>
                            <dt className="font-bold opacity-70">Puertas:</dt> <dd className="text-right font-mono">{selectedVehicle.PUERTAS || "-"}</dd>
                            <dt className="font-bold opacity-70">Pasajeros:</dt> <dd className="text-right font-mono">{selectedVehicle.PASAJEROS || "-"}</dd>
                        </dl>
                    </div>
                     <div>
                        <h3 className="font-black uppercase border-b-2 border-[rgb(var(--border))] mb-3">Valor Base</h3>
                        <div className="text-3xl font-black font-mono">
                            {selectedVehicle.VALOR_VEHICULO}
                        </div>
                        <p className="text-xs opacity-60">Valor imponible original sin descuentos.</p>
                    </div>
                 </div>

              </div>
            </div>
            
            <div className="p-4 bg-[rgb(var(--secondary))] border-t-2 border-[rgb(var(--border))] text-center">
                 <button
                  onClick={() => setSelectedVehicle(null)}
                  className="brutal-btn w-full md:w-auto px-8 py-3 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] hover:bg-[rgb(var(--accent))] hover:text-[rgb(var(--primary))]"
                >
                  CERRAR VENTANA
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}