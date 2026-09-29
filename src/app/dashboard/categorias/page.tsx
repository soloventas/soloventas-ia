import { prisma } from "@/lib/prisma";
import { NuevaCategoriaForm, CategoriaAcciones } from "./acciones";

export default async function CategoriasPage() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { productos: true } } },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-navy mb-1">Categorías</h1>
      <p className="text-sm text-gray-500 mb-6">
        Dividí el catálogo por categorías. Después las vas a poder elegir al
        cargar cada producto.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <NuevaCategoriaForm />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-right px-4 py-3">Productos</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{c.nombre}</td>
                <td className="px-4 py-3 text-right tabular-nums text-gray-500">
                  {c._count.productos}
                </td>
                <td className="px-4 py-3 text-right">
                  <CategoriaAcciones id={c.id} nombre={c.nombre} />
                </td>
              </tr>
            ))}
            {categorias.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                  Todavía no cargaste categorías.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
