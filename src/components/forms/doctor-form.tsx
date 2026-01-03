"use client";

import { useState } from "react";
import ServiceInformation from "./doctor-forms/doctor-schedule";
import ServiceSEO from "./doctor-forms/doctor-seo";
import Sticky from "../sticky";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { addDoctorScheduleClient } from "@/lib/api/doctor_schedule";
import { useRouter } from "next/navigation";
import { ServiceFormProps } from "@/types";
import ServiceGst from "./doctor-forms/doctorGst";
import useCurrentUser from "@/hooks/useCurrentUser";
import WeeklyAppointment from "./doctor-forms/weekly-appointment";
import DoctorLocation from "./doctor-forms/doctor-location";

/* ---------------------------------------
   DEFAULT LOCATION
--------------------------------------- */
const defaultLocation = {
  country: "",
  state: "",
  city: "",
  pincode: "",
  address: "",
  mapLink: "",
};

/* ---------------------------------------
   LOCATION VALIDATION
--------------------------------------- */
const validateDoctorLocation = (location: any) => {
  if (!location) return "Doctor location is required";
  if (!location.country) return "Please select country";
  if (!location.state) return "Please select state";
  if (!location.city) return "Please select city";
  if (!location.pincode || location.pincode.length < 4)
    return "Please enter a valid pincode";
  if (!location.address || location.address.trim().length < 5)
    return "Please enter full address";
  return null;
};

const Doctor_Schedule = ({
  serviceId,
  serviceData,
  isEdit,
}: ServiceFormProps) => {
  const router = useRouter();
  const { userData } = useCurrentUser();

  const [isLoading, setIsLoading] = useState(false);
  const [showGst, setShowGst] = useState(false);
  const [hasWeeklyErrors, setHasWeeklyErrors] = useState(false);

  /* ---------------------------------------
     FORM STATE
  --------------------------------------- */
  const [formData, setFormData] = useState({
    slug: serviceData?.slug || "",
    amount: serviceData?.amount?.toString() || "",
    categoryId: serviceData?.categoryId?.toString() || "",
    description: serviceData?.description || "",
    metaTitle: serviceData?.metaTitle || "",
    metaDescription: serviceData?.metaDescription || "",
    doctorLocation: serviceData?.doctorLocation || defaultLocation,
    weeklySchedule: serviceData?.weeklySchedule || {},
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ---------------------------------------
     SAVE
  --------------------------------------- */
  const handleSave = async () => {
    setIsLoading(true);

    try {
      const amountNumber = Number(formData.amount);
      if (!amountNumber || amountNumber <= 0) {
        toast.error("Please enter a valid consultation fee");
        return;
      }

      const locationError = validateDoctorLocation(formData.doctorLocation);
      if (locationError) {
        toast.error(locationError);
        return;
      }

      if (hasWeeklyErrors) {
        toast.error("Please fix weekly schedule errors");
        return;
      }

      const payload = {
        user_id: Number(userData?.user_id || 0),
        categoryId: formData.categoryId
          ? Number(formData.categoryId)
          : null,
        slug: formData.slug,
        amount: amountNumber.toString(),
        description: formData.description,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        doctorLocation: formData.doctorLocation,
        weeklySchedule: formData.weeklySchedule,
      };

      const response = await addDoctorScheduleClient(payload);

      if (response?.success) {
        toast.success("Doctor schedule saved successfully!");
        router.push("/hos-opts");
      } else {
        toast.error(response?.message || "Failed to save");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------------------
     UI
  --------------------------------------- */
  return (
    <>
      <div className="grid grid-cols-12 gap-5 pb-32">
        {/* LEFT */}
        <div className="lg:col-span-7 col-span-12 grid gap-5">
          <ServiceInformation
            slug={{
              value: formData.slug,
              setValue: (val) => updateField("slug", val),
            }}
            amount={{
              value: formData.amount,
              setValue: (val) => updateField("amount", val),
            }}
            categoryId={{
              value: formData.categoryId,
              setValue: (val) => updateField("categoryId", val),
            }}
            description={{
              value: formData.description,
              setValue: (val) => updateField("description", val),
            }}
          />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 col-span-12 grid gap-5">
          {showGst && (
            <ServiceGst gstPercentage={{ value: null, setValue: () => {} }} />
          )}

          <DoctorLocation
            value={formData.doctorLocation}
            setValue={(val) => updateField("doctorLocation", val)}
          />

          <ServiceSEO
            metaTitle={{
              value: formData.metaTitle,
              setValue: (val) => updateField("metaTitle", val),
            }}
            metaDescription={{
              value: formData.metaDescription,
              setValue: (val) => updateField("metaDescription", val),
            }}
          />
        </div>

        {/* 🔥 FULL WIDTH WEEKLY SCHEDULE */}
        <div className="col-span-12">
          <WeeklyAppointment
            value={formData.weeklySchedule}
            onChange={(val) => updateField("weeklySchedule", val)}
            onValidationChange={setHasWeeklyErrors}
          />
        </div>
      </div>

      <Sticky>
        <Button
          onClick={handleSave}
          disabled={
            isLoading ||
            hasWeeklyErrors ||
            !formData.amount ||
            Number(formData.amount) <= 0
          }
          isLoading={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Saving..." : "Save Doctor Schedule"}
        </Button>
      </Sticky>
    </>
  );
};

export default Doctor_Schedule;
