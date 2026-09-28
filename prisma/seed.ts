// Carga datos de ejemplo: un usuario admin y un par de productos del catálogo.
// Correr con: npm run db:seed

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@soloventas.com.ar";
  const adminPassword = "cambiar123"; // cambiar apenas entres al panel

  await prisma.usuario.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      nombre: "Administrador",
      passwordHash: await hashPassword(adminPassword),
    },
  });

  const gorra = await prisma.producto.upsert({
    where: { codigo: "G9012B" },
    update: {},
    create: {
      codigo: "G9012B",
      nombre: "Gorra vintage lavada",
      descripcion: "Gorra estilo vintage con lavado desgastado.",
      categoria: "Gorras",
      precio: 8500,
      variantes: {
        create: [
          { color: "Negro", stock: 20 },
          { color: "Beige", stock: 15 },
          { color: "Azul", stock: 10 },
          { color: "Gris claro", stock: 8 },
          { color: "Verde", stock: 8 },
          { color: "Marrón", stock: 8 },
          { color: "Gris oscuro", stock: 8 },
        ],
      },
    },
  });

  const colinesN16 = await prisma.producto.upsert({
    where: { codigo: "TUITI-16" },
    update: {},
    create: {
      codigo: "TUITI-16",
      nombre: "Colines de cabello Tuiti N° 16",
      descripcion: "Bolsa x24 unidades, talle 16x24.",
      categoria: "Accesorios de cabello",
      precio: 3200,
      variantes: {
        create: [
          { color: "Color", stock: 30 },
          { color: "Pastel", stock: 25 },
          { color: "Blanco/rosa/fucsia", stock: 20 },
          { color: "Blanco y negro", stock: 20 },
        ],
      },
    },
  });

  console.log("Seed listo:", { adminEmail, gorra: gorra.codigo, colines: colinesN16.codigo });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
