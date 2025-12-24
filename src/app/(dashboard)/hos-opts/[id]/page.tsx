import Doctor_Schedule from "@/components/forms/doctor-form";
import { fetchDoctorsClient } from "@/lib/api/doctor_schedule";
import { notFound } from "next/navigation";

const Service = async ({ params: { id } }: { params: { id: string } }) => {
  let service = null;

  if (id !== "add") {
    service = await getService(id);

    if (!service || service.success === false) {
      return notFound();
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-5">
        {id === "add" ? "Add" : "Edit"} Doctor Schedule
      </h1>

      <Doctor_Schedule
        serviceId={id}
        serviceData={id === "add" ? null : service.data}
        isEdit={id !== "add"}
      />
    </>
  );
};

export default Service;
