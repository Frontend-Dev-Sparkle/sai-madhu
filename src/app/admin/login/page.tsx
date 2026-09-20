"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  async function handleLogin() {
    setStatus("submitting");
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Incorrect email or password.");
      setStatus("idle");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-paper px-5 py-10 md:py-16 flex items-center justify-center">
      <section className="w-full max-w-sm mx-auto">
        <h1 className="font-display font-medium text-ink text-[22px] md:text-[26px]">
          Admin
        </h1>

        <p className="font-body text-ink-soft text-sm mb-8">
          Sign in to manage your batches and orders.
        </p>

        {/* Login Form */}
        <div className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="admin-email"
              className="block font-body text-[13px] font-semibold text-ink mb-2"
            >
              Email address
            </label>

            <input
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              type="email"
              className="w-full border border-line rounded-md px-3.5 py-3 bg-paper text-ink font-body text-sm outline-none transition-colors focus:border-forest"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="admin-password"
              className="block font-body text-[13px] font-semibold text-ink mb-2"
            >
              Password
            </label>

            <input
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Your password"
              type="password"
              className="w-full border border-line rounded-md px-3.5 py-3 bg-paper text-ink font-body text-sm outline-none transition-colors focus:border-forest"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-sm text-red-600 font-body">{error}</p>
        )}

        {/* Sign In Button */}
        <button
          type="button"
          onClick={handleLogin}
          disabled={status === "submitting"}
          className="w-full px-6 py-3 mt-7 rounded-sm bg-forest text-paper font-body font-medium text-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {status === "submitting" ? "Signing in..." : "Sign in"}
        </button>
      </section>
    </main>
  );
}
