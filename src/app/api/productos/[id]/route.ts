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
    include: { variantes: true },
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
  const { nombre, descripcion, categoria, precio, imagenUrl } = body;

  try {
    const producto = await prisma.producto.update({
      where: { id: params.id },
      data: {
        nombre,
        descripcion: descripcion || null,
        categoria: categoria || null,
        precio,
        imagenUrl: imagenUrl || null,
      },
      include: { variantes: true },
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
