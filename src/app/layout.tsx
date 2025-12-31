import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WBRS Circulación 2026",
  description: "Consulta de valores imponibles de vehículos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className="antialiased bg-white text-black font-mono selection:bg-black selection:text-white"
      >
        <div className="min-h-screen flex flex-col border-x-4 border-black max-w-7xl mx-auto">
           {children}
        </div>
      </body>
    </html>
  );
}