import { api } from "@/lib/api";
import ListingsGrid from "./ListingsGrid";
import type { RVListing } from "@/types";

export const revalidate = 60;

export default async function HomePage() {
  let listings: RVListing[] = [];
  try {
    listings = await api.fetchListings();
  } catch {
    // API may not be running in build/preview
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#2a1a0c]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e0c04] via-[#0a0604] to-[#0a0604]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c73d0f]/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <p className="text-[#c73d0f] text-sm font-medium tracking-widest uppercase mb-4">
              🪔 Every rental includes a lamp
            </p>
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#faf6f2] leading-[1.05] mb-6"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              Hit the road.<br />
              We bring<br />
              the light.
            </h1>
            <p className="text-[#8c7b6e] text-lg leading-relaxed mb-8 max-w-lg">
              Lampify connects you with RV owners across Australia. Every single
              hire comes with our signature Illumina camp lamp — because a dark
              campsite is a sad campsite.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#listings"
                className="inline-block bg-[#c73d0f] hover:bg-[#e05a28] text-[#faf6f2] font-medium px-6 py-3 rounded transition-colors"
              >
                Browse RVs
              </a>
              <span className="text-[#8c7b6e] text-sm">
                No lamp upsells. No lamp fees. Just lamps.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lamp callout strip */}
      <div className="border-b border-[#2a1a0c] bg-[#141009]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-6 text-sm text-[#8c7b6e]">
            <span>🪔 Illumina lamp in every van</span>
            <span>🔋 Fully charged on pickup</span>
            <span>✦ 200+ lumen output</span>
            <span>✦ Waterproof, naturally</span>
          </div>
        </div>
      </div>

      {/* Listings */}
      <section id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2
            className="text-3xl font-bold text-[#faf6f2] mb-2"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Available rigs
          </h2>
          <p className="text-[#8c7b6e]">Every one comes with a lamp. We cannot stress this enough.</p>
        </div>
        <ListingsGrid listings={listings} />
      </section>
    </div>
  );
}
