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
import { Checkbox } from "@/components/ui/checkbox";
import { GST_PERCENTAGES } from "@/constants";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import FormInputs from "@/components/form-inputs";

interface Form {
  [key: string]: InputField;
}

const ServiceGst = ({ gstPercentage }: FormValueProps) => {
  const [isDisplayed, setIsDisplayed] = useState<boolean>(
    gstPercentage.value ? true : false
  );

  const inputFields: Form = {
    gstPercentage: {
      type: "select",
      value: gstPercentage.value,
      setValue: gstPercentage.setValue,
      label: "GST Percentage",
      containerClassName: "md:col-span-6",
      options: GST_PERCENTAGES,
      placeholder: "Select GST Percentage",
    },
  };

  const handleSwitch = () => {
    isDisplayed === true &&
      gstPercentage.setValue &&
      gstPercentage.setValue(null);

    setIsDisplayed(!isDisplayed);
  };

  return (
    <div className="bg-white rounded-xl p-5">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">GST</h3>

          <Switch
            onClick={handleSwitch}
            defaultChecked={gstPercentage.value ? true : false}
          />
        </div>

        <p className="text-black/50 text-sm font-medium">
          You can change the GST percentage for this particular service
        </p>
      </div>

      {isDisplayed && (
        <div className="mt-9">
          <FormInputs inputFields={inputFields} />
        </div>
      )}
    </div>
  );
};

export default ServiceGst;
