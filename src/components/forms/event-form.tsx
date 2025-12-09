"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { eventSchema, EventFormData } from "./event-forms/schema";

// API
import { addEvent, updateEvent } from "@/lib/api/events";

// Sections
import EventDetails from "./event-forms/EventDetails";
import EventLocation from "./event-forms/EventLocation";
import EventBanner from "./event-forms/EventBanner";
import EventTerms from "./event-forms/EventTerms";
import SeatBooking from "./event-forms/SeatBooking";

interface EventFormProps {
  eventId?: number | string;
  eventData?: Partial<EventFormData> | null;
  isEdit?: boolean;
  userId: number; // ⭐ required
}

/* ---------------- SAFE ARRAY ---------------- */
function safeArray(value: any) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch (_) {}
  if (typeof value === "string" && value.includes(",")) {
    return value.split(",").map((v) => v.trim());
  }
  if (typeof value === "string") return [value.trim()];
  return [];
}

export default function EventForm({ eventData = null, isEdit = false, eventId, userId }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // ⭐ prevents double submit

  const methods = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: eventData?.title || "",
      description: eventData?.description || "",
      date: eventData?.date || "",
      organizer: eventData?.organizer || "",
      category: eventData?.category || "",
      info: eventData?.info || "",
      comfort: eventData?.comfort || "",
      things_to_know: safeArray(eventData?.things_to_know),
      videos: safeArray(eventData?.videos),
      logo: eventData?.logo || "",
      banner: eventData?.banner || "",
      country: eventData?.country || "",
      state: eventData?.state || "",
      city: eventData?.city || "",
      pincode: eventData?.pincode || "",
      address: eventData?.address || "",
      map_link: eventData?.map_link || "",
      terms: eventData?.terms || "",
      seat_layout: eventData?.seat_layout || "",
    },
  });

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (values: EventFormData) => {
    if (loading) return; // ⛔ stop double submit
    setLoading(true);

    try {
      const payload = {
        ...values,
        user_id: userId, // ⭐ important
      };

      console.log("PAYLOAD SENDING:", payload);

      const response = isEdit
        ? await updateEvent(eventId as string, payload)
        : await addEvent(payload);

      if (!response?.success) {
        toast.error(response?.message || "Something went wrong.");
        setLoading(false);
        return;
      }

      toast.success(isEdit ? "Event updated successfully!" : "Event created successfully!");

      if (!isEdit) {
        router.push(`/event?refresh=${Date.now()}`);
      }

    } catch (error: any) {
      toast.error(error.message || "Unexpected error!");
    }

    setLoading(false);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(
          onSubmit,
          (errors) => {
            const firstError = Object.values(errors)[0]?.message || "Please fill required fields";
            toast.error(firstError);
          }
        )}
        className="space-y-10"
      >

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <EventDetails />
          </div>

          <div className="col-span-12 lg:col-span-6 space-y-6">
            <EventLocation />
            <EventBanner />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <EventTerms />
          </div>
        </div>

        <SeatBooking />

        <div className="flex justify-end pt-10">
          <Button className="px-10" type="submit" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
          </Button>
        </div>

      </form>
    </FormProvider>
  );
}
