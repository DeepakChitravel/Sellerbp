"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

export default function EventThingsToKnow() {
  const { register } = useFormContext();

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold mb-3">Things to Know</h2>
      <Textarea
        {...register("things_to_know")}
        placeholder="List things to know before attending"
      />
    </div>
  );
}
