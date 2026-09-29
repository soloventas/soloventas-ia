import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [productos, pendientes, aprobados] = await Promise.all([
    prisma.producto.count(),
    prisma.contenidoGenerado.count({ where: { estado: "PENDIENTE" } }),
    prisma.contenidoGenerado.count({ where: { estado: "APROBADO" } }),
  ]);

  const cards = [
    { label: "Productos cargados", value: productos },
    { label: "Contenido pendiente de aprobar", value: pendientes },
    { label: "Contenido aprobado", value: aprobados },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy mb-1">Resumen</h1>
      <p className="text-sm text-gray-500 mb-6">
        Etapa 1: catálogo, marketing y calidad. Los equipos de crecimiento y
        atención se conectan en las próximas etapas.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <p className="text-3xl font-semibold text-navy tabular-nums">
              {c.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-navy mb-2">
          Estado de los equipos
        </h2>
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li>Marketing: carga manual habilitada (agente de IA — próxima etapa).</li>
          <li>
            Calidad: {pendientes} pieza(s) esperando aprobación en{" "}
            <span className="text-navy font-medium">Contenido para aprobar</span>.
          </li>
          <li>Crecimiento: no conectado todavía (Etapa 4).</li>
          <li>Atención y ventas: no conectado todavía (Etapa 3).</li>
        </ul>
      </div>
    </div>
  );
}
