"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EventImageUpload from "./EventImageUpload";

export default function EventDetails() {
  const { register, setValue, watch } = useFormContext();

  const logo = watch("logo");
  const banner = watch("banner");

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="text-lg font-semibold mb-4">Event Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Title */}
        <div>
          <label className="font-medium">Event Title *</label>
          <Input {...register("title")} placeholder="Enter title" />
        </div>

        {/* Date */}
        <div>
          <label className="font-medium">Date *</label>
          <Input type="date" {...register("date")} />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="font-medium">Description</label>
          <Textarea rows={4} {...register("description")} />
        </div>

        {/* Logo */}
        <EventImageUpload
          label="Event Logo"
          value={logo}
          onChange={(file) => setValue("logo", file)}
        />

        {/* Banner */}
        <EventImageUpload
          label="Event Banner"
          value={banner}
          onChange={(file) => setValue("banner", file)}
        />

      </div>
    </div>
  );
}
