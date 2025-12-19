import { InputField, FormValueProps } from "@/types";
import FormInputs from "@/components/form-inputs";

interface Form {
  [key: string]: InputField;
}

const DepartmentInformation = ({ name, type, slug }: FormValueProps) => {
  const inputFields: Form = {
    name: {
      type: "text",
      value: name.value,
      setValue: name.setValue,
      placeholder: "Enter department name",
      label: "Department Name",
      required: true,
    },
    type: {
      type: "text",
      value: type.value,
      setValue: type.setValue,
      placeholder: "Enter department type",
      label: "Department Type (optional)",
    },
    slug: {
      type: "text",
      value: slug.value,
      setValue: slug.setValue,
      placeholder: "Enter department slug",
      label: "Department Slug (optional)",
    },
  };

  return (
    <div className="bg-white rounded-xl p-5">
      <div className="mb-9 space-y-1.5">
        <h3 className="font-medium">Department Information</h3>
        <p className="text-black/50 text-sm font-medium">
          Easily input essential details like name, type and slug to showcase
          your department.
        </p>
      </div>

      <FormInputs inputFields={inputFields} />
    </div>
  );
};

export default DepartmentInformation;