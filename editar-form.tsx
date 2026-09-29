"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Producto = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoriaId: string;
  proveedor: string;
  precioCosto: string;
  gananciaPorcentaje: string;
  precio: number;
  moneda: "ARS" | "USD";
  admiteColor: boolean;
  admiteTalle: boolean;
  stock: number;
  compraMinima: string;
  descuentoCantidadMinima: string;
  descuentoPorcentaje: string;
  visibleSinRegistrarse: boolean;
  enOferta: boolean;
  esNuevo: boolean;
  activo: boolean;
};

type Variante = { colorId: string; talleId: string; stock: number };
type Categoria = { id: string; nombre: string };
type ColorOpcion = { id: string; codigo: string; nombre: string };
type TalleOpcion = { id: string; codigo: string; nombre: string };

export default function EditarProductoForm({
  producto,
  variantes: variantesIniciales,
}: {
  producto: Producto;
  variantes: Variante[];
}) {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [colores, setColores] = useState<ColorOpcion[]>([]);
  const [talles, setTalles] = useState<TalleOpcion[]>([]);

  // Datos del producto
  const [nombre, setNombre] = useState(producto.nombre);
  const [descripcion, setDescripcion] = useState(producto.descripcion);
  const [categoriaId, setCategoriaId] = useState(producto.categoriaId);
  const [proveedor, setProveedor] = useState(producto.proveedor);

  // Precios
  const [moneda, setMoneda] = useState<"ARS" | "USD">(producto.moneda);
  const [precioCosto, setPrecioCosto] = useState(producto.precioCosto);
  const [gananciaPorcentaje, setGananciaPorcentaje] = useState(producto.gananciaPorcentaje);
  const [precio, setPrecio] = useState(String(producto.precio));

  // Venta y visibilidad
  const [admiteColor, setAdmiteColor] = useState(producto.admiteColor);
  const [admiteTalle, setAdmiteTalle] = useState(producto.admiteTalle);
  const [stock, setStock] = useState(String(producto.stock ?? 0));
  const [compraMinima, setCompraMinima] = useState(producto.compraMinima);
  const [descuentoCantidadMinima, setDescuentoCantidadMinima] = useState(
    producto.descuentoCantidadMinima
  );
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(producto.descuentoPorcentaje);
  const [visibleSinRegistrarse, setVisibleSinRegistrarse] = useState(
    producto.visibleSinRegistrarse
  );
  const [enOferta, setEnOferta] = useState(producto.enOferta);
  const [esNuevo, setEsNuevo] = useState(producto.esNuevo);
  const [activo, setActivo] = useState(producto.activo);

  const [variantes, setVariantes] = useState<Variante[]>(
    variantesIniciales.length > 0
      ? variantesIniciales
      : [{ colorId: "", talleId: "", stock: 0 }]
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then((data) => setCategorias(Array.isArray(data) ? data : []))
      .catch(() => {});
    fetch("/api/colores")
      .then((r) => r.json())
      .then((data) => setColores(Array.isArray(data) ? data : []))
      .catch(() => {});
    fetch("/api/talles")
      .then((r) => r.json())
      .then((data) => setTalles(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  function calcularPrecioVenta(costo: string, ganancia: string) {
    const c = Number(costo);
    const g = Number(ganancia);
    if (!costo || !ganancia || isNaN(c) || isNaN(g)) return;
    setPrecio((c * (1 + g / 100)).toFixed(2));
  }

  function actualizarVariante(i: number, campo: keyof Variante, valor: string) {
    setVariantes((prev) =>
      prev.map((v, idx) =>
        idx === i
          ? { ...v, [campo]: campo === "stock" ? Number(valor) || 0 : valor }
          : v
      )
    );
  }

  function agregarVariante() {
    setVariantes((prev) => [...prev, { colorId: "", talleId: "", stock: 0 }]);
  }

  function quitarVariante(i: number) {
    setVariantes((prev) => prev.filter((_, idx) => idx !== i));
  }

  const usaVariantes = admiteColor || admiteTalle;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (precioCosto !== "" && Number(precio) < Number(precioCosto)) {
      setError("El precio de venta no puede ser menor al costo.");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/productos/${producto.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        descripcion,
        categoriaId: categoriaId || null,
        proveedor: proveedor || null,
        precioCosto: precioCosto === "" ? null : Number(precioCosto),
        gananciaPorcentaje: gananciaPorcentaje === "" ? null : Number(gananciaPorcentaje),
        precio: Number(precio),
        moneda,
        admiteColor,
        admiteTalle,
        stock: usaVariantes ? null : Number(stock) || 0,
        compraMinima: compraMinima === "" ? 1 : Number(compraMinima),
        descuentoCantidadMinima:
          descuentoCantidadMinima === "" ? null : Number(descuentoCantidadMinima),
        descuentoPorcentaje: descuentoPorcentaje === "" ? null : Number(descuentoPorcentaje),
        visibleSinRegistrarse,
        enOferta,
        esNuevo,
        activo,
        variantes: usaVariantes ? variantes.filter((v) => v.colorId || v.talleId) : [],
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo guardar.");
      setLoading(false);
      return;
    }

    router.push("/dashboard/productos");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    const res = await fetch(`/api/productos/${producto.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard/productos");
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Seccion titulo="Datos del producto">
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Código">
              <input
                disabled
                value={producto.codigo}
                className="input bg-gray-50 text-gray-500"
              />
            </Campo>
            <Campo label="Categoría">
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="input"
              >
                <option value="">Sin categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </Campo>
          </div>

          <Campo label="Nombre" required>
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input"
            />
          </Campo>

          <Campo label="Descripción">
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="input min-h-20"
            />
          </Campo>

          <Campo label="Proveedor">
            <input
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              placeholder="Dejalo vacío si es un producto propio"
              className="input"
            />
          </Campo>
        </Seccion>

        <Seccion titulo="Precios">
          <div className="grid grid-cols-3 gap-3">
            <Campo label="Moneda">
              <select
                value={moneda}
                onChange={(e) => setMoneda(e.target.value as "ARS" | "USD")}
                className="input"
              >
                <option value="ARS">Pesos (ARS)</option>
                <option value="USD">Dólares (USD)</option>
              </select>
            </Campo>
            <Campo label="Costo $">
              <input
                type="number"
                step="0.01"
                value={precioCosto}
                onChange={(e) => {
                  setPrecioCosto(e.target.value);
                  calcularPrecioVenta(e.target.value, gananciaPorcentaje);
                }}
                className="input"
              />
            </Campo>
            <Campo label="Ganancia %">
              <input
                type="number"
                step="0.01"
                value={gananciaPorcentaje}
                onChange={(e) => {
                  setGananciaPorcentaje(e.target.value);
                  calcularPrecioVenta(precioCosto, e.target.value);
                }}
                className="input"
              />
            </Campo>
          </div>
          <Campo label="Precio venta $" required>
            <input
              required
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="input"
            />
          </Campo>
          <p className="text-xs text-gray-400">
            El precio de venta no puede ser menor al costo. La ganancia se
            calcula sobre el costo.
          </p>
        </Seccion>

        <Seccion titulo="Venta y visibilidad">
          <div className="flex gap-5">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={admiteColor}
                onChange={(e) => setAdmiteColor(e.target.checked)}
              />
              Admite color
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={admiteTalle}
                onChange={(e) => setAdmiteTalle(e.target.checked)}
              />
              Admite talle
            </label>
          </div>

          {!usaVariantes ? (
            <Campo label="Stock">
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="input"
              />
            </Campo>
          ) : (
            <div>
              <p className="text-sm font-medium mb-2">
                Variantes {admiteColor && admiteTalle
                  ? "(color / talle / stock)"
                  : admiteColor
                  ? "(color / stock)"
                  : "(talle / stock)"}
              </p>
              <div className="flex flex-col gap-2">
                {variantes.map((v, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    {admiteColor && (
                      <select
                        value={v.colorId}
                        onChange={(e) => actualizarVariante(i, "colorId", e.target.value)}
                        className="input flex-1"
                      >
                        <option value="">Color...</option>
                        {colores.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.codigo} - {c.nombre}
                          </option>
                        ))}
                      </select>
                    )}
                    {admiteTalle && (
                      <select
                        value={v.talleId}
                        onChange={(e) => actualizarVariante(i, "talleId", e.target.value)}
                        className="input w-32"
                      >
                        <option value="">Talle...</option>
                        {talles.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.codigo} - {t.nombre}
                          </option>
                        ))}
                      </select>
                    )}
                    <input
                      placeholder="Stock"
                      type="number"
                      value={v.stock}
                      onChange={(e) => actualizarVariante(i, "stock", e.target.value)}
                      className="input w-24"
                    />
                    <button
                      type="button"
                      onClick={() => quitarVariante(i)}
                      className="text-gray-400 hover:text-red-600 px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={agregarVariante}
                className="mt-2 text-sm text-navy font-medium hover:underline"
              >
                + Agregar variante
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <Campo label="Mínimo de compra">
              <input
                type="number"
                step="0.001"
                min={0}
                value={compraMinima}
                onChange={(e) => setCompraMinima(e.target.value)}
                className="input"
              />
            </Campo>
            <Campo label="Dto. desde cantidad">
              <input
                type="number"
                value={descuentoCantidadMinima}
                onChange={(e) => setDescuentoCantidadMinima(e.target.value)}
                className="input"
                placeholder="Ej: 12"
              />
            </Campo>
            <Campo label="% descuento">
              <input
                type="number"
                step="0.01"
                value={descuentoPorcentaje}
                onChange={(e) => setDescuentoPorcentaje(e.target.value)}
                className="input"
                placeholder="Ej: 10"
              />
            </Campo>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={visibleSinRegistrarse}
                onChange={(e) => setVisibleSinRegistrarse(e.target.checked)}
              />
              Visible sin registrarse
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={enOferta}
                onChange={(e) => setEnOferta(e.target.checked)}
              />
              Oferta
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={esNuevo}
                onChange={(e) => setEsNuevo(e.target.checked)}
              />
              Nuevo
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
              Activo (visible en catálogo)
            </label>
          </div>
        </Seccion>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-navy text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md border border-red-300 text-red-600 text-sm font-semibold px-5 py-2.5 hover:bg-red-50"
          >
            Eliminar producto
          </button>
        </div>
      </form>

      <style jsx global>{`
        .input {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          width: 100%;
          background: white;
        }
        .input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #1f3864;
        }
      `}</style>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
      <p className="text-xs font-bold uppercase tracking-wide text-gold">{titulo}</p>
      {children}
    </div>
  );
}

function Campo({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
