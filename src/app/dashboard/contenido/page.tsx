import { prisma } from "@/lib/prisma";
import ContenidoAcciones from "./acciones";

export default async function ContenidoPage() {
  const pendientes = await prisma.contenidoGenerado.findMany({
    where: { estado: "PENDIENTE" },
    include: { producto: true },
    orderBy: { createdAt: "asc" },
  });

  const revisados = await prisma.contenidoGenerado.findMany({
    where: { estado: { not: "PENDIENTE" } },
    include: { producto: true },
    orderBy: { revisadoAt: "desc" },
    take: 10,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy mb-1">
        Contenido para aprobar
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Lo que produce el equipo de Marketing pasa por acá antes de
        publicarse (equipo de Calidad).
      </p>

      <div className="flex flex-col gap-3 mb-10">
        {pendientes.length === 0 && (
          <p className="text-sm text-gray-400">No hay contenido pendiente.</p>
        )}
        {pendientes.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-gold font-bold mb-1">
                {c.tipo}
              </p>
              <p className="text-sm font-medium">{c.producto.nombre}</p>
              <p className="text-sm text-gray-500 mt-1 break-all">
                {c.contenido}
              </p>
            </div>
            <ContenidoAcciones id={c.id} />
          </div>
        ))}
      </div>

      {revisados.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-navy mb-3">
            Revisados recientemente
          </h2>
          <div className="flex flex-col gap-2">
            {revisados.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between text-sm bg-white border border-gray-100 rounded-lg px-4 py-2.5"
              >
                <span>
                  {c.producto.nombre} —{" "}
                  <span className="text-gray-400">{c.tipo}</span>
                </span>
                <span
                  className={
                    c.estado === "APROBADO"
                      ? "text-green-700 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {c.estado === "APROBADO" ? "Aprobado" : "Rechazado"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
