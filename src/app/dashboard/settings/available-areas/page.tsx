import AvailableAreaCard from "@/components/cards/available-area-card";
import AreaForm from "@/components/forms/settings/available-areas/area-form";
import { getAllAvailableAreas } from "@/lib/api/available-areas";
import { availableArea } from "@/types";

const colors = [
  "green",
  "blue",
  "yellow",
  "rose",
  "orange",
  "lime",
  "teal",
  "indigo",
  "cyan",
  "purple",
];

const SettingsAvailableAreas = async () => {
  const availableAreas = await getAllAvailableAreas({
    limit: 999,
  });

  return (
    <div>
      <div>
        <div className="mb-9 space-y-1.5">
          <h3 className="font-medium">Available Areas</h3>
          <p className="text-black/50 text-sm font-medium">
            Add the areas where you provide your services.
          </p>
        </div>

        <AreaForm />
      </div>

      {/* Available Areas */}
      <div className="mt-8 pt-8 border-t">
        <div className="mb-9 space-y-1.5">
          <h3 className="font-medium">Available Areas</h3>
          <p className="text-black/50 text-sm font-medium">
            Edit/Delete available areas for your service.
          </p>
        </div>

        <div className="grid gap-6">
          {availableAreas.records.map((area: availableArea, index: number) => (
            <AvailableAreaCard
              key={index}
              data={area}
              color={colors[index % colors.length]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsAvailableAreas;
