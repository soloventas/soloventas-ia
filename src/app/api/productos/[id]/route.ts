import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const producto = await prisma.producto.findUnique({
    where: { id: params.id },
    include: { variantes: true, categoria: true },
  });
  if (!producto) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  return NextResponse.json(producto);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await req.json();
  const {
    nombre,
    descripcion,
    categoriaId,
    proveedor,
    precioCosto,
    gananciaPorcentaje,
    precio,
    moneda,
    admiteColor,
    admiteTalle,
    stock,
    compraMinima,
    descuentoCantidadMinima,
    descuentoPorcentaje,
    visibleSinRegistrarse,
    enOferta,
    esNuevo,
    activo,
    imagenUrl,
    variantes,
  } = body;

  if (precioCosto != null && precioCosto !== "" && Number(precio) < Number(precioCosto)) {
    return NextResponse.json(
      { error: "El precio de venta no puede ser menor al costo." },
      { status: 400 }
    );
  }

  const usaVariantes = !!admiteColor || !!admiteTalle;

  try {
    const producto = await prisma.producto.update({
      where: { id: params.id },
      data: {
        nombre,
        descripcion: descripcion || null,
        categoriaId: categoriaId || null,
        proveedor: proveedor || null,
        precioCosto: precioCosto === "" || precioCosto == null ? null : precioCosto,
        gananciaPorcentaje:
          gananciaPorcentaje === "" || gananciaPorcentaje == null ? null : gananciaPorcentaje,
        precio,
        moneda: moneda === "USD" ? "USD" : "ARS",
        admiteColor: !!admiteColor,
        admiteTalle: !!admiteTalle,
        stock: usaVariantes ? null : Number(stock) || 0,
        compraMinima: compraMinima === "" || compraMinima == null ? 1 : compraMinima,
        descuentoCantidadMinima:
          descuentoCantidadMinima === "" || descuentoCantidadMinima == null
            ? null
            : Number(descuentoCantidadMinima),
        descuentoPorcentaje:
          descuentoPorcentaje === "" || descuentoPorcentaje == null
            ? null
            : descuentoPorcentaje,
        visibleSinRegistrarse: visibleSinRegistrarse ?? true,
        enOferta: !!enOferta,
        esNuevo: esNuevo ?? true,
        activo: activo ?? true,
        imagenUrl: imagenUrl || null,
        variantes: Array.isArray(variantes)
          ? {
              deleteMany: {},
              create: usaVariantes
                ? variantes.map((v: { color?: string; talle?: string; stock?: number }) => ({
                    color: admiteColor ? v.color || null : null,
                    talle: admiteTalle ? v.talle || null : null,
                    stock: v.stock ?? 0,
                  }))
                : [],
            }
          : undefined,
      },
      include: { variantes: true, categoria: true },
    });
    return NextResponse.json(producto);
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar." }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  try {
    await prisma.producto.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo eliminar." }, { status: 400 });
  }
}
