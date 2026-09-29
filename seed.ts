// Carga datos de ejemplo: un usuario admin y un par de productos del catálogo.
// Correr con: npm run db:seed

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function color(codigo: string, nombre: string) {
  return prisma.color.upsert({
    where: { codigo },
    update: {},
    create: { codigo, nombre },
  });
}

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

  // Tabla de colores de ejemplo.
  const negro = await color("NEG", "Negro");
  const beige = await color("BEI", "Beige");
  const azul = await color("AZU", "Azul");
  const grisClaro = await color("GRC", "Gris claro");
  const verde = await color("VER", "Verde");
  const marron = await color("MAR", "Marrón");
  const grisOscuro = await color("GRO", "Gris oscuro");
  const multicolor = await color("MUL", "Color surtido");
  const pastel = await color("PAS", "Pastel");
  const blancoRosaFucsia = await color("BRF", "Blanco/rosa/fucsia");
  const blancoNegro = await color("BYN", "Blanco y negro");

  const gorra = await prisma.producto.upsert({
    where: { codigo: "G9012B" },
    update: {},
    create: {
      codigo: "G9012B",
      nombre: "Gorra vintage lavada",
      descripcion: "Gorra estilo vintage con lavado desgastado.",
      categoria: { connectOrCreate: { where: { nombre: "Gorras" }, create: { nombre: "Gorras" } } },
      precio: 8500,
      admiteColor: true,
      stock: null,
      variantes: {
        create: [
          { colorId: negro.id, stock: 20 },
          { colorId: beige.id, stock: 15 },
          { colorId: azul.id, stock: 10 },
          { colorId: grisClaro.id, stock: 8 },
          { colorId: verde.id, stock: 8 },
          { colorId: marron.id, stock: 8 },
          { colorId: grisOscuro.id, stock: 8 },
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
      categoria: {
        connectOrCreate: {
          where: { nombre: "Accesorios de cabello" },
          create: { nombre: "Accesorios de cabello" },
        },
      },
      precio: 3200,
      admiteColor: true,
      stock: null,
      variantes: {
        create: [
          { colorId: multicolor.id, stock: 30 },
          { colorId: pastel.id, stock: 25 },
          { colorId: blancoRosaFucsia.id, stock: 20 },
          { colorId: blancoNegro.id, stock: 20 },
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
