import { prisma } from "@/lib/prisma";
import { NuevoColorForm, ColorAcciones } from "./acciones";

export default async function ColoresPage() {
  const colores = await prisma.color.findMany({
    orderBy: { codigo: "asc" },
    include: { _count: { select: { variantes: true } } },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-navy mb-1">Colores</h1>
      <p className="text-sm text-gray-500 mb-6">
        Tabla de colores disponibles (código + nombre) para usar en las
        variantes de los productos.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <NuevoColorForm />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Código</th>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-right px-4 py-3">En uso</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {colores.map((c) => (
              <tr key={c.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{c.codigo}</td>
                <td className="px-4 py-3">{c.nombre}</td>
                <td className="px-4 py-3 text-right tabular-nums text-gray-500">
                  {c._count.variantes}
                </td>
                <td className="px-4 py-3 text-right">
                  <ColorAcciones id={c.id} nombre={c.nombre} />
                </td>
              </tr>
            ))}
            {colores.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  Todavía no cargaste colores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
