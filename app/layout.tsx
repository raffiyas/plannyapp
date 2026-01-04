import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Planny — Tu tablero de gestión comercial",
  description: "Gestiona tu flujo comercial de manera simple y efectiva",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
