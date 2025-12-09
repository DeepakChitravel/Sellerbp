"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

export default function EventTerms() {
  const { register } = useFormContext();

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold mb-3">Terms & Conditions</h2>
      <Textarea {...register("terms")} placeholder="Enter terms here" />
    </div>
  );
}
