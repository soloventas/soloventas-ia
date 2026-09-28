import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditarProductoForm from "./editar-form";

export default async function EditarProductoPage({
  params,
}: {
  params: { id: string };
}) {
  const producto = await prisma.producto.findUnique({
    where: { id: params.id },
    include: { variantes: true },
  });

  if (!producto) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-navy mb-6">
        Editar producto
      </h1>
      <EditarProductoForm
        producto={{
          id: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          descripcion: producto.descripcion ?? "",
          categoria: producto.categoria ?? "",
          precio: Number(producto.precio),
        }}
        variantes={producto.variantes.map((v) => ({
          color: v.color ?? "",
          talle: v.talle ?? "",
          stock: v.stock,
        }))}
      />
    </div>
  );
}
