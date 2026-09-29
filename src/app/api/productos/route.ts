import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const productos = await prisma.producto.findMany({
    include: { variantes: true, categoria: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(productos);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await req.json();
  const {
    codigo,
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

  if (!codigo || !nombre || precio === undefined || precio === null) {
    return NextResponse.json(
      { error: "Faltan datos obligatorios: código, nombre y precio de venta." },
      { status: 400 }
    );
  }

  if (precioCosto != null && precioCosto !== "" && Number(precio) < Number(precioCosto)) {
    return NextResponse.json(
      { error: "El precio de venta no puede ser menor al costo." },
      { status: 400 }
    );
  }

  const usaVariantes = !!admiteColor || !!admiteTalle;

  try {
    const producto = await prisma.producto.create({
      data: {
        codigo,
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
        variantes: {
          create: usaVariantes && Array.isArray(variantes)
            ? variantes.map((v: { color?: string; talle?: string; stock?: number }) => ({
                color: admiteColor ? v.color || null : null,
                talle: admiteTalle ? v.talle || null : null,
                stock: v.stock ?? 0,
              }))
            : [],
        },
      },
      include: { variantes: true, categoria: true },
    });
    return NextResponse.json(producto, { status: 201 });
  } catch (e: unknown) {
    const message =
      e instanceof Error && e.message.includes("Unique")
        ? "Ya existe un producto con ese código."
        : "No se pudo crear el producto.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
