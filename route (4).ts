import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const categorias = await prisma.categoria.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { productos: true } } },
  });
  return NextResponse.json(categorias);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { nombre } = await req.json();
  if (!nombre || !nombre.trim()) {
    return NextResponse.json({ error: "Falta el nombre de la categoría." }, { status: 400 });
  }

  try {
    const categoria = await prisma.categoria.create({
      data: { nombre: nombre.trim() },
    });
    return NextResponse.json(categoria, { status: 201 });
  } catch (e: unknown) {
    const message =
      e instanceof Error && e.message.includes("Unique")
        ? "Ya existe una categoría con ese nombre."
        : "No se pudo crear la categoría.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
