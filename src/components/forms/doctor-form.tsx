"use client";

import { useEffect, useState } from "react";
import ServiceInformation from "./doctor-forms/doctor-schedule";
import ServiceSEO from "./doctor-forms/doctor-seo";
import Sticky from "../sticky";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  addDoctorScheduleClient,
  updateDoctorScheduleClient,
} from "@/lib/client/doctorScheduleClient";
import { handleToast } from "@/lib/utils";
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

  // Doctor Profile Fields
  const [specialization, setSpecialization] = useState(serviceData?.specialization || "");
  const [qualification, setQualification] = useState(serviceData?.qualification || "");
  const [experience, setExperience] = useState(serviceData?.experience || "");
  const [doctorImage, setDoctorImage] = useState(serviceData?.doctorImage || "");

  // Doctor Location
  const [doctorLocation, setDoctorLocation] = useState(
    serviceData?.doctorLocation || defaultLocation
  );

  // ⭐ FIX HERE — wrap setter to support functional updates
  const updateDoctorLocation = (updater: any) => {
    setDoctorLocation((prev: any) =>
      typeof updater === "function" ? updater(prev) : updater
    );
  };

  // General Fields
  const [name, setName] = useState(serviceData?.name || "");
  const [slug, setSlug] = useState(serviceData?.slug || "");
  const [amount, setAmount] = useState(serviceData?.amount || "");
  const [previousAmount, setPreviousAmount] = useState(serviceData?.previousAmount || "");
  const [description, setDescription] = useState(serviceData?.description || "");

  const [weeklySchedule, setWeeklySchedule] = useState(
    serviceData?.weeklySchedule || {}
  );

  const [categoryId, setCategoryId] = useState<string | undefined>(
    serviceData?.categoryId ? serviceData.categoryId.toString() : undefined
  );

  const [timeSlotInterval, setTimeSlotInterval] = useState(
    serviceData?.timeSlotInterval || ""
  );

  const [intervalType, setIntervalType] = useState(
    serviceData?.intervalType || "minutes"
  );

  const [gstPercentage, setGstPercentage] = useState(
    serviceData?.gstPercentage?.toString() || null
  );

  const [status, setStatus] = useState<boolean>(!!serviceData?.status);

  const [image, setImage] = useState(serviceData?.image || "");

  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  const [metaTitle, setMetaTitle] = useState(serviceData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    serviceData?.metaDescription || ""
  );

  useEffect(() => {
    if (serviceData?.additionalImages) {
      setAdditionalImages(serviceData.additionalImages.map((i) => i.image));
    }
  }, [serviceData]);

  useEffect(() => {
    if (userData?.siteSettings?.[0]?.gstNumber) {
      setShowGst(true);
    }
  }, [userData]);

  // ---------------------------------------------------
  // SAVE BUTTON
  // ---------------------------------------------------
const handleSave = async () => {
  setIsLoading(true);

  try {
    const payload = {
      name,
      slug,
      amount,
      previousAmount,
      image,
      categoryId: categoryId ? parseInt(categoryId) : null,
      timeSlotInterval,
      intervalType,
      description,
      gstPercentage,
      metaTitle,
      metaDescription,
      status: status ? 1 : 0,
      additionalImages,
      weeklySchedule,
      doctorLocation,
      specialization,
      qualification,
      experience,
      doctorImage,
      user_id: userData?.user_id,
    };

    // ⭐⭐ ADD THIS HERE ⭐⭐
    console.log("🔥 FINAL PAYLOAD BEFORE SEND =", payload);

    let response;

    if (!isEdit) {
      response = await addDoctorScheduleClient(payload);
    } else {
      response = await updateDoctorScheduleClient(serviceId, payload);
    }

    console.log("📡 API RESPONSE =", response);

    if (!response?.success) {
      toast.error(response?.message || "Failed to save");
    } else {
      toast.success("Saved successfully!");
      if (!isEdit) router.push("/doctor-schedule");
    }
  } catch (err: any) {
    toast.error(err.message);
  }

  setIsLoading(false);
};


  return (
    <>
      <div className="grid grid-cols-12 gap-5 pb-32">

        {/* LEFT PANEL */}
        <div className="lg:col-span-7 col-span-12 grid gap-5">
          <ServiceInformation
            name={{ value: name, setValue: setName }}
            slug={{ value: slug, setValue: setSlug }}
            amount={{ value: amount, setValue: setAmount }}
            categoryId={{ value: categoryId, setValue: setCategoryId }}
            description={{ value: description, setValue: setDescription }}
            timeSlotInterval={{ value: timeSlotInterval, setValue: setTimeSlotInterval }}
            intervalType={{ value: intervalType, setValue: setIntervalType }}
            status={{ value: status, setValue: setStatus }}
            specialization={{ value: specialization, setValue: setSpecialization }}
            qualification={{ value: qualification, setValue: setQualification }}
            experience={{ value: experience, setValue: setExperience }}
            doctorImage={{ value: doctorImage, setValue: setDoctorImage }}
          />

          {/* WEEKLY SCHEDULE */}
          <WeeklyAppointment value={weeklySchedule} onChange={setWeeklySchedule} />
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-5 col-span-12 grid gap-5">
          {showGst && (
            <ServiceGst
              gstPercentage={{ value: gstPercentage, setValue: setGstPercentage }}
            />
          )}

          <ServiceSEO
            metaTitle={{ value: metaTitle, setValue: setMetaTitle }}
            metaDescription={{
              value: metaDescription,
              setValue: setMetaDescription,
            }}
          />

          {/* Doctor Location */}
          <DoctorLocation value={doctorLocation} setValue={updateDoctorLocation} />
        </div>
      </div>

      <Sticky>
        <Button onClick={handleSave} disabled={isLoading} isLoading={isLoading}>
          Save
        </Button>
      </Sticky>
    </>
  );
};

export default Doctor_Schedule;
