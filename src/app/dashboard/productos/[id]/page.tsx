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
    include: { variantes: true, categoria: true },
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
          categoriaId: producto.categoriaId ?? "",
          proveedor: producto.proveedor ?? "",
          precioCosto: producto.precioCosto ? String(producto.precioCosto) : "",
          gananciaPorcentaje: producto.gananciaPorcentaje
            ? String(producto.gananciaPorcentaje)
            : "",
          precio: Number(producto.precio),
          moneda: producto.moneda,
          admiteColor: producto.admiteColor,
          admiteTalle: producto.admiteTalle,
          stock: producto.stock ?? 0,
          compraMinima: String(producto.compraMinima),
          descuentoCantidadMinima:
            producto.descuentoCantidadMinima != null
              ? String(producto.descuentoCantidadMinima)
              : "",
          descuentoPorcentaje: producto.descuentoPorcentaje
            ? String(producto.descuentoPorcentaje)
            : "",
          visibleSinRegistrarse: producto.visibleSinRegistrarse,
          enOferta: producto.enOferta,
          esNuevo: producto.esNuevo,
          activo: producto.activo,
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
