"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

export default function EventComfort() {
  const { register } = useFormContext();

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold mb-3">Comfort & Features</h2>

      <Textarea
        {...register("comfort")}
        placeholder="Enter comfort items (comma-separated)"
      />
    </div>
  );
}
