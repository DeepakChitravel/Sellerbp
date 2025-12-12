"use client";

import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const layouts = [
  {
    id: "theatre",
    label: "Theatre Seating",
    image: "/images/seats/theatre.webp",
    desc: "Ideal for concerts, performances & large gatherings.",
  },
  {
    id: "hotel",
    label: "Hotel / Banquet Seating",
    image: "/images/seats/hotel.webp",
    desc: "Suitable for corporate events, meetings & banquets.",
  },
  {
    id: "wedding",
    label: "Wedding Seating",
    image: "/images/seats/wedding.webp",
    desc: "Perfect for ceremonies & special celebrations.",
  },
];

export default function SeatBooking({
  eventId,
  savedLayout,    // ← NEW PROP
}: {
  eventId: number;
  savedLayout?: string;
}) {
  const router = useRouter();
  const { watch, setValue } = useFormContext();
  const selected = watch("seat_layout");

  const [loadingLayout, setLoadingLayout] = useState<string | null>(null);

  const handleSelect = (layout: string) => {
    if (!eventId) {
      alert("❌ No eventId found — cannot open seat builder");
      return;
    }

    setLoadingLayout(layout);
    setValue("seat_layout", layout, { shouldValidate: true });

    setTimeout(() => {
      router.push(`/event/seat-builder?eventId=${eventId}&layout=${layout}`);
    }, 600);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <h2 className="font-semibold text-xl mb-6">Seat Layout</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {layouts.map((item) => {
          const active = selected === item.id;
          const isSaved = savedLayout === item.id;
          const loading = loadingLayout === item.id;

          return (
            <div
              key={item.id}
              onClick={() => !loading && handleSelect(item.id)}
              className={`
                group cursor-pointer rounded-2xl border p-5 transition-all relative

                ${active 
                  ? "border-purple-600 bg-purple-50 shadow-md" 
                  : isSaved
                    ? "border-green-600 bg-green-50 shadow-md"
                    : "border-gray-200 bg-white"
                }

                ${loading ? "opacity-50 pointer-events-none" : "hover:shadow-lg hover:-translate-y-1"}
              `}
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent"></div>
                </div>
              )}

              <h3 className="font-semibold text-lg mb-2">{item.label}</h3>
              <p className="text-sm text-gray-600 mb-4">{item.desc}</p>

              <div className="relative h-32 w-full rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <button
                className={`
                  mt-4 w-full py-2 rounded-lg font-medium transition-all
                  ${active 
                    ? "bg-purple-600 text-white" 
                    : isSaved
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 group-hover:bg-purple-100"
                  }
                `}
              >
                {active ? "Selected" : isSaved ? "Saved Layout" : "Choose Layout"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
