import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Aprueba o rechaza una pieza de contenido (equipo de Calidad).
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { estado, notas } = await req.json();
  if (!["APROBADO", "RECHAZADO"].includes(estado)) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }

  const contenido = await prisma.contenidoGenerado.update({
    where: { id: params.id },
    data: { estado, notas: notas || null, revisadoAt: new Date() },
  });

  return NextResponse.json(contenido);
}
