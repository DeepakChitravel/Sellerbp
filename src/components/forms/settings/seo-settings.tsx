"use client";
import FormInputs from "@/components/form-inputs";
import { Button } from "@/components/ui/button";
import { updateSiteSettings } from "@/lib/api/site-settings";
import { handleToast } from "@/lib/utils";
import { InputField, siteSettings } from "@/types";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  settingsData: siteSettings;
}

interface Form {
  [key: string]: InputField;
}

const SeoSettings = ({ settingsData }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [metaTitle, setMetaTitle] = useState<string>(settingsData?.metaTitle);
  const [metaDescription, setMetaDescription] = useState<string>(
    settingsData?.metaDescription
  );
  const [sharingImagePreview, setSharingImagePreview] = useState<string>(
    settingsData?.sharingImagePreview
  );

  const inputFields: Form = {
    metaTitle: {
      type: "text",
      value: metaTitle,
      setValue: setMetaTitle,
      label: "Meta Title",
      placeholder: "Enter your meta title",
    },
    metaDescription: {
      type: "textarea",
      value: metaDescription,
      setValue: setMetaDescription,
      label: "Meta Description",
      placeholder: "Enter your meta description",
    },
    sharingImagePreview: {
      type: "file",
      value: sharingImagePreview,
      setValue: setSharingImagePreview,
      label: "Sharing Preview Image",
    },
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const data = {
        metaTitle,
        metaDescription,
        sharingImagePreview,
      };

      const response = await updateSiteSettings(data);

      handleToast(response);
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <FormInputs inputFields={inputFields} />

      <div className="flex items-center justify-end mt-6">
        <Button onClick={handleSave} disabled={isLoading} isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default SeoSettings;
