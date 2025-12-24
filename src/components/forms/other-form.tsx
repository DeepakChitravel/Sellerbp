"use client";

import { useState } from "react";
import { Button } from "../ui/button";

import OtherImages from "./other-forms/other-images";
import OtherDetails from "./other-forms/other-details";
import OtherSchedule from "./other-forms/other-schedule";
import { toast } from "sonner";

type Props = {
  department: any;
};

const OtherForm = ({ department }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  // ============================
  // SAVE
  // ============================
  const handleSave = async () => {
    try {
      setIsLoading(true);

      // 👉 Add your save API call here
      // const resp = await someSaveFunction(department);

      toast.success("Saved successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OtherImages department={department} />
        <OtherDetails department={department} />
      </div>

      {/* Weekly Appointment Schedule */}
      <OtherSchedule department={department} />

      {/* Save Button */}
      <Button onClick={handleSave} disabled={isLoading} isLoading={isLoading}>
        Save
      </Button>
    </div>
  );
};

export default OtherForm;
