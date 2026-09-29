# SOLO VENTAS IA — Etapa 1 (MVP)

Panel del supervisor + catálogo de productos + pantalla de aprobación de
contenido (equipo de Calidad). Corre en tu computadora; más adelante se
sube a un servidor.

## Qué incluye esta versión

- Login con sesión (usuario y contraseña propios, sin servicios externos).
- Catálogo de productos: alta, edición, baja, variantes de color/talle con stock.
- Pantalla de "Contenido para aprobar": lo que el equipo de Marketing carga
  (por ahora a mano; el agente de IA se conecta en una próxima iteración)
  y el equipo de Calidad aprueba o rechaza.
- Panel de resumen con las métricas básicas.

Lo que **todavía no** hace (queda para las próximas etapas del plan):
generación automática de contenido con IA, publicación en redes,
WhatsApp/atención al cliente, y pedidos con remito y envío.

## Requisitos

- [Node.js](https://nodejs.org) 20 o más nuevo.
- [PostgreSQL](https://www.postgresql.org/download/) instalado y corriendo
  en tu computadora (o Docker, ver más abajo).

## Instalación

```bash
# 1. Instalar las dependencias
npm install

# 2. Crear el archivo de configuración
cp .env.example .env
```

Abrí `.env` y completá:

- `DATABASE_URL`: los datos de tu PostgreSQL local. Si instalaste Postgres
  con los valores por defecto, alcanza con crear la base:
  ```bash
  createdb soloventas_ia
  ```
  (o con Docker: `docker run --name soloventas-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16` y crear la base con `docker exec -it soloventas-db createdb -U postgres soloventas_ia`)

- `SESSION_SECRET`: una clave aleatoria. Generala con:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

## Crear las tablas y cargar datos de ejemplo

```bash
npm run db:migrate   # crea las tablas en tu base de datos
npm run db:seed      # carga un usuario admin y dos productos de ejemplo
```

Usuario de ejemplo: `admin@soloventas.com.ar` / `cambiar123` — cambialo
apenas puedas creando un nuevo usuario desde Prisma Studio (`npm run db:studio`)
o desde una pantalla de administración (próxima iteración).

## Correr el proyecto

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) — te va a redirigir al
login.

## Estructura del proyecto

```
src/app/            → páginas y rutas de API (Next.js App Router)
  dashboard/         → panel del supervisor (protegido por sesión)
  api/                → endpoints: auth, productos, contenido
src/lib/            → conexión a la base (prisma.ts) y sesión (auth.ts, session.ts)
prisma/schema.prisma → modelo de datos (productos, variantes, contenido, usuarios)
prisma/seed.ts       → datos de ejemplo
```

## Próximos pasos sugeridos (Etapa 1.1 en adelante)

1. Pantalla para crear usuarios del panel (hoy solo existe por seed/Prisma Studio).
2. Conectar el primer agente de IA (quitar fondo de una foto) al cargar contenido.
3. Editar stock por variante desde el panel (hoy solo se carga al crear el producto).
4. Cuando esté listo para producción: elegir dónde alojarlo (Vercel para el
   panel + una base Postgres administrada, por ejemplo Neon o Supabase, son
   las opciones más simples para no mantener un servidor propio).
