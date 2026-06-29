"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import type { RVListing } from "@/types";
import Link from "next/link";

export default function BookingForm({ listing }: { listing: RVListing }) {
  const { user, isAuthenticated } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isOwner = user?.id === listing.owner.id;

  if (!isAuthenticated) {
    return (
      <div className="text-center py-2">
        <p className="text-[#8c7b6e] text-sm mb-3">Sign in to book this rig</p>
        <Link
          href="/auth/login"
          className="inline-block bg-[#c73d0f] hover:bg-[#e05a28] text-[#faf6f2] text-sm font-medium px-5 py-2 rounded transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (isOwner) {
    return (
      <p className="text-[#8c7b6e] text-sm text-center py-2">
        This is your listing.
      </p>
    );
  }

  if (success) {
    return (
      <div className="bg-[#0c1a0c] border border-[#4ade80]/30 rounded p-4 text-center">
        <p className="text-[#4ade80] text-sm font-medium">Request sent!</p>
        <p className="text-[#8c7b6e] text-xs mt-1">The owner will confirm shortly. Don't forget — lamp's included.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.createBooking(listing.id, { start_date: startDate, end_date: endDate });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded bg-[#0a0604] border border-[#2a1a0c] focus:border-[#c73d0f] focus:outline-none text-[#d4c9be] text-sm transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-[#1a0c0c] border border-[#f87171]/30 text-[#f87171] rounded p-3 text-xs">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs text-[#8c7b6e] mb-1.5 uppercase tracking-wide">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          min={new Date().toISOString().split("T")[0]}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-xs text-[#8c7b6e] mb-1.5 uppercase tracking-wide">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          min={startDate || new Date().toISOString().split("T")[0]}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#c73d0f] hover:bg-[#e05a28] disabled:opacity-50 text-[#faf6f2] font-medium py-2.5 rounded transition-colors"
      >
        {loading ? "Sending..." : "Request Booking"}
      </button>
    </form>
  );
}
