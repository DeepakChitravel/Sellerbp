"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { apiUrl } from "@/config";

export default function EventImageUpload({
  label,
  value,
  onChange,
  height = "h-40",
}) {
  const inputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(file);
  };

  // Correct preview URL
  const src =
    value && value.startsWith("/uploads")
      ? `${apiUrl}${value}`
      : value;

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium">{label}</label>

      {!value ? (
        <div
          onClick={() => inputRef.current?.click()}
          className={`w-full ${height} flex flex-col items-center justify-center 
          border-2 border-dashed rounded-xl cursor-pointer bg-indigo-50/20
          hover:border-indigo-500 hover:bg-indigo-100 transition`}
        >
          <Upload size={28} className="text-gray-500 mb-2" />
          <p className="text-gray-600 text-sm font-medium">Click to upload image</p>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      ) : (
        <div className={`relative w-full ${height}`}>
          <div className="w-full h-full rounded-xl border bg-white overflow-hidden flex items-center justify-center">
            <img
              src={src}
              alt={label}
              className="max-w-full max-h-full object-contain p-2"
            />
          </div>

          {/* Replace button */}
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-3 py-1 rounded-lg hover:bg-black/80 transition"
          >
            Replace
          </button>

          {/* Delete button */}
          <button
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1 shadow hover:bg-red-100 transition"
          >
            <X size={15} />
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      )}
    </div>
  );
}
