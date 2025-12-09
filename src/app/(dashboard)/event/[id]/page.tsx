import EventForm from "@/components/forms/event-form";
import { getEvent } from "@/lib/api/events";
import { notFound } from "next/navigation";

const EventPage = async ({ params: { id } }: { params: { id: string } }) => {
  let event = null;

  if (id !== "add") {
    event = await getEvent(id);
    if (!event || event.success === false) return notFound();
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-5">
        {id === "add" ? "Add" : "Edit"} Event
      </h1>

      <EventForm
        eventId={id}
        eventData={id === "add" ? null : event.data}
        isEdit={id !== "add"}
      />
    </>
  );
};

export default EventPage;
