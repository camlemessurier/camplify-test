"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import BookingCard from "@/components/BookingCard";
import type { Booking } from "@/types";

export default function BookingsPage() {
  const { isAuthenticated, initializing } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"hirer" | "owner">("hirer");
  const [hirerBookings, setHirerBookings] = useState<Booking[]>([]);
  const [ownerBookings, setOwnerBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, initializing, router]);

  const fetchAll = useCallback(async () => {
    try {
      const [hirer, owner] = await Promise.all([
        api.fetchBookingsAsHirer(),
        api.fetchBookingsAsOwner(),
      ]);
      setHirerBookings(hirer);
      setOwnerBookings(owner);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchAll();
  }, [isAuthenticated, fetchAll]);

  if (initializing) return null;
  if (!isAuthenticated) return null;

  const handleConfirm = async (id: number) => {
    await api.confirmBooking(id);
    await fetchAll();
  };

  const handleReject = async (id: number) => {
    await api.rejectBooking(id);
    await fetchAll();
  };

  const tabs = [
    { key: "hirer" as const, label: "My Rentals" },
    { key: "owner" as const, label: "My Listings' Bookings" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1
        className="text-3xl font-bold text-[#faf6f2] mb-8"
        style={{ fontFamily: "var(--font-fraunces), serif" }}
      >
        My Bookings
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-[#2a1a0c] mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? "border-[#c73d0f] text-[#faf6f2]"
                : "border-transparent text-[#8c7b6e] hover:text-[#d4c9be]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[#8c7b6e] text-center py-12">Loading...</p>
      ) : tab === "hirer" ? (
        hirerBookings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#8c7b6e] mb-2">No rentals yet.</p>
            <p className="text-[#8c7b6e] text-sm">
              Find a rig — every one comes with a lamp.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {hirerBookings.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )
      ) : ownerBookings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#8c7b6e] mb-2">No bookings on your listings yet.</p>
          <p className="text-[#8c7b6e] text-sm">When someone requests a booking, it'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ownerBookings.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              showActions
              onConfirm={handleConfirm}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
