import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Carga manual de contenido (foto/video/texto) mientras no está conectado
// el agente de IA de marketing. Queda en estado PENDIENTE para Calidad.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { productoId, tipo, contenido } = await req.json();
  if (!productoId || !tipo || !contenido) {
    return NextResponse.json({ error: "Faltan datos obligatorios." }, { status: 400 });
  }

  const registro = await prisma.contenidoGenerado.create({
    data: { productoId, tipo, contenido },
  });
  return NextResponse.json(registro, { status: 201 });
}
