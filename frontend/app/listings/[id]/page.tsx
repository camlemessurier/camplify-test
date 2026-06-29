import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import BookingForm from "./BookingForm";
import MessagesSection from "./MessagesSection";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  let listing;
  try {
    listing = await api.fetchListing(Number(id));
  } catch {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header image area */}
      <div className="bg-gradient-to-br from-[#1e0c04] to-[#0a0604] border border-[#2a1a0c] rounded-lg h-52 flex items-center justify-center mb-10 relative">
        <span className="text-7xl opacity-50">🚐</span>
        <span className="absolute bottom-3 right-3 bg-[#c73d0f]/20 border border-[#c73d0f]/30 text-[#e05a28] text-xs px-3 py-1 rounded">
          🪔 Illumina lamp included
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Details */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1
              className="text-4xl font-bold text-[#faf6f2] mb-2 leading-tight"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              {listing.title}
            </h1>
            <p className="text-[#8c7b6e] flex items-center gap-1.5">
              📍 {listing.location}
            </p>
          </div>

          <div>
            <h2
              className="text-sm font-medium text-[#8c7b6e] uppercase tracking-widest mb-3"
            >
              About this rig
            </h2>
            <p className="text-[#d4c9be] leading-relaxed">{listing.description}</p>
          </div>

          <div className="bg-[#141009] border border-[#2a1a0c] rounded-lg p-4 flex items-center gap-3">
            <span className="text-2xl">🪔</span>
            <div>
              <p className="text-[#faf6f2] text-sm font-medium">Lampify Illumina camp lamp included</p>
              <p className="text-[#8c7b6e] text-xs">Fully charged, waterproof, 200+ lumens. Yours for the trip.</p>
            </div>
          </div>

          <div className="text-[#8c7b6e] text-sm">
            Listed by <span className="text-[#d4c9be]">{listing.owner.name}</span>
          </div>

          {/* Messages */}
          <div className="bg-[#141009] border border-[#2a1a0c] rounded-lg p-6">
            <h2
              className="text-lg font-semibold text-[#faf6f2] mb-4"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              Messages
            </h2>
            <MessagesSection listingId={listing.id} />
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#141009] border border-[#2a1a0c] rounded-lg p-6 sticky top-20">
            <div className="mb-5 pb-5 border-b border-[#2a1a0c]">
              <span className="text-[#f5a623] text-3xl font-bold">
                ${listing.price_per_day}
              </span>
              <span className="text-[#8c7b6e] text-sm"> / day</span>
            </div>
            <h2
              className="text-[#faf6f2] font-semibold mb-4"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              Request a booking
            </h2>
            <BookingForm listing={listing} />
          </div>
        </div>
      </div>
    </div>
  );
}
