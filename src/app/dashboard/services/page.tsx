import ServicesFilter from "@/components/filters/services-filter";
import { DataTable } from "@/components/tables/services-table/data-table";
import { columns } from "@/components/tables/services-table/columns";
import { servicesParams } from "@/types";
import { Add } from "iconsax-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllServices } from "@/lib/api/services";

const Services = async ({
  searchParams: { limit, page, q },
}: {
  searchParams: servicesParams;
}) => {
  const data = await getAllServices({
    limit,
    page,
    q,
  });

  return (
    <>
      <div className="flex items-center justify-between gap-5 mb-5">
        <h1 className="text-2xl font-bold">Services</h1>

        <Link href="/dashboard/services/add">
          <Button variant="success">
            <span className="mobile_l:block hidden">Add Service</span>
            <span className="mobile_l:hidden block">
              <Add />
            </span>
          </Button>
        </Link>
      </div>

      <div className="space-y-5">
        <ServicesFilter />
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default Services;
