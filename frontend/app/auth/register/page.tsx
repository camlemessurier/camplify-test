"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded bg-[#0a0604] border border-[#2a1a0c] focus:border-[#c73d0f] focus:outline-none text-[#d4c9be] placeholder-[#8c7b6e] transition-colors";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-[#141009] border border-[#2a1a0c] rounded-lg p-8 w-full max-w-md">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold text-[#faf6f2] mb-1"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Join Lampify
          </h1>
          <p className="text-[#8c7b6e] text-sm">List or hire rigs — lamp always included</p>
        </div>

        {error && (
          <div className="bg-[#1a0c0c] border border-[#f87171]/30 text-[#f87171] rounded p-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#8c7b6e] mb-1.5 uppercase tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-[#8c7b6e] mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-[#8c7b6e] mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={inputClass}
            />
            <p className="text-[#8c7b6e] text-xs mt-1.5">Minimum 8 characters</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c73d0f] hover:bg-[#e05a28] disabled:opacity-50 text-[#faf6f2] font-semibold py-2.5 rounded transition-colors mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-[#8c7b6e] text-sm text-center mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#f5a623] hover:text-[#e05a28] font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
