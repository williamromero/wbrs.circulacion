import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://circulacion.webres-studio.com"),
  title: "Impuesto de Circulación 2026 | Webres Studio",
  description: "Consulta oficial de valores imponibles e impuesto de circulación 2026 (ISCV) para vehículos terrestres en Guatemala. Base de datos actualizada con descuento del 50%.",
  keywords: ["sat", "iscv", "impuesto circulación", "guatemala", "2026", "vehículos", "valores imponibles"],
  icons: {
    icon: "/wbrs.svg", // Modern browsers support SVG favicons
    shortcut: "/wbrs.svg",
    apple: "/wbrs.svg",
  },
  openGraph: {
    title: "WBRS Circulación 2026 | Consulta de Impuestos",
    description: "Calcula tu impuesto de circulación 2026 con el 50% de descuento aplicado. Base de datos oficial actualizada.",
    type: "website",
    locale: "es_GT",
    siteName: "WBRS Circulación",
    images: [
      {
        url: "/wbrs-circulacion-web.jpeg", // Referencia a la imagen en public
        width: 1200,
        height: 630,
        alt: "WBRS Circulación 2026 Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WBRS Circulación 2026",
    description: "Consulta tu impuesto de circulación 2026 rápido y fácil.",
    images: ["/wbrs-circulacion-web.jpeg"],
    creator: "@webresstudio",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className="antialiased font-mono selection:bg-[rgb(var(--primary))] selection:text-[rgb(var(--primary-foreground))]"
      >
        <div className="min-h-screen flex flex-col border-x-4 border-[rgb(var(--foreground))] max-w-7xl mx-auto bg-[rgb(var(--background))] shadow-[0px_0px_50px_rgba(0,0,0,0.1)]">
           {children}
        </div>
      </body>
    </html>
  );
}