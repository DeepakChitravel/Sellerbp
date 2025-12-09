"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/input";

export default function EventImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (file: string | null) => void;
}) {
  const handleUpload = useCallback((e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    onChange(url);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium">{label}</label>
      <Input type="file" accept="image/*" onChange={handleUpload} />

      {value && (
        <img
          src={value}
          alt={label}
          className="w-full h-40 object-cover rounded-lg border"
        />
      )}
    </div>
  );
}
