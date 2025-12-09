"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

export default function EventMap() {
  const { register } = useFormContext();

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold mb-3">Event Map Navigation</h2>
      <Input {...register("map_link")} placeholder="Google Maps link" />
    </div>
  );
}
