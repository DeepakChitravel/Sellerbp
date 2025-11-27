"use client";
import FormInputs from "@/components/form-inputs";
import { Button } from "@/components/ui/button";
import useCurrentUser from "@/hooks/useCurrentUser";
import {
  addAvailableArea,
  updateAvailableArea,
} from "@/lib/api/available-areas";
import { citiesByStateAndCountry, statesByCountry } from "@/lib/api/csc";
import { generateRandomNumbers, handleToast } from "@/lib/utils";
import { AvailableAreaFormProps, InputField, Option } from "@/types";
import getSymbolFromCurrency from "currency-symbol-map";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Form {
  [key: string]: InputField;
}

const AreaForm = ({ isEdit, data }: AvailableAreaFormProps) => {
  const router = useRouter();

  const { userData } = useCurrentUser();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [cities, setCities] = useState<Option[]>([]);
  const [area, setArea] = useState<string>(data?.area as string);
  const [charges, setCharges] = useState<string>(data?.charges as string);

  useEffect(() => {
    async function getCities() {
      const country = userData?.siteSettings[0].country;
      const state = userData?.siteSettings[0].state;

      let cities = await citiesByStateAndCountry(
        country as string,
        state ? state : ""
      );

      if (cities.length < 1) {
        cities = await statesByCountry(country as string);
      }

      const citiesData: Option[] = [];
      cities.map((city: { name: string }) => {
        citiesData.push({
          value: city.name,
          label: city.name,
        });
      });

      setCities(citiesData);
    }
    userData && getCities();
  }, [userData]);

  const inputFields: Form = {
    area: {
      type: "select",
      value: area,
      setValue: setArea,
      label: "Area",
      placeholder: "Select a Area",
      required: true,
      options: cities,
      containerClassName: "col-span-12 md:col-span-6",
    },
    charges: {
      type: "number",
      value: charges,
      setValue: setCharges,
      label: "Charges",
      placeholder: getSymbolFromCurrency(
        userData?.siteSettings[0].currency as string
      ),
      required: true,
      options: cities,
      containerClassName: "col-span-12 md:col-span-6",
    },
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const formData = {
        area,
        charges,
      };

      const response = !isEdit
        ? await addAvailableArea(formData)
        : await updateAvailableArea(data?.areaId as string, formData);
      handleToast(response);

      if (response.success && !isEdit) {
        setArea("");
        setCharges("");
        router.push("?" + generateRandomNumbers(1, 9));
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <FormInputs inputFields={inputFields} />

      <div className="flex items-center justify-end mt-6">
        <Button onClick={handleSave} disabled={isLoading} isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AreaForm;
