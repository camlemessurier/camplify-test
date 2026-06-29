"use client";

import { useState } from "react";
import ListingCard from "@/components/ListingCard";
import type { RVListing } from "@/types";

export default function ListingsGrid({ listings }: { listings: RVListing[] }) {
  const [query, setQuery] = useState("");

  const filtered = listings.filter((l) =>
    l.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Filter by location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-72 px-4 py-2.5 rounded bg-[#141009] border border-[#2a1a0c] text-[#d4c9be] placeholder-[#8c7b6e] focus:outline-none focus:border-[#c73d0f] transition-colors text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-[#8c7b6e] py-12">
          No rigs in &quot;{query}&quot; — but they&apos;d probably come with a lamp.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </>
  );
}
