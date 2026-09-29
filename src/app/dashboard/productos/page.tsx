import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProductosPage() {
  const productos = await prisma.producto.findMany({
    include: { variantes: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-navy">
            Catálogo de productos
          </h1>
          <p className="text-sm text-gray-500">
            {productos.length} producto(s) cargado(s).
          </p>
        </div>
        <Link
          href="/dashboard/productos/nuevo"
          className="rounded-md bg-navy text-white text-sm font-semibold px-4 py-2 hover:opacity-90"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Código</th>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Categoría</th>
              <th className="text-right px-4 py-3">Precio</th>
              <th className="text-right px-4 py-3">Stock total</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => {
              const stockTotal = p.variantes.reduce((acc, v) => acc + v.stock, 0);
              return (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {p.codigo}
                  </td>
                  <td className="px-4 py-3">{p.nombre}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {p.categoria || "—"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    ${Number(p.precio).toLocaleString("es-AR")}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {stockTotal}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/productos/${p.id}`}
                      className="text-navy text-sm font-medium hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              );
            })}
            {productos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Todavía no cargaste productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
