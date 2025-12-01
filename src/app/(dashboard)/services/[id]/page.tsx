import ServiceForm from "@/components/forms/service-form";
import { getService } from "@/lib/api/services";
import { notFound } from "next/navigation";

const Service = async ({ params: { id } }: { params: { id: string } }) => {
  let service = null;
  if (id !== "add") service = await getService(id);

  // Validate the service
  if (service === false) return notFound();
  return (
    <>
      <h1 className="text-2xl font-bold mb-5">
        {id === "add" ? "Add" : "Edit"} Service
      </h1>

      <ServiceForm
        serviceId={id}
        serviceData={service}
        isEdit={service && true}
      />
    </>
  );
};

export default Service;
