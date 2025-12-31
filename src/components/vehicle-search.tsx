"use client";

import { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import { Search, ArrowRight, ArrowLeft, Loader2, Database } from "lucide-react";
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
  [key: string]: string;
};

export default function VehicleSearch() {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerTerm = searchTerm.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lowerTerm)
      )
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

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
      {/* Search Section */}
      <div className="bg-black text-white p-6 brutal-shadow border-2 border-black">
        <label className="block text-sm font-bold mb-2 uppercase tracking-widest">
          Buscar Vehículo (Marca, Línea, Código...)
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
        <div className="mt-4 flex items-center gap-2 text-sm font-mono">
            <Database className="w-4 h-4" />
            <span>{filteredData.length} RESULTADOS ENCONTRADOS</span>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto border-2 border-black brutal-shadow bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white uppercase text-sm tracking-wider">
              <th className="p-4 border-b-2 border-black border-r-2">Código</th>
              <th className="p-4 border-b-2 border-black border-r-2">Marca / Línea</th>
              <th className="p-4 border-b-2 border-black border-r-2">Tipo</th>
              <th className="p-4 border-b-2 border-black border-r-2 text-right">Valor 2026</th>
              <th className="p-4 border-b-2 border-black text-right">Impuesto 2026</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-yellow-100 border-b-2 border-black transition-colors"
              >
                <td className="p-4 border-r-2 border-black font-bold">{row.CODIGO}</td>
                <td className="p-4 border-r-2 border-black">
                  <div className="font-bold">{row.MARCA}</div>
                  <div className="text-xs text-gray-600">{row.LINEA}</div>
                </td>
                <td className="p-4 border-r-2 border-black">{row.TIPO_VEHICULO}</td>
                <td className="p-4 border-r-2 border-black text-right font-bold">
                  {row.VALOR_VEHICULO}
                </td>
                <td className="p-4 text-right bg-gray-50 font-bold">
                  {row["ISCV_2026_2%"]}
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-xl font-bold uppercase">
                    No se encontraron resultados para "{searchTerm}"
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
    </div>
  );
}
