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

const defaultLocation = {
  country: "",
  state: "",
  city: "",
  pincode: "",
  address: "",
  mapLink: "",
};

const Doctor_Schedule = ({ serviceId, serviceData, isEdit }: ServiceFormProps) => {
  const router = useRouter();
  const { userData } = useCurrentUser();

  const [isLoading, setIsLoading] = useState(false);
  const [showGst, setShowGst] = useState(false);

  // Simple form state
  const [formData, setFormData] = useState({
    slug: serviceData?.slug || "",
    amount: serviceData?.amount?.toString() || "",
    categoryId: serviceData?.categoryId?.toString() || "",
    description: serviceData?.description || "",
    metaTitle: serviceData?.metaTitle || "",
    metaDescription: serviceData?.metaDescription || "",
    doctorLocation: serviceData?.doctorLocation || defaultLocation,
    weeklySchedule: serviceData?.weeklySchedule || {}
  });

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // SAVE FUNCTION - GUARANTEED TO WORK
  const handleSave = async () => {
    setIsLoading(true);

    try {
      const rawAmount = String(formData.amount ?? "").trim();
      const amountNumber = Number(rawAmount);

      if (!rawAmount || Number.isNaN(amountNumber) || amountNumber <= 0) {
        toast.error("Please enter a valid consultation fee");
        setIsLoading(false);
        return;
      }

      const payload = {
        user_id: Number(userData?.user_id || 0),
        categoryId: formData.categoryId
          ? Number(formData.categoryId)
          : null,
        slug: String(formData.slug || ""),
        amount: amountNumber.toString(),
        description: String(formData.description || ""),
        metaTitle: String(formData.metaTitle || ""),
        metaDescription: String(formData.metaDescription || ""),
        doctorLocation: formData.doctorLocation,
        weeklySchedule: formData.weeklySchedule,
      };

      console.log("🚀 FINAL PAYLOAD:", payload);

      const response = await addDoctorScheduleClient(payload);

      if (response?.success) {
        toast.success("Doctor schedule created successfully!");
        router.push("/doctor-schedule");
      } else {
        toast.error(response?.message || "Failed to save");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }

    setIsLoading(false);
  };



  return (
    <>
      <div className="grid grid-cols-12 gap-5 pb-32">
        {/* LEFT PANEL */}
        <div className="lg:col-span-7 col-span-12 grid gap-5">
          <ServiceInformation
            slug={{ value: formData.slug, setValue: (val) => updateField('slug', val) }}
            amount={{ value: formData.amount, setValue: (val) => updateField('amount', val) }}
            categoryId={{ value: formData.categoryId, setValue: (val) => updateField('categoryId', val) }}
            description={{ value: formData.description, setValue: (val) => updateField('description', val) }}
          />

          {/* WEEKLY SCHEDULE */}
          <WeeklyAppointment
            value={formData.weeklySchedule}
            onChange={(val) => updateField('weeklySchedule', val)}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-5 col-span-12 grid gap-5">
          {showGst && (
            <ServiceGst gstPercentage={{ value: null, setValue: () => { } }} />
          )}

          <ServiceSEO
            metaTitle={{ value: formData.metaTitle, setValue: (val) => updateField('metaTitle', val) }}
            metaDescription={{
              value: formData.metaDescription,
              setValue: (val) => updateField('metaDescription', val)
            }}
          />

          {/* Doctor Location */}
          <DoctorLocation
            value={formData.doctorLocation}
            setValue={(val) => updateField('doctorLocation', val)}
          />
        </div>
      </div>

      <Sticky>
        <Button
          onClick={handleSave}
          disabled={
            isLoading ||
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