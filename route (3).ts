import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { codigo, nombre } = await req.json();
  if (!codigo || !codigo.trim() || !nombre || !nombre.trim()) {
    return NextResponse.json(
      { error: "Faltan datos: código y nombre del color." },
      { status: 400 }
    );
  }

  try {
    const color = await prisma.color.update({
      where: { id: params.id },
      data: { codigo: codigo.trim(), nombre: nombre.trim() },
    });
    return NextResponse.json(color);
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar el color." }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  try {
    await prisma.color.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo eliminar (puede estar en uso en variantes)." },
      { status: 400 }
    );
  }
}
