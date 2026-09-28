"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Variante = { color: string; talle: string; stock: number };

export default function NuevoProductoPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [variantes, setVariantes] = useState<Variante[]>([
    { color: "", talle: "", stock: 0 },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setVariantes((prev) => [...prev, { color: "", talle: "", stock: 0 }]);
  }

  function quitarVariante(i: number) {
    setVariantes((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo,
        nombre,
        descripcion,
        categoria,
        precio: Number(precio),
        variantes: variantes.filter((v) => v.color || v.talle),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo crear el producto.");
      setLoading(false);
      return;
    }

    router.push("/dashboard/productos");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-navy mb-6">Nuevo producto</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <Campo label="Código" required>
            <input
              required
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="input"
              placeholder="G9012B"
            />
          </Campo>
          <Campo label="Precio" required>
            <input
              required
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="input"
              placeholder="8500"
            />
          </Campo>
        </div>

        <Campo label="Nombre" required>
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input"
            placeholder="Gorra vintage lavada"
          />
        </Campo>

        <Campo label="Categoría">
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="input"
            placeholder="Gorras"
          />
        </Campo>

        <Campo label="Descripción">
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="input min-h-20"
          />
        </Campo>

        <div>
          <p className="text-sm font-medium mb-2">Variantes (color / talle / stock)</p>
          <div className="flex flex-col gap-2">
            {variantes.map((v, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) => actualizarVariante(i, "color", e.target.value)}
                  className="input flex-1"
                />
                <input
                  placeholder="Talle"
                  value={v.talle}
                  onChange={(e) => actualizarVariante(i, "talle", e.target.value)}
                  className="input w-28"
                />
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

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-navy text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar producto"}
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
        }
        .input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #1f3864;
        }
      `}</style>
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
