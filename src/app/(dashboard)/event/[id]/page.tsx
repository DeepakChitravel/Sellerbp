import EventForm from "@/components/forms/event-form";
import { getEvent } from "@/lib/api/events";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

const EventPage = async ({ params: { id } }) => {
  const userId = cookies().get("user_id")?.value;

  if (!userId) return notFound();

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
        userId={Number(userId)}   // ⭐ Now REAL user ID
      />
    </>
  );
};

export default EventPage;
