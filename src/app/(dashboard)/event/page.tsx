import EventsFilter from "@/components/filters/events-filter";
import { DataTable } from "@/components/tables/events-table/data-table";
import { columns } from "@/components/tables/events-table/columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Add } from "iconsax-react";

export const dynamic = "force-dynamic";   // 🔥 prevents caching completely
export const revalidate = 0;              // 🔥 ensures fresh data on every load

export default async function EventsPage() {
  // 🔥 ALWAYS fetch fresh — no cache!
  const response = await fetch(
    "http://localhost/managerbp/public/seller/events/get.php",
    {
      method: "GET",
      cache: "no-store",
    }
  ).then((res) => res.json());

  const events = response?.success ? response.data : [];

  console.log("EVENTS => ", events);

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
        <DataTable columns={columns} data={events} />
      </div>
    </>
  );
}
