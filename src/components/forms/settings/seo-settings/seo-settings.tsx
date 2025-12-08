"use client";

import FormInputs from "@/components/form-inputs";
import { Button } from "@/components/ui/button";
import { updateSeoSettings } from "@/lib/api/seo-settings";
import { handleToast } from "@/lib/utils";
import { InputField, siteSettings } from "@/types";
import React, { useState } from "react";
import { toast } from "sonner";

import SharingPreviewUpload from "./sharing-preview-upload";

interface Props {
  settingsData: siteSettings;
  userId: number;
}

interface Form {
  [key: string]: InputField;
}

const SeoSettings = ({ settingsData, userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [metaTitle, setMetaTitle] = useState(settingsData?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(
    settingsData?.meta_description || ""
  );
  const [sharingImagePreview, setSharingImagePreview] = useState(
    settingsData?.sharing_image_preview || ""
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
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const data = {
        user_id: userId,
        meta_title: metaTitle,
        meta_description: metaDescription,
        sharing_image_preview: sharingImagePreview,
      };

      const response = await updateSeoSettings(data);
      console.log("SEO SAVE RESPONSE:", response);

      handleToast(response);
    } catch (error: any) {
      toast.error(error.message);
    }

    setIsLoading(false);
  };

  return (
    <>
      <FormInputs inputFields={inputFields} />

      <SharingPreviewUpload
        value={sharingImagePreview}
        setValue={setSharingImagePreview}
        userId={userId}
        metaTitle={metaTitle}
        metaDescription={metaDescription}
      />

      <div className="flex items-center justify-end mt-6">
        <Button onClick={handleSave} disabled={isLoading} isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default SeoSettings;