"use client";

import { InputField, FormValueProps } from "@/types";
import FormInputs from "@/components/form-inputs";

interface DoctorInfoProps {
  doctorName: FormValueProps;
  specialization: FormValueProps;
  qualification: FormValueProps;
  experience: FormValueProps;
  regNumber: FormValueProps;
  uploadSlot?: React.ReactNode;
}

const DoctorInformation = ({
  doctorName,
  specialization,
  qualification,
  experience,
  regNumber,
  uploadSlot,
}: DoctorInfoProps) => {

  return (
    <div className="bg-white rounded-xl p-5 space-y-6">

      <h3 className="font-medium text-lg">Doctor Information</h3>

      {/* Row 1: doctor name + qualification */}
      <div className="grid grid-cols-2 gap-4">
        <FormInputs
          inputFields={{
            doctor_name: {
              type: "text",
              value: doctorName.value,
              setValue: doctorName.setValue,
              label: "Doctor Name",
              placeholder: "Enter doctor name",
              required: true,  // required
            },
          }}
        />

        <FormInputs
          inputFields={{
            qualification: {
              type: "text",
              value: qualification.value,
              setValue: qualification.setValue,
              label: "Qualification",
              placeholder: "Ex: MBBS, MD",
              required: true, // required
            },
          }}
        />
      </div>

      {/* Row 2: specialization + optional experience */}
      <div className="grid grid-cols-2 gap-4">
        <FormInputs
          inputFields={{
            specialization: {
              type: "text",
              value: specialization.value,
              setValue: specialization.setValue,
              label: "Specialization",
              placeholder: "Ex: Dermatology",
              required: true, // required
            },
          }}
        />

        <FormInputs
          inputFields={{
            experience: {
              type: "number",
              value: experience.value,
              setValue: experience.setValue,
              label: "Experience (Years)",
              placeholder: "Years of experience",
              required: false, // now optional 👌
            },
          }}
        />
      </div>

      {/* Row 3: optional reg number */}
      <FormInputs
        inputFields={{
          reg_number: {
            type: "text",
            value: regNumber.value,
            setValue: regNumber.setValue,
            label: "Registration Number",
            placeholder: "Doctor registration number",
            required: false, // optional 👌
          },
        }}
      />

      {uploadSlot && <div>{uploadSlot}</div>}
    </div>
  );
};

export default DoctorInformation;
