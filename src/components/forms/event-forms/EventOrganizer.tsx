"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

export default function EventOrganizer() {
  const { register } = useFormContext();

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold mb-3">Organizer Details</h2>

      <label className="font-medium">Organizer Name *</label>
      <Input {...register("organizer")} placeholder="Organizer name" />
    </div>
  );
}
