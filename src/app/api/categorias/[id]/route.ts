import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { nombre } = await req.json();
  if (!nombre || !nombre.trim()) {
    return NextResponse.json({ error: "Falta el nombre de la categoría." }, { status: 400 });
  }

  try {
    const categoria = await prisma.categoria.update({
      where: { id: params.id },
      data: { nombre: nombre.trim() },
    });
    return NextResponse.json(categoria);
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar la categoría." }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  try {
    await prisma.categoria.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo eliminar (puede tener productos asignados)." },
      { status: 400 }
    );
  }
}
