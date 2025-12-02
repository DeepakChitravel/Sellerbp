import AreaForm from "@/components/forms/settings/available-areas/area-form";
import { getAvailableArea } from "@/lib/api/available-areas";
import { notFound } from "next/navigation";

const AvailableArea = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  let availableArea = null;
  if (id !== "add") availableArea = await getAvailableArea(id);

  // Validate the availableArea
  if (availableArea === false) return notFound();
  return (
    <div>
      <div className="mb-9 space-y-1.5">
        <h3 className="font-medium">Edit Available Area</h3>
        <p className="text-black/50 text-sm font-medium">
          Update the area and charges.
        </p>
      </div>

      <AreaForm isEdit={true} data={availableArea} />
    </div>
  );
};

export default AvailableArea;
