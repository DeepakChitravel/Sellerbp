import EventsFilter from "@/components/filters/events-filter";
import { DataTable } from "@/components/tables/events-table/data-table";
import { columns } from "@/components/tables/events-table/columns";
import { getAllEvents } from "@/lib/api/events";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Add } from "iconsax-react";

export default async function Events() {

  const response = await getAllEvents();

  // FIX: use "data" instead of "records"
  const events = response?.success ? response.data : [];

  console.log("EVENTS FROM API ===> ", events);

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Events</h1>

        <Link href="/event/add">
          <Button variant="success">
            Add Event <Add className="ml-2" />
          </Button>
        </Link>
      </div>

      <div className="space-y-5">
        <EventsFilter data={events} />
        <DataTable columns={columns} data={events} />   {/* FIXED */}
      </div>
    </>
  );
}
