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
        className="antialiased font-mono"
        style={{
          backgroundColor: 'rgb(var(--background))',
          color: 'rgb(var(--foreground))',
        }}
      >
        <div className="min-h-screen flex flex-col max-w-7xl mx-auto brutal-border">
           {children}
        </div>
      </body>
    </html>
  );
}