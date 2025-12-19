"use client";

import { InputField, FormValueProps } from "@/types";
import FormInputs from "@/components/form-inputs";

interface DoctorInfoProps {
  doctorName: FormValueProps;
  specialization: FormValueProps;
  qualification: FormValueProps;
  experience: FormValueProps;
  regNumber: FormValueProps;
}

const DoctorInformation = ({
  doctorName,
  specialization,
  qualification,
  experience,
  regNumber,
}: DoctorInfoProps) => {

  const inputFields: Record<string, InputField> = {
    doctor_name: {
      type: "text",
      value: doctorName.value || "",
      setValue: doctorName.setValue,
      placeholder: "Enter doctor name",
      label: "Doctor Name",
      required: true,
    },
    specialization: {
      type: "text",
      value: specialization.value || "",
      setValue: specialization.setValue,
      placeholder: "Ex. Dermatology, Pediatrics",
      label: "Specialization",
      required: true,
    },
    qualification: {
      type: "text",
      value: qualification.value || "",
      setValue: qualification.setValue,
      placeholder: "Ex. MBBS, MD",
      label: "Qualification",
      required: true,
    },
    experience: {
      type: "number",
      value: experience.value || "",
      setValue: experience.setValue,
      placeholder: "Years of experience",
      label: "Experience (Years)",
      required: true,
    },
    reg_number: {
      type: "text",
      value: regNumber.value || "",
      setValue: regNumber.setValue,
      placeholder: "Doctor registration number",
      label: "Registration Number",
      required: true,
    },
  };

  return (
    <div className="bg-white rounded-xl p-5">
      <div className="mb-9 space-y-1.5">
        <h3 className="font-medium">Doctor Information</h3>
        <p className="text-black/50 text-sm font-medium">
          Add essential doctor details.
        </p>
      </div>

      <FormInputs inputFields={inputFields} />
    </div>
  );
};

export default DoctorInformation;
