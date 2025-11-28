import CustomerCard from "@/components/cards/customer-detail/customer-card";
import AppointmentFilters from "@/components/filters/appointments-filter";
import { columns } from "@/components/tables/appointments-table/columns";
import { DataTable } from "@/components/tables/appointments-table/data-table";
import { getAllAppointments } from "@/lib/api/appointments";
import { getCustomer } from "@/lib/api/customers";
import { appointmentsParams } from "@/types";
import { notFound } from "next/navigation";
import React from "react";

const Customer = async ({
  params: { id },
  searchParams: {
    limit,
    page,
    q,
    status,
    paymentStatus,
    paymentMethod,
    fromDate,
    toDate,
  },
}: {
  params: { id: string };
  searchParams: appointmentsParams;
}) => {
  const customer = await getCustomer(parseInt(id));
  // Validate the customer
  if (customer === false) return notFound();

  const appointments = await getAllAppointments({
    limit,
    page,
    q,
    status,
    paymentStatus,
    paymentMethod,
    customerId: parseInt(customer.id),
    fromDate,
    toDate,
  });

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="lg:col-span-5 3xl:col-span-4 4xl:col-span-3 col-span-12">
        <CustomerCard customer={customer} />
      </div>

      <div className="col-span-12 lg:col-span-7 3xl:col-span-8 4xl:col-span-9">
        <div className="space-y-5">
          <AppointmentFilters data={appointments.records} />
          <DataTable columns={columns} data={appointments} />
        </div>
      </div>
    </div>
  );
};

export default Customer;
