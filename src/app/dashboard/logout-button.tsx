"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-3 py-2 rounded-md text-sm text-white/70 hover:bg-white/10 hover:text-white"
    >
      Cerrar sesión
    </button>
  );
}
