import ServiceForm from "@/components/forms/service-form";
import { getService } from "@/lib/api/services";
import { notFound } from "next/navigation";

const Service = async ({ params: { id } }: { params: { id: string } }) => {
  let service = null;

  // Only fetch when editing
  if (id !== "add") {
    service = await getService(id);

    if (!service || service.success === false) {
      return notFound();
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-5">
        {id === "add" ? "Add" : "Edit"} Service
      </h1>

      <ServiceForm
        serviceId={id}
        serviceData={id === "add" ? null : service.data}   // 🔥 handle add/edit correctly
        isEdit={id !== "add"}
      />
    </>
  );
};

export default Service;
