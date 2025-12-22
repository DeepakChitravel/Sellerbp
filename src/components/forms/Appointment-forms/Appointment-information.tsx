"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { InputField, FormValueProps, Option } from "@/types";
import FormInputs from "@/components/form-inputs";
import { fetchDoctorsClient } from "@/lib/client/doctors";  // ✔ correct import
import useCurrentUser from "@/hooks/useCurrentUser";

interface Form { [key: string]: InputField }

const AppointmentInformation = ({
  slug,
  categoryId,
}: FormValueProps) => {

  const { userData } = useCurrentUser();

  const [doctorOptions, setDoctorOptions] = useState<Option[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

useEffect(() => {
  async function loadDoctors() {
    if (!userData?.user_id) {
      console.log("❌ No user_id found in userData:", userData);
      return;
    }

    console.log("▶ loading doctors for:", userData.user_id);

    try {
      const list = await fetchDoctorsClient(userData.user_id);

      console.log("📥 API raw response list =", list);

      if (!Array.isArray(list)) {
        console.log("❌ list is not an array:", list);
        return;
      }

      const mapped = list.map((doc: any) => ({
        label: doc.doctor_name,
        value: doc.category_id,
        full: doc,
      }));

      console.log("📌 mapped doctorOptions:", mapped);

      setDoctorOptions(mapped);

      if (categoryId.value) {
        const match = list.find(
          (doc: any) => doc.category_id === categoryId.value
        );

        console.log("🔍 match doctor:", match);

        if (match) setSelectedDoctor(match);
      }
    } catch (err) {
      console.error("🔥 ERROR loading doctors:", err);
    }
  }

  loadDoctors();
}, [userData]);


  const handleDoctorSelect = (doctorVal: string) => {
    const found = doctorOptions.find(o => o.value === doctorVal);
    if (!found) return;

    categoryId.setValue(doctorVal);

    const autoSlug = `${found.full.doctor_name}-${found.full.specialization}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    slug.setValue(autoSlug);
    setSelectedDoctor(found.full);
  };

  const inputFields: Form = {
    doctor: {
      type: "select",
      value: categoryId.value,
      setValue: handleDoctorSelect,
      label: "Select Doctor",
      placeholder: "Pick doctor",
      options: doctorOptions,
    },

    slug: {
      type: "text",
      value: slug.value,
      setValue: slug.setValue,
      label: "Slug (auto)",
      readOnly: true,
    },

    doctor_fee: {
      type: "number",
      value: selectedDoctor?.doctor_fee || "",
      setValue: (val: string) => {
        setSelectedDoctor((prev:any) => ({ ...prev, doctor_fee: val }));
      },
      label: "Doctor Fee (₹)",
      placeholder: "Enter consultation fee",
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="font-semibold text-lg mb-5">Doctor Appointment Mapping</h3>

      <FormInputs inputFields={inputFields} />

      {selectedDoctor && (
        <div className="mt-6 rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h4 className="text-lg font-semibold text-gray-800">
              🩺 Doctor Profile Preview
            </h4>
          </div>

          <div className="p-6 flex gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-lg overflow-hidden border shadow-sm bg-gray-100">
                <Image
                  src={
                    selectedDoctor.doctor_image?.startsWith("http")
                      ? selectedDoctor.doctor_image
                      : `http://localhost/managerbp/public/uploads/${selectedDoctor.doctor_image}`
                  }
                  alt={selectedDoctor.doctor_name}
                  width={130}
                  height={130}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-[15px] text-gray-700 leading-relaxed">
              <div>Name: {selectedDoctor.doctor_name}</div>
              <div>Specialization: {selectedDoctor.specialization}</div>
              <div>Qualification: {selectedDoctor.qualification}</div>
              <div>Experience: {selectedDoctor.experience} years</div>
              <div>Reg No: {selectedDoctor.reg_number}</div>
              <div>Doctor Fee: ₹ {selectedDoctor.doctor_fee ?? "Not set"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentInformation;
