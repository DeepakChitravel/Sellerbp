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

  const [facebook, setFacebook] = useState<string>(settingsData?.facebook);
  const [twitter, setTwitter] = useState<string>(settingsData?.twitter);
  const [instagram, setInstagram] = useState<string>(settingsData?.instagram);
  const [linkedin, setLinkedin] = useState<string>(settingsData?.linkedin);
  const [youtube, setYoutube] = useState<string>(settingsData?.youtube);
  const [pinterest, setPinterest] = useState<string>(settingsData?.pinterest);

  const inputFields: Form = {
    facebook: {
      type: "url",
      value: facebook,
      setValue: setFacebook,
      label: "Facebook",
      placeholder: "Enter Facebook URL",
      containerClassName: "md:col-span-6",
    },
    twitter: {
      type: "url",
      value: twitter,
      setValue: setTwitter,
      label: "Twitter",
      placeholder: "Enter Twitter URL",
      containerClassName: "md:col-span-6",
    },
    instagram: {
      type: "url",
      value: instagram,
      setValue: setInstagram,
      label: "Instagram",
      placeholder: "Enter Instagram URL",
      containerClassName: "md:col-span-6",
    },
    linkedin: {
      type: "url",
      value: linkedin,
      setValue: setLinkedin,
      label: "LinkedIn",
      placeholder: "Enter LinkedIn URL",
      containerClassName: "md:col-span-6",
    },
    youtube: {
      type: "url",
      value: youtube,
      setValue: setYoutube,
      label: "YouTube",
      placeholder: "Enter YouTube URL",
      containerClassName: "md:col-span-6",
    },
    pinterest: {
      type: "url",
      value: pinterest,
      setValue: setPinterest,
      label: "Pinterest",
      placeholder: "Enter Pinterest URL",
      containerClassName: "md:col-span-6",
    },
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const data = {
        facebook,
        twitter,
        instagram,
        linkedin,
        youtube,
        pinterest,
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
