"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Papa from "papaparse";
import { Search, ArrowRight, ArrowLeft, Loader2, Database, X, Calendar, Car, Filter, Check, ChevronDown, Info } from "lucide-react";

// --- Types ---
type Vehicle = {
  MARCA: string;
  LINEA: string;
  TIPO_VEHICULO: string;
  CILINDRAJE: string;
  WATTS: string;
  KW: string;
  ESTILO: string;
  COMBUSTIBLE: string;
  PUERTAS: string;
  ASIENTOS: string;
  TONELAJE: string;
  EJES: string;
  CILINDROS: string;
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
        className={`brutal-input flex items-center justify-between cursor-pointer rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={!value ? "text-[rgb(var(--muted))]" : "font-medium"}>
          {value || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-[rgb(var(--muted))]" />
      </div>

      {isOpen && !disabled && (
        <div 
          className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto border border-[rgb(var(--border))] rounded-lg shadow-lg"
          style={{ background: 'rgb(var(--background))' }}
        >
          <div className="p-2 sticky top-0 bg-[rgb(var(--background))] border-b border-[rgb(var(--border))]">
            <input
              type="text"
              className="w-full p-2 border border-[rgb(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent text-sm"
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
                className="p-2.5 hover:bg-[rgb(var(--secondary))] cursor-pointer transition-colors text-sm"
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
      
      return true;
    });
  }, [data, selectedMarca, selectedLinea, selectedType]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  useEffect(() => {
    setPage(1);
  }, [selectedMarca, selectedLinea, selectedType]);

  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 
          className="w-12 h-12 animate-spin text-[rgb(var(--primary))]" 
        />
        <p className="font-medium text-lg text-[rgb(var(--muted))]">
          Cargando base de datos...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Advanced Search Section */}
      <div 
        className="p-6 md:p-8 rounded-2xl shadow-sm border border-[rgb(var(--border))]"
        style={{ background: 'rgb(var(--secondary))' }}
      >
        <h2 className="text-xl font-bold mb-6 uppercase tracking-widest flex items-center gap-2 text-[rgb(var(--foreground))]">
          <Filter className="w-5 h-5 text-[rgb(var(--primary))]" />
          Filtros de Búsqueda
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Marca Filter */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-[rgb(var(--foreground))]">Marca</label>
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
             <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-[rgb(var(--foreground))]">Línea</label>
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
             <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-[rgb(var(--foreground))]">Tipo</label>
             <SearchableSelect 
              options={uniqueTypes}
              value={selectedType}
              onChange={setSelectedType}
              placeholder="Todos los Tipos"
            />
          </div>
        </div>

        {/* Results Count and Clear Filters */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-[rgb(var(--border))]">
          <div className="flex items-center gap-2 text-sm font-mono text-[rgb(var(--muted))]">
            <Database className="w-4 h-4" />
            <span className="font-bold text-[rgb(var(--foreground))]">{filteredData.length}</span> RESULTADOS
          </div>
          {(selectedMarca || selectedLinea || selectedType) && (
            <button
              onClick={() => {
                setSelectedMarca("");
                setSelectedLinea("");
                setSelectedType("");
              }}
              className="px-4 py-2 rounded-lg text-xs font-bold uppercase bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Limpiar Todo
            </button>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-xl border border-[rgb(var(--border))] overflow-hidden bg-[rgb(var(--background))] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="uppercase text-xs tracking-wider border-b border-[rgb(var(--border))]"
                style={{ 
                  background: 'rgb(var(--secondary))',
                  color: 'rgb(var(--muted))'
                }}
              >
                <th className="p-4 hidden md:table-cell">Código</th>
                <th className="p-4">Marca / Línea / Tipo</th>
                <th className="p-4 hidden md:table-cell">Tipo</th>
                <th className="p-4 text-center hidden md:table-cell">C.C.</th>
                <th className="p-4 text-center hidden md:table-cell">Combustible</th>
                <th className="p-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono">
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedVehicle(row)}
                  className="cursor-pointer group hover:bg-[rgb(var(--secondary))] transition-colors border-b border-[rgb(var(--border))] last:border-0"
                >
                  <td className="p-4 font-bold text-[rgb(var(--muted))] hidden md:table-cell">{row.CODIGO}</td>
                  <td className="p-4">
                    <div className="font-bold text-[rgb(var(--foreground))]">{row.MARCA} {row.LINEA}</div>
                    <div className="text-xs opacity-70">{row.ESTILO}</div>
                    <div className="md:hidden text-xs opacity-70 mt-1 flex items-center gap-2">
                      <span className="bg-[rgb(var(--accent))] px-1.5 py-0.5 rounded text-[rgb(var(--foreground))]">{row.TIPO_VEHICULO}</span>
                      <span>•</span>
                      <span>{row.CILINDRAJE}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-[rgb(var(--muted))] hidden md:table-cell">{row.TIPO_VEHICULO}</td>
                  <td className="p-4 text-center font-bold text-[rgb(var(--foreground))] hidden md:table-cell">
                    {row.CILINDRAJE}
                  </td>
                   <td className="p-4 text-center text-xs text-[rgb(var(--muted))] hidden md:table-cell">
                    {row.COMBUSTIBLE}
                  </td>
                  <td className="p-4 text-center min-w-[140px]">
                    <button className="w-full bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] text-[10px] md:text-xs font-black uppercase py-2 px-4 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all">
                       <span className="md:hidden">IMPUESTO A PAGAR</span>
                       <span className="hidden md:inline">VER IMPUESTO</span>
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-lg font-bold uppercase text-[rgb(var(--muted))]">
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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-[rgb(var(--border))] hover:bg-[rgb(var(--secondary))] disabled:opacity-50 disabled:hover:bg-transparent transition-colors text-xs font-bold uppercase flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> ANTERIOR
          </button>
          <span className="font-bold font-mono text-center">
            PÁGINA {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-[rgb(var(--border))] hover:bg-[rgb(var(--secondary))] disabled:opacity-50 disabled:hover:bg-transparent transition-colors text-xs font-bold uppercase flex items-center gap-2"
          >
            SIGUIENTE <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal with 50% Discount Logic */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 bg-[rgb(var(--background))]"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex justify-between items-start p-6 border-b border-[rgb(var(--border))] bg-[rgb(var(--foreground))] text-[rgb(var(--background))]">
              <div>
                <div className="inline-block px-2 py-0.5 mb-2 text-xs font-bold uppercase bg-[rgb(var(--accent))] text-[rgb(var(--primary))] rounded-md">
                  {selectedVehicle.TIPO_VEHICULO}
                </div>
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight leading-none">
                  {selectedVehicle.MARCA} {selectedVehicle.LINEA}
                </h2>
                <p className="font-mono text-sm mt-1 opacity-80 uppercase">REF: {selectedVehicle.CODIGO}</p>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="bg-[rgb(var(--background))] text-[rgb(var(--foreground))] p-2 rounded-full hover:bg-[rgb(var(--accent))] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Discount Alert */}
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-4">
                 <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full shrink-0">
                    <Check className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-bold text-emerald-900 text-base mb-1 uppercase">¡50% de descuento aplicado!</h3>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                        Los valores mostrados a continuación ya incluyen la rebaja del 50% según el acuerdo vigente para 2026.
                    </p>
                 </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Tax Table */}
                  <div className="rounded-xl border border-[rgb(var(--border))] overflow-hidden">
                      <div className="bg-[rgb(var(--secondary))] p-4 border-b border-[rgb(var(--border))]">
                        <h3 className="font-black uppercase flex items-center gap-2 text-[rgb(var(--foreground))]">
                            <Calendar className="w-5 h-5 text-[rgb(var(--primary))]" />
                            Tabla de Impuestos (Con Descuento 50%)
                        </h3>
                      </div>
                      <div className="divide-y divide-[rgb(var(--border))] bg-[rgb(var(--background))]">
                          {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map((year) => {
                              const key = Object.keys(selectedVehicle).find(k => k.startsWith(`ISCV_${year}`)) || "";
                              const originalValue = selectedVehicle[key];
                              if (!originalValue) return null;
                              const discountedValue = calculateDiscountedValue(originalValue);
                              
                              return (
                                  <div key={year} className="flex justify-between items-center p-3 hover:bg-[rgb(var(--secondary))] transition-colors">
                                      <span className="font-bold text-xs md:text-sm text-[rgb(var(--muted))] uppercase">
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
                        <h3 className="font-black uppercase border-b-2 border-[rgb(var(--border))] mb-3 text-[rgb(var(--foreground))]">Especificaciones</h3>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <dt className="font-bold opacity-70 uppercase">Cilindraje:</dt> <dd className="text-right font-mono">{selectedVehicle.CILINDRAJE || "-"}</dd>
                            <dt className="font-bold opacity-70 uppercase">Estilo:</dt> <dd className="text-right font-mono">{selectedVehicle.ESTILO || "-"}</dd>
                            <dt className="font-bold opacity-70 uppercase">Combustible:</dt> <dd className="text-right font-mono">{selectedVehicle.COMBUSTIBLE || "-"}</dd>
                            <dt className="font-bold opacity-70 uppercase">Puertas:</dt> <dd className="text-right font-mono">{selectedVehicle.PUERTAS || "-"}</dd>
                            <dt className="font-bold opacity-70 uppercase">Asientos:</dt> <dd className="text-right font-mono">{selectedVehicle.ASIENTOS || "-"}</dd>
                            <dt className="font-bold opacity-70 uppercase">Código:</dt> <dd className="text-right font-mono">{selectedVehicle.CODIGO || "-"}</dd>
                        </dl>
                    </div>
                     <div>
                        <h3 className="font-black uppercase border-b-2 border-[rgb(var(--border))] mb-3 text-[rgb(var(--foreground))]">Valor Base</h3>
                        <div className="text-3xl font-black font-mono text-[rgb(var(--foreground))]">
                            {selectedVehicle.VALOR_VEHICULO}
                        </div>
                        <p className="text-xs opacity-60">Valor imponible original sin descuentos.</p>
                    </div>
                 </div>

              </div>
            </div>
            
            <div className="p-6 border-t border-[rgb(var(--border))] bg-[rgb(var(--secondary))/30] text-center rounded-b-2xl">
                 <button
                  onClick={() => setSelectedVehicle(null)}
                  className="w-full md:w-auto px-8 py-3 rounded-lg bg-[rgb(var(--foreground))] text-[rgb(var(--background))] font-black uppercase hover:bg-[rgb(var(--primary))] transition-colors shadow-lg"
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