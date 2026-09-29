"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NuevaCategoriaForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo crear la categoría.");
      setLoading(false);
      return;
    }
    setNombre("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start">
      <div className="flex-1">
        <input
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la categoría (ej: Gorras)"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
        />
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-navy text-white text-sm font-semibold px-4 py-2 hover:opacity-90 disabled:opacity-60 shrink-0"
      >
        {loading ? "Agregando..." : "+ Agregar"}
      </button>
    </form>
  );
}

export function CategoriaAcciones({ id, nombre }: { id: string; nombre: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`¿Eliminar la categoría "${nombre}"?`)) return;
    setLoading(true);
    const res = await fetch(`/api/categorias/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "No se pudo eliminar.");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      Eliminar
    </button>
  );
}
