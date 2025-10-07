// frontend/src/pages/Home.tsx
import { useEffect, useState } from "react";
import Translator from "../components/Translator";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api";

export default function Home() {
  const { logout } = useAuth();
  const [apiHealthy, setApiHealthy] = useState<"checking" | "ok" | "down">("checking");

  // Optional: simple health check to verify backend connectivity with token
  useEffect(() => {
    (async () => {
      try {
        // hit a harmless endpoint; if you don't have /docs.json, you can create /health in FastAPI
        await api("/health");
        setApiHealthy("ok");
      } catch {
        setApiHealthy("down");
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">🌐 (NMT) Agent — Dashboard</h1>
          <p className="text-sm text-gray-500">
            Translate, rate, and improve models via feedback.
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded bg-gray-800 text-white px-3 py-2 hover:bg-gray-700"
          title="Sign out"
        >
          Logout
        </button>
      </header>

      {apiHealthy !== "ok" && (
        <div
          className={`mb-4 rounded border px-3 py-2 text-sm ${
            apiHealthy === "down"
              ? "border-red-400 bg-red-50 text-red-700"
              : "border-yellow-300 bg-yellow-50 text-yellow-700"
          }`}
        >
          {apiHealthy === "checking"
            ? "Checking backend connectivity…"
            : "Cannot reach backend. Ensure the FastAPI server is running and VITE_API_URL is set."}
        </div>
      )}

      {/* Your existing Translator component (it can keep using fetch,
          or you can swap to the api() helper inside that component). */}
      <Translator />

      <section className="mt-8">
        <h2 className="font-semibold mb-2">Tips</h2>
        <ul className="list-disc pl-5 text-sm text-gray-600">
          <li>
            After translating, rate the output and add a correction—your feedback will queue for
            nightly fine-tuning.
          </li>
          <li>
            If the Translate button hangs, confirm FastAPI at <code>VITE_API_URL</code> and token
            validity (re-login if needed).
          </li>
        </ul>
      </section>
    </div>
  );
}
