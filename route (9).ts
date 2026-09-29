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
      { error: "Faltan datos: código y nombre del talle." },
      { status: 400 }
    );
  }

  try {
    const talle = await prisma.talle.update({
      where: { id: params.id },
      data: { codigo: codigo.trim(), nombre: nombre.trim() },
    });
    return NextResponse.json(talle);
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar el talle." }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  try {
    await prisma.talle.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo eliminar (puede estar en uso en variantes)." },
      { status: 400 }
    );
  }
}
