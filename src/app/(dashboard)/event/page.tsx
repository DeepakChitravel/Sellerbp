import EventsFilter from "@/components/filters/events-filter";
import { DataTable } from "@/components/tables/events-table/data-table";
import { columns } from "@/components/tables/events-table/columns";
import { eventParams } from "@/types";
import { Button } from "@/components/ui/button";
import { Add } from "iconsax-react";
import { getAllEvents } from "@/lib/api/events";
import Link from "next/link";

const Events = async ({
  searchParams: { limit, page, q },
}: {
  searchParams: eventParams;
}) => {

  const data = await getAllEvents({
    limit,
    page,
    q,
  });

  console.log("EVENT DATA ===> ", data);

  return (
    <>
      <div className="flex items-center justify-between gap-5 mb-5">
        <h1 className="text-2xl font-bold">Events</h1>

        <Link href="/event/add">
          <Button variant="success">
            <span className="mobile_l:block hidden">Add Event</span>
            <span className="mobile_l:hidden block">
              <Add />
            </span>
          </Button>
        </Link>
      </div>

      <div className="space-y-5">
        <EventsFilter data={data.records} />
<DataTable columns={columns} data={data.records ?? []} />
        </div>
    </>
  );
};

export default Events;
