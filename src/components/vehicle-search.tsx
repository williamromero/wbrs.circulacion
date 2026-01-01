"use client";

import { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import { Search, ArrowRight, ArrowLeft, Loader2, Database, X, Calendar, Car } from "lucide-react";

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

export default function VehicleSearch() {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedLinea, setSelectedLinea] = useState("");
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

  // Get unique brands and lines for filters
  const uniqueMarcas = useMemo(() => {
    const marcas = Array.from(new Set(data.map((v) => v.MARCA))).sort();
    return marcas;
  }, [data]);

  const uniqueLineas = useMemo(() => {
    const lineas = selectedMarca
      ? Array.from(new Set(data.filter((v) => v.MARCA === selectedMarca).map((v) => v.LINEA))).sort()
      : Array.from(new Set(data.map((v) => v.LINEA))).sort();
    return lineas;
  }, [data, selectedMarca]);

  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply marca filter
    if (selectedMarca) {
      filtered = filtered.filter((row) => row.MARCA === selectedMarca);
    }

    // Apply linea filter
    if (selectedLinea) {
      filtered = filtered.filter((row) => row.LINEA === selectedLinea);
    }

    // Apply search term filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(lowerTerm)
        )
      );
    }

    return filtered;
  }, [data, searchTerm, selectedMarca, selectedLinea]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
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
            border: '4px solid rgb(var(--border-color))',
            color: 'rgb(var(--primary))'
          }}
        />
        <p 
          className="font-mono text-xl font-bold uppercase tracking-widest"
          style={{ color: 'rgb(var(--foreground))' }}
        >
          Cargando Datos...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Advanced Search Section */}
      <div 
        className="p-6 brutal-shadow brutal-border"
        style={{ 
          background: 'rgb(var(--primary))',
          color: 'rgb(var(--background))'
        }}
      >
        <h2 className="text-xl font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
          <Search className="w-5 h-5" />
          Búsqueda Avanzada
        </h2>
        
        {/* Search Input */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 uppercase tracking-widest">
            Búsqueda General
          </label>
          <div className="relative">
            <input
              type="text"
              className="brutal-input"
              placeholder="EJ: TOYOTA HILUX..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
            <Search 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6"
              style={{ color: 'rgb(var(--foreground))' }}
            />
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Marca Filter */}
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-widest flex items-center gap-2">
              <Car className="w-4 h-4" />
              Marca
            </label>
            <select
              className="brutal-input"
              value={selectedMarca}
              onChange={(e) => {
                setSelectedMarca(e.target.value);
                setSelectedLinea(""); // Reset linea when marca changes
                setPage(1);
              }}
            >
              <option value="">Todas las marcas</option>
              {uniqueMarcas.map((marca) => (
                <option key={marca} value={marca}>
                  {marca}
                </option>
              ))}
            </select>
          </div>

          {/* Linea Filter */}
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-widest">
              Modelo / Línea
            </label>
            <select
              className="brutal-input"
              value={selectedLinea}
              onChange={(e) => {
                setSelectedLinea(e.target.value);
                setPage(1);
              }}
              disabled={!selectedMarca}
            >
              <option value="">Todos los modelos</option>
              {uniqueLineas.map((linea) => (
                <option key={linea} value={linea}>
                  {linea}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count and Clear Filters */}
        <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-mono">
            <Database className="w-4 h-4" />
            <span>{filteredData.length} RESULTADOS ENCONTRADOS</span>
          </div>
          {(selectedMarca || selectedLinea || searchTerm) && (
            <button
              onClick={() => {
                setSelectedMarca("");
                setSelectedLinea("");
                setSearchTerm("");
                setPage(1);
              }}
              className="brutal-btn flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div 
        className="overflow-x-auto brutal-shadow brutal-border"
        style={{ background: 'rgb(var(--surface-elevated))' }}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr 
              className="uppercase text-xs md:text-sm tracking-wider"
              style={{ 
                background: 'rgb(var(--secondary))',
                color: 'rgb(var(--background))'
              }}
            >
              <th className="p-3 md:p-4 sticky left-0 z-10" style={{ borderBottom: '2px solid rgb(var(--border-color))', borderRight: '2px solid rgb(var(--border-color))', background: 'rgb(var(--secondary))' }}>Marca / Línea</th>
              <th className="p-3 md:p-4 text-center" style={{ borderBottom: '2px solid rgb(var(--border-color))', borderRight: '2px solid rgb(var(--border-color))' }}>2026</th>
              <th className="p-3 md:p-4 text-center" style={{ borderBottom: '2px solid rgb(var(--border-color))', borderRight: '2px solid rgb(var(--border-color))' }}>2025</th>
              <th className="p-3 md:p-4 text-center" style={{ borderBottom: '2px solid rgb(var(--border-color))', borderRight: '2px solid rgb(var(--border-color))' }}>2024</th>
              <th className="p-3 md:p-4 text-center" style={{ borderBottom: '2px solid rgb(var(--border-color))', borderRight: '2px solid rgb(var(--border-color))' }}>2023</th>
              <th className="p-3 md:p-4 text-center" style={{ borderBottom: '2px solid rgb(var(--border-color))', borderRight: '2px solid rgb(var(--border-color))' }}>2022</th>
              <th className="p-3 md:p-4 text-center" style={{ borderBottom: '2px solid rgb(var(--border-color))', borderRight: '2px solid rgb(var(--border-color))' }}>2021</th>
              <th className="p-3 md:p-4 text-center" style={{ borderBottom: '2px solid rgb(var(--border-color))', borderRight: '2px solid rgb(var(--border-color))' }}>2020</th>
              <th className="p-3 md:p-4 text-center" style={{ borderBottom: '2px solid rgb(var(--border-color))' }}>Más Atrás</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs md:text-sm">
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                onClick={() => setSelectedVehicle(row)}
                className="border-b-2 transition-colors cursor-pointer"
                style={{ 
                  borderBottom: '2px solid rgb(var(--border-color))',
                  color: 'rgb(var(--foreground))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgb(var(--accent))';
                  e.currentTarget.style.color = 'rgb(var(--background))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgb(var(--foreground))';
                }}
              >
                <td className="p-3 md:p-4 sticky left-0" style={{ borderRight: '2px solid rgb(var(--border-color))', background: 'inherit' }}>
                  <div className="font-bold">{row.MARCA}</div>
                  <div className="text-xs opacity-60">{row.LINEA}</div>
                  <div className="text-xs mt-1 opacity-60">{row.CODIGO}</div>
                </td>
                <td className="p-3 md:p-4 text-center font-bold" style={{ borderRight: '2px solid rgb(var(--border-color))', background: 'rgb(var(--accent))', color: 'rgb(var(--background))' }}>
                  {row["ISCV_2026_2%"]}
                </td>
                <td className="p-3 md:p-4 text-center" style={{ borderRight: '2px solid rgb(var(--border-color))' }}>
                  {row["ISCV_2025_1.8%"]}
                </td>
                <td className="p-3 md:p-4 text-center" style={{ borderRight: '2px solid rgb(var(--border-color))', background: 'rgb(var(--accent))', color: 'rgb(var(--background))' }}>
                  {row["ISCV_2024_1.6%"]}
                </td>
                <td className="p-3 md:p-4 text-center" style={{ borderRight: '2px solid rgb(var(--border-color))' }}>
                  {row["ISCV_2023_1.4%"]}
                </td>
                <td className="p-3 md:p-4 text-center" style={{ borderRight: '2px solid rgb(var(--border-color))', background: 'rgb(var(--accent))', color: 'rgb(var(--background))' }}>
                  {row["ISCV_2022_1.2%"]}
                </td>
                <td className="p-3 md:p-4 text-center" style={{ borderRight: '2px solid rgb(var(--border-color))' }}>
                  {row["ISCV_2021_1.0%"]}
                </td>
                <td className="p-3 md:p-4 text-center" style={{ borderRight: '2px solid rgb(var(--border-color))', background: 'rgb(var(--accent))', color: 'rgb(var(--background))' }}>
                  {row["ISCV_2020_0.8%"]}
                </td>
                <td className="p-3 md:p-4 text-center">
                  <div className="text-xs">2019-2017</div>
                  <div className="text-xs opacity-60">Ver detalles →</div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={9} className="p-12 text-center text-xl font-bold uppercase">
                    No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div 
          className="flex justify-between items-center p-4 brutal-shadow brutal-border"
          style={{ background: 'rgb(var(--surface-elevated))' }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="brutal-btn flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> ANTERIOR
          </button>
          <span className="font-bold font-mono" style={{ color: 'rgb(var(--foreground))' }}>
            PÁGINA {page} DE {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="brutal-btn flex items-center gap-2"
          >
            SIGUIENTE <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <div 
            className="brutal-shadow max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            style={{ 
              background: 'rgb(var(--surface-elevated))',
              border: '4px solid rgb(var(--border-color))'
            }}
          >
            {/* Modal Header */}
            <div 
              className="p-6 flex justify-between items-start sticky top-0 z-10"
              style={{ 
                background: 'rgb(var(--secondary))',
                color: 'rgb(var(--background))',
                borderBottom: '4px solid rgb(var(--border-color))'
              }}
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                  {selectedVehicle.MARCA}
                </h2>
                <p className="text-lg mt-1">{selectedVehicle.LINEA}</p>
                <p className="text-sm font-mono mt-2 opacity-75">
                  Código: {selectedVehicle.CODIGO}
                </p>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="brutal-btn p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Vehicle Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="brutal-border p-4" style={{ background: 'rgb(var(--surface))' }}>
                  <h3 
                    className="font-bold uppercase text-sm mb-3 pb-2"
                    style={{ 
                      borderBottom: '2px solid rgb(var(--border-color))',
                      color: 'rgb(var(--foreground))'
                    }}
                  >
                    Información General
                  </h3>
                  <div className="space-y-2 text-sm font-mono" style={{ color: 'rgb(var(--foreground))' }}>
                    <div className="flex justify-between">
                      <span className="font-bold">Tipo:</span>
                      <span>{selectedVehicle.TIPO_VEHICULO}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Carrocería:</span>
                      <span>{selectedVehicle.CARROCERIA || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Combustible:</span>
                      <span>{selectedVehicle.COMBUSTIBLE || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Transmisión:</span>
                      <span>{selectedVehicle.TRANSMISION || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="brutal-border p-4" style={{ background: 'rgb(var(--surface))' }}>
                  <h3 
                    className="font-bold uppercase text-sm mb-3 pb-2"
                    style={{ 
                      borderBottom: '2px solid rgb(var(--border-color))',
                      color: 'rgb(var(--foreground))'
                    }}
                  >
                    Especificaciones Técnicas
                  </h3>
                  <div className="space-y-2 text-sm font-mono" style={{ color: 'rgb(var(--foreground))' }}>
                    <div className="flex justify-between">
                      <span className="font-bold">Cilindraje:</span>
                      <span>{selectedVehicle.CILINDRAJE || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Potencia:</span>
                      <span>{selectedVehicle.POTENCIA || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Tonelaje:</span>
                      <span>{selectedVehicle.TONELAJE || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Tracción:</span>
                      <span>{selectedVehicle.TRACCION || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value */}
              <div 
                className="brutal-border p-4"
                style={{ 
                  background: 'rgb(var(--accent))',
                  color: 'rgb(var(--background))'
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold uppercase text-lg">Valor del Vehículo:</span>
                  <span className="text-2xl font-black">{selectedVehicle.VALOR_VEHICULO}</span>
                </div>
              </div>

              {/* Payment Information by Year */}
              <div className="brutal-border">
                <div 
                  className="p-4"
                  style={{ 
                    background: 'rgb(var(--primary))',
                    color: 'rgb(var(--background))',
                    borderBottom: '2px solid rgb(var(--border-color))'
                  }}
                >
                  <h3 className="font-bold uppercase text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Impuesto de Circulación por Año (ISCV)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr style={{ background: 'rgb(var(--surface))' }}>
                        <th 
                          className="p-3 text-left font-bold uppercase text-sm"
                          style={{ 
                            borderBottom: '2px solid rgb(var(--border-color))',
                            color: 'rgb(var(--foreground))'
                          }}
                        >
                          Año
                        </th>
                        <th 
                          className="p-3 text-left font-bold uppercase text-sm"
                          style={{ 
                            borderBottom: '2px solid rgb(var(--border-color))',
                            color: 'rgb(var(--foreground))'
                          }}
                        >
                          Tasa
                        </th>
                        <th 
                          className="p-3 text-right font-bold uppercase text-sm"
                          style={{ 
                            borderBottom: '2px solid rgb(var(--border-color))',
                            color: 'rgb(var(--foreground))'
                          }}
                        >
                          Monto a Pagar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-mono" style={{ color: 'rgb(var(--foreground))' }}>
                      <tr 
                        className="transition-colors"
                        style={{ borderBottom: '1px solid rgb(var(--grid-color))' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgb(var(--accent))'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="p-3 font-bold">2026</td>
                        <td className="p-3">2%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2026_2%"]}</td>
                      </tr>
                      <tr 
                        className="transition-colors"
                        style={{ borderBottom: '1px solid rgb(var(--grid-color))' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgb(var(--accent))'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="p-3 font-bold">2025</td>
                        <td className="p-3">1.8%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2025_1.8%"]}</td>
                      </tr>
                      <tr 
                        className="transition-colors"
                        style={{ borderBottom: '1px solid rgb(var(--grid-color))' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgb(var(--accent))'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="p-3 font-bold">2024</td>
                        <td className="p-3">1.6%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2024_1.6%"]}</td>
                      </tr>
                      <tr 
                        className="transition-colors"
                        style={{ borderBottom: '1px solid rgb(var(--grid-color))' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgb(var(--accent))'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="p-3 font-bold">2023</td>
                        <td className="p-3">1.4%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2023_1.4%"]}</td>
                      </tr>
                      <tr 
                        className="transition-colors"
                        style={{ borderBottom: '1px solid rgb(var(--grid-color))' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgb(var(--accent))'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="p-3 font-bold">2022</td>
                        <td className="p-3">1.2%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2022_1.2%"]}</td>
                      </tr>
                      <tr 
                        className="transition-colors"
                        style={{ borderBottom: '1px solid rgb(var(--grid-color))' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgb(var(--accent))'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="p-3 font-bold">2021</td>
                        <td className="p-3">1.0%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2021_1.0%"]}</td>
                      </tr>
                      <tr 
                        className="transition-colors"
                        style={{ borderBottom: '1px solid rgb(var(--grid-color))' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgb(var(--accent))'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="p-3 font-bold">2020</td>
                        <td className="p-3">0.8%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2020_0.8%"]}</td>
                      </tr>
                      <tr 
                        className="transition-colors"
                        style={{ borderBottom: '1px solid rgb(var(--grid-color))' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgb(var(--accent))'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="p-3 font-bold">2019</td>
                        <td className="p-3">0.6%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2019_0.6%"]}</td>
                      </tr>
                      <tr 
                        className="transition-colors"
                        style={{ borderBottom: '1px solid rgb(var(--grid-color))' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgb(var(--accent))'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="p-3 font-bold">2018</td>
                        <td className="p-3">0.4%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2018_0.4%"]}</td>
                      </tr>
                      <tr 
                        className="transition-colors"
                        style={{ borderBottom: '1px solid rgb(var(--grid-color))' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgb(var(--accent))'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="p-3 font-bold">2017</td>
                        <td className="p-3">0.2%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2017_0.2%"]}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="brutal-btn flex items-center gap-2 px-6 py-3 text-lg"
                >
                  <X className="w-5 h-5" />
                  CERRAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
