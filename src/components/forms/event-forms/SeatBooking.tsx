"use client";

import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";

const layouts = [
  {
    id: "theatre",
    label: "Theatre Seating",
    image: "/images/seats/theatre.png",
  },
  {
    id: "hotel",
    label: "Hotel / Banquet Seating",
    image: "/images/seats/hotel.png",
  },
  {
    id: "wedding",
    label: "Wedding Seating",
    image: "/images/seats/wedding.png",
  },
];

export default function SeatBooking() {
  const router = useRouter();
  const { register, watch, setValue } = useFormContext();
  const selected = watch("seat_layout");

  const handleSelect = (layout: string) => {
    setValue("seat_layout", layout);

    // Redirect seller to the seat editor
    router.push(`/event/seat-builder?layout=${layout}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold mb-4">Seat Layout</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {layouts.map((item) => (
          <div
            key={item.id}
            className={`border rounded-xl p-4 cursor-pointer transition hover:shadow-md ${
              selected === item.id ? "border-purple-600 shadow-lg" : "border-gray-300"
            }`}
            onClick={() => handleSelect(item.id)}
          >
            <div className="flex items-center gap-3 mb-3">
              <input
                type="radio"
                value={item.id}
                {...register("seat_layout")}
                className="w-5 h-5 accent-purple-600"
                readOnly
              />
              <span className="font-medium text-lg">{item.label}</span>
            </div>

            <div className="relative h-32 w-full">
              <Image src={item.image} alt={item.label} fill className="object-contain rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
