import CustomersFilter from "@/components/filters/customers-filter";
import { DataTable } from "@/components/tables/customers-table/data-table";
import { columns } from "@/components/tables/customers-table/columns";
import { Customer, customerParams } from "@/types";
import { getAllCustomers } from "@/lib/api/customers";

const Customers = async ({
  searchParams: { limit, page, q },
}: {
  searchParams: customerParams;
}) => {
  const data = await getAllCustomers({
    limit,
    page,
    q,
  });

  return (
    <>
      <h1 className="text-2xl font-bold mb-5">Customers</h1>

      <div className="space-y-5">
        <CustomersFilter data={data.records} />
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default Customers;
