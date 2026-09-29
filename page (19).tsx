import { prisma } from "@/lib/prisma";
import { NuevoTalleForm, TalleAcciones } from "./acciones";

export default async function TallesPage() {
  const talles = await prisma.talle.findMany({
    orderBy: { codigo: "asc" },
    include: { _count: { select: { variantes: true } } },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-navy mb-1">Talles</h1>
      <p className="text-sm text-gray-500 mb-6">
        Tabla de talles disponibles (código + nombre) para usar en las
        variantes de los productos.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <NuevoTalleForm />
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
            {talles.map((t) => (
              <tr key={t.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{t.codigo}</td>
                <td className="px-4 py-3">{t.nombre}</td>
                <td className="px-4 py-3 text-right tabular-nums text-gray-500">
                  {t._count.variantes}
                </td>
                <td className="px-4 py-3 text-right">
                  <TalleAcciones id={t.id} nombre={t.nombre} />
                </td>
              </tr>
            ))}
            {talles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  Todavía no cargaste talles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
