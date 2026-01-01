"use client";

import { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import { Search, ArrowRight, ArrowLeft, Loader2, Database, X, Calendar, Car } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [selectedYear, setSelectedYear] = useState("");
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

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedMarca, selectedLinea]);

  // Reset linea when marca changes
  useEffect(() => {
    setSelectedLinea("");
  }, [selectedMarca]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin border-4 border-black p-1 rounded-full" />
        <p className="font-mono text-xl font-bold uppercase tracking-widest">Cargando Datos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Advanced Search Section */}
      <div className="bg-black text-white p-6 brutal-shadow border-2 border-black">
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
              className="w-full bg-white text-black border-2 border-white p-4 pr-12 font-mono text-lg focus:outline-none focus:ring-4 focus:ring-gray-500 placeholder:text-gray-400"
              placeholder="EJ: TOYOTA HILUX..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-black w-6 h-6" />
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
              className="w-full bg-white text-black border-2 border-white p-4 font-mono text-lg focus:outline-none focus:ring-4 focus:ring-gray-500"
              value={selectedMarca}
              onChange={(e) => setSelectedMarca(e.target.value)}
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
              className="w-full bg-white text-black border-2 border-white p-4 font-mono text-lg focus:outline-none focus:ring-4 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              value={selectedLinea}
              onChange={(e) => setSelectedLinea(e.target.value)}
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
              }}
              className="bg-white text-black border-2 border-white px-4 py-2 font-bold uppercase text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto border-2 border-black brutal-shadow bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white uppercase text-xs md:text-sm tracking-wider">
              <th className="p-3 md:p-4 border-b-2 border-black border-r-2 sticky left-0 bg-black z-10">Marca / Línea</th>
              <th className="p-3 md:p-4 border-b-2 border-black border-r-2 text-center">2026</th>
              <th className="p-3 md:p-4 border-b-2 border-black border-r-2 text-center">2025</th>
              <th className="p-3 md:p-4 border-b-2 border-black border-r-2 text-center">2024</th>
              <th className="p-3 md:p-4 border-b-2 border-black border-r-2 text-center">2023</th>
              <th className="p-3 md:p-4 border-b-2 border-black border-r-2 text-center">2022</th>
              <th className="p-3 md:p-4 border-b-2 border-black border-r-2 text-center">2021</th>
              <th className="p-3 md:p-4 border-b-2 border-black border-r-2 text-center">2020</th>
              <th className="p-3 md:p-4 border-b-2 border-black text-center">Más Atrás</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs md:text-sm">
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                onClick={() => setSelectedVehicle(row)}
                className="hover:bg-yellow-100 border-b-2 border-black transition-colors cursor-pointer"
              >
                <td className="p-3 md:p-4 border-r-2 border-black sticky left-0 bg-white hover:bg-yellow-100">
                  <div className="font-bold">{row.MARCA}</div>
                  <div className="text-xs text-gray-600">{row.LINEA}</div>
                  <div className="text-xs text-gray-500 mt-1">{row.CODIGO}</div>
                </td>
                <td className="p-3 md:p-4 border-r-2 border-black text-center font-bold bg-gray-50">
                  {row["ISCV_2026_2%"]}
                </td>
                <td className="p-3 md:p-4 border-r-2 border-black text-center">
                  {row["ISCV_2025_1.8%"]}
                </td>
                <td className="p-3 md:p-4 border-r-2 border-black text-center bg-gray-50">
                  {row["ISCV_2024_1.6%"]}
                </td>
                <td className="p-3 md:p-4 border-r-2 border-black text-center">
                  {row["ISCV_2023_1.4%"]}
                </td>
                <td className="p-3 md:p-4 border-r-2 border-black text-center bg-gray-50">
                  {row["ISCV_2022_1.2%"]}
                </td>
                <td className="p-3 md:p-4 border-r-2 border-black text-center">
                  {row["ISCV_2021_1.0%"]}
                </td>
                <td className="p-3 md:p-4 border-r-2 border-black text-center bg-gray-50">
                  {row["ISCV_2020_0.8%"]}
                </td>
                <td className="p-3 md:p-4 text-center">
                  <div className="text-xs">2019-2017</div>
                  <div className="text-xs text-gray-600">Ver detalles →</div>
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
        <div className="flex justify-between items-center bg-white border-2 border-black p-4 brutal-shadow">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="brutal-btn flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
          >
            <ArrowLeft className="w-4 h-4" /> ANTERIOR
          </button>
          <span className="font-bold font-mono">
            PÁGINA {page} DE {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="brutal-btn flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
          >
            SIGUIENTE <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black brutal-shadow max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-black text-white p-6 flex justify-between items-start sticky top-0 z-10">
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
                className="bg-white text-black p-2 hover:bg-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Vehicle Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-black p-4 bg-gray-50">
                  <h3 className="font-bold uppercase text-sm mb-3 border-b-2 border-black pb-2">
                    Información General
                  </h3>
                  <div className="space-y-2 text-sm font-mono">
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

                <div className="border-2 border-black p-4 bg-gray-50">
                  <h3 className="font-bold uppercase text-sm mb-3 border-b-2 border-black pb-2">
                    Especificaciones Técnicas
                  </h3>
                  <div className="space-y-2 text-sm font-mono">
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
              <div className="border-2 border-black p-4 bg-yellow-50">
                <div className="flex justify-between items-center">
                  <span className="font-bold uppercase text-lg">Valor del Vehículo:</span>
                  <span className="text-2xl font-black">{selectedVehicle.VALOR_VEHICULO}</span>
                </div>
              </div>

              {/* Payment Information by Year */}
              <div className="border-2 border-black">
                <div className="bg-black text-white p-4">
                  <h3 className="font-bold uppercase text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Impuesto de Circulación por Año (ISCV)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 border-b-2 border-black text-left font-bold uppercase text-sm">
                          Año
                        </th>
                        <th className="p-3 border-b-2 border-black text-left font-bold uppercase text-sm">
                          Tasa
                        </th>
                        <th className="p-3 border-b-2 border-black text-right font-bold uppercase text-sm">
                          Monto a Pagar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      <tr className="border-b border-black hover:bg-yellow-50">
                        <td className="p-3 font-bold">2026</td>
                        <td className="p-3">2%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2026_2%"]}</td>
                      </tr>
                      <tr className="border-b border-black hover:bg-yellow-50">
                        <td className="p-3 font-bold">2025</td>
                        <td className="p-3">1.8%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2025_1.8%"]}</td>
                      </tr>
                      <tr className="border-b border-black hover:bg-yellow-50">
                        <td className="p-3 font-bold">2024</td>
                        <td className="p-3">1.6%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2024_1.6%"]}</td>
                      </tr>
                      <tr className="border-b border-black hover:bg-yellow-50">
                        <td className="p-3 font-bold">2023</td>
                        <td className="p-3">1.4%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2023_1.4%"]}</td>
                      </tr>
                      <tr className="border-b border-black hover:bg-yellow-50">
                        <td className="p-3 font-bold">2022</td>
                        <td className="p-3">1.2%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2022_1.2%"]}</td>
                      </tr>
                      <tr className="border-b border-black hover:bg-yellow-50">
                        <td className="p-3 font-bold">2021</td>
                        <td className="p-3">1.0%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2021_1.0%"]}</td>
                      </tr>
                      <tr className="border-b border-black hover:bg-yellow-50">
                        <td className="p-3 font-bold">2020</td>
                        <td className="p-3">0.8%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2020_0.8%"]}</td>
                      </tr>
                      <tr className="border-b border-black hover:bg-yellow-50">
                        <td className="p-3 font-bold">2019</td>
                        <td className="p-3">0.6%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2019_0.6%"]}</td>
                      </tr>
                      <tr className="border-b border-black hover:bg-yellow-50">
                        <td className="p-3 font-bold">2018</td>
                        <td className="p-3">0.4%</td>
                        <td className="p-3 text-right font-bold">{selectedVehicle["ISCV_2018_0.4%"]}</td>
                      </tr>
                      <tr className="hover:bg-yellow-50">
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
