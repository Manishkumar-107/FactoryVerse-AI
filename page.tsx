"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link f"urom "next/link";
import { useRouter } from "next/navigation";
import { Factory, Lock, Mail, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(email, password);
      sessionStorage.setItem("fv_token", res.token);
      sessionStorage.setItem("fv_name", res.name);
      router.push("/dashboard");
    } catch {
      setError("Couldn't sign in with those details. Check them and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />

      {/* ambient scanning line */}
      <motion.div
        className="pointer-events-none absolute left-0 right-0 h-px bg-signal-teal/40"
        initial={{ top: "0%" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-sm rounded-xl border border-base-600 bg-base-800/80 p-8 shadow-panel backdrop-blur"
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-signal-teal/10 text-signal-teal">
            <Factory size={20} />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold tracking-wide text-ink-100">
              FactoryVerse
            </h1>
            <p className="text-xs text-ink-500">Plant operations console</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Email"
            icon={<Mail size={16} />}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@plant.com"
          />
          <Field
            label="Password"
            icon={<Lock size={16} />}
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
          />

          {error && (
            <p role="alert" className="text-sm text-signal-red">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-signal-teal py-2.5 font-medium text-base-950 transition hover:brightness-110 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Signing in" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          New to the plant?{" "}
          <Link href="/register" className="text-signal-teal hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

function Field({
  label,
  icon,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-500">
        {label}
      </span>
      <div className="flex items-center gap-2 rounded-lg border border-base-600 bg-base-900 px-3 py-2 focus-within:border-signal-teal">
        <span className="text-ink-500">{icon}</span>
        <input
          required
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-ink-100 outline-none placeholder:text-ink-500/60"
        />
      </div>
    </label>
  );
}
