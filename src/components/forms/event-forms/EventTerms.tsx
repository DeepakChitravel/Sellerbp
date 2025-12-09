"use client";

import { useFormContext } from "react-hook-form";
import RichTextEditor from "./RichTextEditor"; // ⭐ Make sure this file exists

export default function EventTerms() {
  const { register } = useFormContext();

  return (
    <div className="bg-white p-6 rounded-xl border">

      {/* Replace textarea with the advanced editor */}
      <RichTextEditor
        name="terms"
        label="Terms & Conditions"
      />
    </div>
  );
}
