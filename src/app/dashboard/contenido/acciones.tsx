"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContenidoAcciones({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"APROBADO" | "RECHAZADO" | null>(null);

  async function decidir(estado: "APROBADO" | "RECHAZADO") {
    setLoading(estado);
    await fetch(`/api/contenido/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    router.refresh();
    setLoading(null);
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => decidir("APROBADO")}
        disabled={loading !== null}
        className="text-sm font-semibold text-green-700 border border-green-300 rounded-md px-3 py-1.5 hover:bg-green-50 disabled:opacity-50"
      >
        {loading === "APROBADO" ? "..." : "Aprobar"}
      </button>
      <button
        onClick={() => decidir("RECHAZADO")}
        disabled={loading !== null}
        className="text-sm font-semibold text-red-600 border border-red-300 rounded-md px-3 py-1.5 hover:bg-red-50 disabled:opacity-50"
      >
        {loading === "RECHAZADO" ? "..." : "Rechazar"}
      </button>
    </div>
  );
}
