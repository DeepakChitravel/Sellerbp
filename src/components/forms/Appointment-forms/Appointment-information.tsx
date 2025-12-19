import { useEffect, useState } from "react";
import { InputField, FormValueProps, Option } from "@/types";
import FormInputs from "@/components/form-inputs";
import { getAllDoctors } from "@/lib/api/doctors";   // ⭐ new import

interface Form {
  [key: string]: InputField;
}

const AppointmentInformation = ({
  name,
  slug,
  amount,
  previousAmount,
  categoryId, // this becomes doctorId instead
  description,
  timeSlotInterval,
  intervalType,
  status,
  specialization,
  qualification,
  experience,
  doctorImage,
}: FormValueProps) => {

  const [doctorOptions, setDoctorOptions] = useState<Option[]>([]);

  // store full object
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

useEffect(() => {
  async function loadDoctors() {
    const list = await getAllDoctors();

    setDoctorOptions(
      list.map((doc:any) => ({
        label: doc.doctor_name,     // from DB
        value: doc.id.toString(),
        full: doc,                  // full doctor object
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
    doctorImage.setValue(doc.full.image ?? "");
    // regNumber.setValue(doc.full.reg_number ?? "");   // if needed

    setSelectedDoctor(doc.full);
  }

  categoryId.setValue(doctorId); // rename later for clarity
};


  const inputFields: Form = {


 

    // ✔ doctor dropdown (replacing category)
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

    doctorImage: {
      type: "text",
      value: doctorImage.value,
      setValue: doctorImage.setValue,
      label: "Doctor Image (auto)",
    },
       slug: {
      type: "text",
      value: slug.value,
      setValue: slug.setValue,
      label: "Slug",
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
