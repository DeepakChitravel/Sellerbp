"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

export default function EventInfo() {
  const { register } = useFormContext();

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold mb-3">Event Info</h2>

      <Input {...register("category")} placeholder="Category" />
    </div>
  );
}
