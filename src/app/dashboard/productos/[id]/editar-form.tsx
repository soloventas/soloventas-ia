"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Producto = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
};

type Variante = { color: string; talle: string; stock: number };

export default function EditarProductoForm({
  producto,
  variantes,
}: {
  producto: Producto;
  variantes: Variante[];
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState(producto.nombre);
  const [descripcion, setDescripcion] = useState(producto.descripcion);
  const [categoria, setCategoria] = useState(producto.categoria);
  const [precio, setPrecio] = useState(String(producto.precio));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch(`/api/productos/${producto.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        descripcion,
        categoria,
        precio: Number(precio),
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
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Código</label>
            <input
              disabled
              value={producto.codigo}
              className="input bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio</label>
            <input
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="input min-h-20"
          />
        </div>

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

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-sm font-semibold text-navy mb-3">
          Variantes y stock
        </p>
        {variantes.length === 0 ? (
          <p className="text-sm text-gray-400">Sin variantes cargadas.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left py-1">Color</th>
                <th className="text-left py-1">Talle</th>
                <th className="text-right py-1">Stock</th>
              </tr>
            </thead>
            <tbody>
              {variantes.map((v, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="py-1.5">{v.color || "—"}</td>
                  <td className="py-1.5">{v.talle || "—"}</td>
                  <td className="py-1.5 text-right tabular-nums">{v.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="text-xs text-gray-400 mt-3">
          La edición de stock por variante se suma en la próxima iteración;
          por ahora se carga al crear el producto.
        </p>
      </div>

      <style jsx global>{`
        .input {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          width: 100%;
        }
        .input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #1f3864;
        }
      `}</style>
    </div>
  );
}
