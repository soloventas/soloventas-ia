import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOLO VENTAS IA",
  description: "Panel de supervisor — SOLO VENTAS IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
