"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav className="border-b border-[#2a1a0c] bg-[#0a0604]/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg">🪔</span>
            <span
              className="text-xl font-bold text-[#faf6f2] tracking-tight"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              Lampify
            </span>
          </Link>

          <div className="flex items-center gap-5">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-[#8c7b6e] hidden sm:block">
                  {user?.name}
                </span>
                <Link
                  href="/bookings"
                  className="text-sm text-[#d4c9be] hover:text-[#faf6f2] transition-colors"
                >
                  My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-[#8c7b6e] hover:text-[#c73d0f] transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-[#d4c9be] hover:text-[#faf6f2] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-[#c73d0f] hover:bg-[#e05a28] text-[#faf6f2] text-sm font-medium px-4 py-1.5 rounded transition-colors"
                >
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
