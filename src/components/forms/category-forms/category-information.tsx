import { InputField, FormValueProps } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import FormInputs from "@/components/form-inputs";

interface Form {
  [key: string]: InputField;
}

const CategoryInformation = ({ name, slug }: FormValueProps) => {
  const inputFields: Form = {
    name: {
      type: "text",
      value: name.value,
      setValue: name.setValue,
      placeholder: "Enter category name",
      label: "Category Name",
      required: true,
    },
    slug: {
      type: "text",
      value: slug.value,
      setValue: slug.setValue,
      placeholder: "Enter category slug",
      label: (
        <>
          Category Slug <small className="text-black/50">(optional)</small>
        </>
      ),
    },
  };

  return (
    <div className="bg-white rounded-xl p-5">
      <div className="mb-9 space-y-1.5">
        <h3 className="font-medium">Category Information</h3>
        <p className="text-black/50 text-sm font-medium">
          Easily input essential details like name, slug, and more to showcase
          your category.
        </p>
      </div>

      <FormInputs inputFields={inputFields} />
    </div>
  );
};

export default CategoryInformation;
