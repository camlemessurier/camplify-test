import Link from "next/link";
import type { RVListing } from "@/types";

export default function ListingCard({ listing }: { listing: RVListing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block bg-[#141009] border border-[#2a1a0c] rounded-lg overflow-hidden hover:border-[#c73d0f]/50 transition-colors"
    >
      <div className="bg-gradient-to-br from-[#1e0c04] to-[#0a0604] h-36 flex items-center justify-center relative">
        <span className="text-4xl opacity-60 group-hover:opacity-80 transition-opacity">🚐</span>
        <span className="absolute bottom-2 right-2 bg-[#c73d0f]/20 border border-[#c73d0f]/30 text-[#e05a28] text-xs px-2 py-0.5 rounded">
          🪔 lamp incl.
        </span>
      </div>

      <div className="p-5">
        <h3
          className="text-[#faf6f2] font-semibold text-lg leading-snug mb-1 group-hover:text-white transition-colors"
          style={{ fontFamily: "var(--font-fraunces), serif" }}
        >
          {listing.title}
        </h3>
        <p className="text-[#8c7b6e] text-sm mb-3">
          📍 {listing.location}
        </p>
        <p className="text-[#8c7b6e] text-sm leading-relaxed mb-4 line-clamp-2">
          {listing.description}
        </p>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[#f5a623] text-xl font-bold">
              ${listing.price_per_day}
            </span>
            <span className="text-[#8c7b6e] text-xs"> /day</span>
          </div>
          <span className="text-[#8c7b6e] text-xs">by {listing.owner.name}</span>
        </div>
      </div>
    </Link>
  );
}
