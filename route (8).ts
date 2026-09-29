import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const talles = await prisma.talle.findMany({
    orderBy: { codigo: "asc" },
    include: { _count: { select: { variantes: true } } },
  });
  return NextResponse.json(talles);
}

export async function POST(req: NextRequest) {
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
    const talle = await prisma.talle.create({
      data: { codigo: codigo.trim(), nombre: nombre.trim() },
    });
    return NextResponse.json(talle, { status: 201 });
  } catch (e: unknown) {
    const message =
      e instanceof Error && e.message.includes("Unique")
        ? "Ya existe un talle con ese código."
        : "No se pudo crear el talle.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
