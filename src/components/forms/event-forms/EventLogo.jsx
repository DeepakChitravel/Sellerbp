"use client";

import { useFormContext } from "react-hook-form";
import EventImageUpload from "./EventImageUpload";
import { uploadEventImage } from "@/lib/api/events";

export default function EventLogo({ userId }) {
  const { watch, setValue } = useFormContext();
  const logo = watch("logo");

  const handleUpload = async (file) => {
    if (!file) return setValue("logo", null);

    const res = await uploadEventImage(file, "logo", userId);

    if (res?.success) {
      setValue("logo", res.url); // REAL saved URL
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="font-semibold mb-4 text-lg">Event Logo</h2>

      <EventImageUpload
        label="Upload Event Logo"
        value={logo}
        height="h-40"
        onChange={handleUpload}
      />
    </div>
  );
}
