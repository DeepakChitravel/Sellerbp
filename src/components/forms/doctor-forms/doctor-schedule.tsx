"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { InputField, FormValueProps, Option } from "@/types";
import FormInputs from "@/components/form-inputs";
import useCurrentUser from "@/hooks/useCurrentUser";
import { fetchDoctorsClient } from "@/lib/api/doctor_schedule";

/* ---------------------------------------------------
  TYPES
--------------------------------------------------- */
interface Form {
  [key: string]: InputField;
}

/* ---------------------------------------------------
  HELPER: Show field only if value exists
--------------------------------------------------- */
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => {
  if (!value) return null;

  return (
    <div>
      <strong>{label}:</strong> {value}
    </div>
  );
};

/* ---------------------------------------------------
  COMPONENT
--------------------------------------------------- */
const ServiceInformation = ({
  slug,
  amount,
  categoryId,
  description,
}: FormValueProps) => {
  const { userData } = useCurrentUser();

  const [doctorOptions, setDoctorOptions] = useState<Option[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  /* ---------------------------------------------------
    LOAD DOCTORS
  --------------------------------------------------- */
  useEffect(() => {
    if (!userData?.user_id) return;

    const loadDoctors = async () => {
      try {
        const list = await fetchDoctorsClient(userData.user_id);
        if (!Array.isArray(list)) return;

        const mapped = list.map((doc: any) => ({
          label: doc.doctor_name,
          value: String(doc.id),
          full: doc,
        }));

        setDoctorOptions(mapped);

        // ✅ If editing existing service, auto-select doctor
        const existing = mapped.find(
          (d) => d.value === String(categoryId.value)
        );
        if (existing) {
          setSelectedDoctor(existing.full);
        }
      } catch (err) {
        console.error("Doctor Load Error:", err);
      }
    };

    loadDoctors();
  }, [userData, categoryId.value]);

  /* ---------------------------------------------------
    HANDLE DOCTOR SELECT
  --------------------------------------------------- */
  const handleDoctorSelect = (doctorVal: string | number) => {
    const found = doctorOptions.find(
      (o) => String(o.value) === String(doctorVal)
    );
    if (!found) return;

    categoryId.setValue(String(found.value));

    const autoSlug = `${found.full.doctor_name}-${found.full.specialization || ""}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    slug.setValue(autoSlug);
    setSelectedDoctor(found.full);
  };

  /* ---------------------------------------------------
    AMOUNT (SINGLE SOURCE OF TRUTH)
  --------------------------------------------------- */
  const handleAmountChange = (value: string) => {
    amount.setValue(value.replace(/[^\d.]/g, ""));
  };

  /* ---------------------------------------------------
    FORM CONFIG
  --------------------------------------------------- */
  const inputFields: Form = {
    doctor: {
      type: "select",
      value: categoryId.value,
      setValue: handleDoctorSelect,
      label: "Select Doctor *",
      placeholder: "Choose a doctor",
      options: doctorOptions,
      required: true,
    },
    amount: {
      type: "number",
      value: amount.value,
      setValue: handleAmountChange,
      label: "Consultation Fee (₹) *",
      placeholder: "e.g., 500",
      required: true,
      min: "1",
      step: "1",
    },
    slug: {
      type: "text",
      value: slug.value,
      setValue: slug.setValue,
      label: "Slug (auto-generated)",
      readOnly: true,
    },
    description: {
      type: "textarea",
      value: description.value,
      setValue: description.setValue,
      label: "Description",
      placeholder: "Describe the consultation service...",
      rows: 4,
    },
  };

  /* ---------------------------------------------------
    RENDER
  --------------------------------------------------- */
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-5">
        Doctor Schedule Information
      </h3>

      <FormInputs inputFields={inputFields} />

      {/* ----------------- DOCTOR PROFILE ----------------- */}
      {selectedDoctor && (
        <div className="mt-6 rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h4 className="text-lg font-semibold text-gray-800">
              🩺 Doctor Profile
            </h4>
          </div>

          <div className="p-6 flex gap-8">
            {/* IMAGE */}
            {selectedDoctor.doctor_image && (
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-lg overflow-hidden border shadow-sm bg-gray-100">
                  <Image
                    src={
                      selectedDoctor.doctor_image.startsWith("http")
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
            )}

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-[15px] text-gray-700">
              <InfoRow label="Name" value={selectedDoctor.doctor_name} />
              <InfoRow
                label="Specialization"
                value={selectedDoctor.specialization}
              />
              <InfoRow
                label="Qualification"
                value={selectedDoctor.qualification}
              />
              <InfoRow
                label="Experience"
                value={
                  selectedDoctor.experience
                    ? `${selectedDoctor.experience} years`
                    : null
                }
              />

              {amount.value && (
                <div className="col-span-2">
                  <strong className="text-blue-600">
                    Consultation Fee:
                  </strong>
                  <div className="flex items-center mt-1">
                    <span className="text-2xl font-bold text-gray-800">
                      ₹ {amount.value}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceInformation;
