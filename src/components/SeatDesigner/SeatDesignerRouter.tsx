"use client";

import dynamic from "next/dynamic";

const TheatreSeatDesigner = dynamic(() => import("./TheatreSeatDesigner"), { ssr: false });
const HotelSeatDesigner = dynamic(() => import("./HotelSeatDesigner"), { ssr: false });
const WeddingSeatDesigner = dynamic(() => import("./WeddingSeatDesigner"), { ssr: false });

export default function SeatDesignerRouter({
  eventId,
  layoutType,
}: {
  eventId: number;
  layoutType: string;
}) {
  if (layoutType === "hotel") {
    return <HotelSeatDesigner eventId={eventId} />;
  }

  if (layoutType === "wedding") {
    return <WeddingSeatDesigner eventId={eventId} />;
  }

  // default: theatre
  return <TheatreSeatDesigner eventId={eventId} />;
}
