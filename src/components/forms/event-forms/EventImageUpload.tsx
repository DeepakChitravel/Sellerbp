"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Props {
  value?: string | null;
  onChange: (file: string | null) => void;
  label?: string;
}

export default function EventImageUpload({ value, onChange, label }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to base64 (you can upload to server instead)
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {label && <label className="font-medium block mb-2">{label}</label>}

      {/* Preview Section */}
      {value ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />

          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileRef.current?.click()}
            >
              Change
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => onChange(null)}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        /* Upload placeholder */
        <div
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center h-40 cursor-pointer border rounded-lg bg-gray-50 hover:bg-gray-100"
        >
          <span className="text-gray-500">Click to upload</span>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
