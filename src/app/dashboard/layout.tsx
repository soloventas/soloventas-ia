import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LogoutButton from "./logout-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 bg-navy text-white flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-[11px] tracking-wide uppercase text-gold font-bold">
            Solo Ventas IA
          </p>
          <p className="text-sm font-semibold mt-1">Panel del supervisor</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 text-sm">
          <Link
            href="/dashboard"
            className="px-3 py-2 rounded-md hover:bg-white/10"
          >
            Resumen
          </Link>
          <Link
            href="/dashboard/productos"
            className="px-3 py-2 rounded-md hover:bg-white/10"
          >
            Catálogo de productos
          </Link>
          <Link
            href="/dashboard/categorias"
            className="px-3 py-2 rounded-md hover:bg-white/10"
          >
            Categorías
          </Link>
          <Link
            href="/dashboard/contenido"
            className="px-3 py-2 rounded-md hover:bg-white/10"
          >
            Contenido para aprobar
          </Link>
        </nav>
        <div className="p-3 border-t border-white/10">
          <p className="px-3 text-xs text-white/50 mb-1">{session.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
