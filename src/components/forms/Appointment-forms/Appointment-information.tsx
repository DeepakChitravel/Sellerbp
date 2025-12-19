import { useEffect, useState } from "react";
import { InputField, FormValueProps, Option } from "@/types";
import FormInputs from "@/components/form-inputs";
import { getAllDoctors } from "@/lib/api/doctors";

interface Form {
  [key: string]: InputField;
}

const AppointmentInformation = ({
  name,
  slug,
  amount,
  previousAmount,
  categoryId, // doctorId
  description,
  timeSlotInterval,
  intervalType,
  status,
  specialization,
  qualification,
  experience,
}: FormValueProps) => {

  const [doctorOptions, setDoctorOptions] = useState<Option[]>([]);

  // store full doctor object
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  useEffect(() => {
    async function loadDoctors() {
      const list = await getAllDoctors();

      setDoctorOptions(
        list.map((doc: any) => ({
          label: doc.doctor_name,
          value: doc.id.toString(),
          full: doc, 
        }))
      );
    }

    loadDoctors();
  }, []);

  const handleDoctorSelect = (doctorId: string) => {
    const doc = doctorOptions.find(d => d.value === doctorId);

    if (doc) {
      specialization.setValue(doc.full.specialization ?? "");
      qualification.setValue(doc.full.qualification ?? "");
      experience.setValue(doc.full.experience?.toString() ?? "");

      // ⭐ auto slug from doctor name + specialization
      const autoSlug = `${doc.full.doctor_name}-${doc.full.specialization}`
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      slug.setValue(autoSlug);
      setSelectedDoctor(doc.full);
    }

    categoryId.setValue(doctorId);
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

    specialization: {
      type: "text",
      value: specialization.value,
      setValue: specialization.setValue,
      label: "Specialization (auto)",
    },

    qualification: {
      type: "text",
      value: qualification.value,
      setValue: qualification.setValue,
      label: "Qualification (auto)",
    },

    experience: {
      type: "number",
      value: experience.value,
      setValue: experience.setValue,
      label: "Experience (auto)",
    },

    slug: {
      type: "text",
      value: slug.value,
      setValue: slug.setValue,
      label: "Slug (auto)",
    },
  };

  return (
    <div className="bg-white rounded-xl p-5">
      <h3 className="font-medium mb-4">Appointment Information</h3>
      <FormInputs inputFields={inputFields} />
    </div>
  );
};

export default AppointmentInformation;
