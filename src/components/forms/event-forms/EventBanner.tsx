"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";

export default function EventBanner() {
  const { setValue, watch } = useFormContext();
  const banner = watch("banner");

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setValue("banner", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeBanner = () => setValue("banner", "");

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold mb-3">Event Banner</h2>

      {/* Preview */}
      {banner ? (
        <div className="space-y-4">
          <img
            src={banner}
            alt="Event Banner"
            className="rounded-lg w-full h-48 object-cover border"
          />

          <Button variant="destructive" onClick={removeBanner} type="button">
            Remove Banner
          </Button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer">
          <p className="text-gray-600">Click to upload banner</p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      )}
    </div>
  );
}
