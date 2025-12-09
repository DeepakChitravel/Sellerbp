"use client";

import { useFormContext } from "react-hook-form";
import EventImageUpload from "./EventImageUpload";

export default function EventLogo() {
  const { watch, setValue } = useFormContext();

  const logo = watch("logo");

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold mb-3">Event Logo</h2>

      <EventImageUpload
        label="Upload Event Logo"
        value={logo}
        onChange={(file) => setValue("logo", file)}
      />
    </div>
  );
}
