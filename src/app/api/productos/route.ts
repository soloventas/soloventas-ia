import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const productos = await prisma.producto.findMany({
    include: { variantes: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(productos);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await req.json();
  const { codigo, nombre, descripcion, categoria, precio, imagenUrl, variantes } = body;

  if (!codigo || !nombre || precio === undefined) {
    return NextResponse.json(
      { error: "Faltan datos obligatorios: código, nombre y precio." },
      { status: 400 }
    );
  }

  try {
    const producto = await prisma.producto.create({
      data: {
        codigo,
        nombre,
        descripcion: descripcion || null,
        categoria: categoria || null,
        precio,
        imagenUrl: imagenUrl || null,
        variantes: {
          create: Array.isArray(variantes)
            ? variantes.map((v: { color?: string; talle?: string; stock?: number }) => ({
                color: v.color || null,
                talle: v.talle || null,
                stock: v.stock ?? 0,
              }))
            : [],
        },
      },
      include: { variantes: true },
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
