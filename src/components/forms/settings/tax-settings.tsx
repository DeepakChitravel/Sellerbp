"use client";
import FormInputs from "@/components/form-inputs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GST_TYPES } from "@/constants";
import { updateSiteSettings } from "@/lib/api/site-settings";
import { handleToast, validateGSTIN } from "@/lib/utils";
import { InputField, siteSettings } from "@/types";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  settingsData: siteSettings;
}

interface Form {
  [key: string]: InputField;
}

const TaxSettings = ({ settingsData }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGSTDisplayed, setIsGSTDisplayed] = useState<boolean>(
    settingsData?.gstNumber ? true : false
  );

  const [gstNumber, setGstNumber] = useState<string>(settingsData?.gstNumber);
  const [gstType, setGstType] = useState<string>(
    settingsData?.gstType ? settingsData?.gstType : GST_TYPES[0].value
  );

  const inputFields: Form = {
    gstType: {
      type: "select",
      value: gstType,
      setValue: setGstType,
      label: "GST Type",
      options: GST_TYPES,
      containerClassName: "md:col-span-6",
    },
    gstNumber: {
      type: "text",
      value: gstNumber,
      setValue: setGstNumber,
      label: "GST Number",
      placeholder: "Enter GST number",
      containerClassName: "md:col-span-6",
    },
  };

  const handleSave = async () => {
    setIsLoading(true);

    if (!validateGSTIN(gstNumber)) {
      toast.error("Invalid GST number");
      setIsLoading(false);
      return;
    }

    try {
      const data = {
        gstNumber,
        gstType,
      };

      const response = await updateSiteSettings(data);

      handleToast(response);
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  const handleSwitch = async () => {
    setIsGSTDisplayed((prev) => !prev);

    let response;
    if (isGSTDisplayed) {
      response = await updateSiteSettings({
        gstNumber: null,
        gstType: null,
      });
      handleToast(response);
    } else {
      response = await updateSiteSettings({
        gstNumber,
        gstType,
      });
    }
  };

  return (
    <>
      <div className="flex justify-end absolute right-0 top-1">
        <Switch
          onClick={handleSwitch}
          defaultChecked={settingsData?.gstNumber ? true : false}
        />
      </div>

      {isGSTDisplayed && (
        <>
          <FormInputs inputFields={inputFields} />

          <div className="flex items-center justify-end mt-6">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default TaxSettings;
