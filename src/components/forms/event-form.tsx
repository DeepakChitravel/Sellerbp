"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { eventSchema, EventFormData } from "./event-forms/schema";

// Sections
import EventDetails from "./event-forms/EventDetails";
import EventOrganizer from "./event-forms/EventOrganizer";
import EventLocation from "./event-forms/EventLocation";
import EventInfo from "./event-forms/EventInfo";
import EventComfort from "./event-forms/EventComfort";
import EventMap from "./event-forms/EventMap";
import EventThingsToKnow from "./event-forms/EventThingsToKnow";
import EventTerms from "./event-forms/EventTerms";
import EventVideos from "./event-forms/EventVideos";
import SeatBooking from "./event-forms/SeatBooking";

interface EventFormProps {
  eventData?: Partial<EventFormData> | null;
  isEdit?: boolean;
}

export default function EventForm({ eventData = null, isEdit = false }: EventFormProps) {
  const methods = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: eventData || {},
  });

  const onSubmit = (values: EventFormData) => {
    console.log("EVENT FORM SUBMIT =>", values);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-10">

        {/* ⭐ ROW 1 → Event Details + Organizer */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6"><EventDetails /></div>
          <div className="col-span-12 lg:col-span-6"><EventOrganizer /></div>
        </div>

        {/* ⭐ ROW 2 → Event Location + Event Info */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6"><EventLocation /></div>
          <div className="col-span-12 lg:col-span-6"><EventInfo /></div>
        </div>

        {/* ⭐ ROW 3 → Comfort + Map */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6"><EventComfort /></div>
          <div className="col-span-12 lg:col-span-6"><EventMap /></div>
        </div>

        {/* ⭐ ROW 4 → Things to Know + Terms */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6"><EventThingsToKnow /></div>
          <div className="col-span-12 lg:col-span-6"><EventTerms /></div>
        </div>

        {/* ⭐ ROW 5 → Videos (Full Width) */}
        <EventVideos />
<SeatBooking />

        {/* Submit Button */}
        <div className="flex justify-end pt-10">
          <Button className="px-10" type="submit">
            {isEdit ? "Update Event" : "Create Event"}
          </Button>
        </div>

      </form>
    </FormProvider>
  );
}
