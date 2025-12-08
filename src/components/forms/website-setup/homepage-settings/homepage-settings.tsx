"use client";

import FormInputs from "@/components/form-inputs";
import { Button } from "@/components/ui/button";
import { saveWebsiteSettings } from "@/lib/api/website-settings";
import { handleToast } from "@/lib/utils";
import { InputField, WebsiteSettings } from "@/types";
import React, { useState } from "react";
import { toast } from "sonner";

import HeroImageUpload from "./hero-image-upload";

interface Props {
  data: WebsiteSettings;
  userId: number; // REAL PRIMARY KEY
}

interface Form {
  [key: string]: InputField;
}

const HomepageSettings = ({ data, userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  // ⭐ MATCHES DATABASE FIELDS
  const [heroTitle, setHeroTitle] = useState(data?.hero_title || "");
  const [heroDescription, setHeroDescription] = useState(
    data?.hero_description || ""
  );

  // ⭐ FIXED → store BOTH url + path
  const [heroImage, setHeroImage] = useState({
    url: data?.hero_image_url || "",
    path: data?.hero_image || ""
  });

  const inputFields: Form = {
    hero_title: {
      type: "text",
      value: heroTitle,
      setValue: setHeroTitle,
      label: "Hero Title",
    },
    hero_description: {
      type: "textarea",
      value: heroDescription,
      setValue: setHeroDescription,
      label: "Hero Description",
      rows: 5,
    },
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const payload = {
        user_id: userId,
        hero_title: heroTitle,
        hero_description: heroDescription,
        hero_image: heroImage.path, // ⭐ SAVE ONLY RELATIVE PATH
      };

      const response = await saveWebsiteSettings(payload);

      handleToast(response);
    } catch (err: any) {
      toast.error(err.message || "Failed to save homepage settings");
    }

    setIsLoading(false);
  };

  return (
    <>
      <FormInputs inputFields={inputFields} />

      {/* IMAGE UPLOAD */}
      <HeroImageUpload
        value={heroImage}
        setValue={setHeroImage}
        userId={userId}
      />

      <div className="flex items-center justify-end mt-6">
        <Button onClick={handleSave} disabled={isLoading} isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default HomepageSettings;
