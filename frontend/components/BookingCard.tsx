"use client";

import StatusBadge from "./StatusBadge";
import type { Booking } from "@/types";

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
  onConfirm?: (id: number) => void;
  onReject?: (id: number) => void;
}

export default function BookingCard({
  booking,
  showActions = false,
  onConfirm,
  onReject,
}: BookingCardProps) {
  return (
    <div className="bg-[#141009] border border-[#2a1a0c] rounded-lg p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3
            className="text-[#faf6f2] font-semibold"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            {booking.rv_listing.title}
          </h3>
          <p className="text-[#8c7b6e] text-sm">{booking.rv_listing.location}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <p className="text-sm text-[#8c7b6e] mb-1">
        <span className="text-[#d4c9be]">Dates:</span>{" "}
        {new Date(booking.start_date).toLocaleDateString()} →{" "}
        {new Date(booking.end_date).toLocaleDateString()}
      </p>

      {booking.hirer && (
        <p className="text-sm text-[#8c7b6e] mb-3">
          <span className="text-[#d4c9be]">Hirer:</span> {booking.hirer.name}
        </p>
      )}

      {showActions && booking.status === "pending" && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onConfirm?.(booking.id)}
            className="flex-1 bg-[#0c1a0c] border border-[#4ade80]/30 hover:border-[#4ade80] text-[#4ade80] text-sm font-medium py-2 rounded transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => onReject?.(booking.id)}
            className="flex-1 bg-[#1a0c0c] border border-[#f87171]/30 hover:border-[#f87171] text-[#f87171] text-sm font-medium py-2 rounded transition-colors"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
