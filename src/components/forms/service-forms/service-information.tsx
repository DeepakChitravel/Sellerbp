import { InputField, FormValueProps, Category, Option } from "@/types";
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
import { getAllCategories } from "@/lib/api/categories";
import { useEffect, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import getSymbolFromCurrency from "currency-symbol-map";
import { INTERVAL_TYPES } from "@/constants";
import { Checkbox } from "@/components/ui/checkbox";
import FormInputs from "@/components/form-inputs";

interface Form {
  [key: string]: InputField;
}

const ServiceInformation = ({
  name,
  slug,
  amount,
  previousAmount,
  categoryId,
  description,
  timeSlotInterval,
  intervalType,
  status,
}: FormValueProps) => {
  const { userData } = useCurrentUser();

  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);

  useEffect(() => {
    async function getCategoriesData() {
      const categories = await getAllCategories({ limit: 100 });

      let data: Option[] = [];

      categories.records.map((category: Category) => {
        data.push({ label: category.name, value: category.id.toString() });
      });

      setCategoryOptions(data);
    }
    getCategoriesData();
  }, []);

  const inputFields: Form = {
    name: {
      type: "text",
      value: name.value,
      setValue: name.setValue,
      placeholder: "Enter service name",
      label: "Service Name",
      containerClassName: "md:col-span-6",
      required: true,
    },
    slug: {
      type: "text",
      value: slug.value,
      setValue: slug.setValue,
      placeholder: "Enter service slug",
      label: (
        <>
          Service Slug <small className="text-black/50">(optional)</small>
        </>
      ),
      containerClassName: "md:col-span-6",
    },
    amount: {
      type: "number",
      value: amount.value,
      setValue: amount.setValue,
      placeholder: getSymbolFromCurrency(
        userData?.siteSettings[0].currency as string
      ),
      label: "Amount",
      containerClassName: "md:col-span-6",
      required: true,
    },
    previousAmount: {
      type: "number",
      value: previousAmount.value,
      setValue: previousAmount.setValue,
      placeholder: getSymbolFromCurrency(
        userData?.siteSettings[0].currency as string
      ),
      label: "Previous Amount",
      containerClassName: "md:col-span-6",
    },
    category: {
      type: "select",
      value: categoryId.value,
      setValue: categoryId.setValue,
      label: "Service Category",
      placeholder: "Select Category",
      containerClassName: "md:col-span-6",
      options: categoryOptions,
    },
    timeSlotInterval: {
      type: "number",
      value: timeSlotInterval.value,
      setValue: timeSlotInterval.setValue,
      placeholder: "Time Slot Interval",
      label: "Time Slot Interval",
      containerClassName: "2xl:col-span-4 md:col-span-6",
      required: true,
    },
    intervalType: {
      type: "select",
      value: intervalType.value,
      setValue: intervalType.setValue,
      label: "Interval Type",
      containerClassName: "2xl:col-span-2 md:col-span-6",
      options: INTERVAL_TYPES,
    },
    description: {
      type: "textarea",
      value: description.value,
      setValue: description.setValue,
      placeholder: "Enter service description",
      label: "Service Description",
    },
    status: {
      type: "checkbox",
      value: status.value,
      setValue: status.setValue,
      label: "Service Status",
      labelDescription: "Please check this box to make this service visible.",
    },
  };

  return (
    <div className="bg-white rounded-xl p-5">
      <div className="mb-9 space-y-1.5">
        <h3 className="font-medium">Service Information</h3>
        <p className="text-black/50 text-sm font-medium">
          Easily input essential details like name, slug, amount, and more to
          showcase your service.
        </p>
      </div>

      <FormInputs inputFields={inputFields} />
    </div>
  );
};

export default ServiceInformation;
