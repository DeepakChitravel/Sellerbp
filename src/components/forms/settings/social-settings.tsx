"use client";
import FormInputs from "@/components/form-inputs";
import { Button } from "@/components/ui/button";
import { getSocialSettings, updateSocialSettings } from "@/lib/api/social-settings";
import { InputField } from "@/types";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface SocialSettingsData {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  pinterest?: string;
}

interface Form {
  [key: string]: InputField;
}

const SocialSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [facebook, setFacebook] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [linkedin, setLinkedin] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");
  const [pinterest, setPinterest] = useState<string>("");

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsFetching(true);
    try {
      const response = await getSocialSettings();
      
      if (response.success && response.data) {
        const data = response.data;
        setFacebook(data.facebook || "");
        setTwitter(data.twitter || "");
        setInstagram(data.instagram || "");
        setLinkedin(data.linkedin || "");
        setYoutube(data.youtube || "");
        setPinterest(data.pinterest || "");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsFetching(false);
    }
  };

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
      const data: SocialSettingsData = {
        facebook: facebook || "",
        twitter: twitter || "",
        instagram: instagram || "",
        linkedin: linkedin || "",
        youtube: youtube || "",
        pinterest: pinterest || "",
      };

      const response = await updateSocialSettings(data);

      if (response?.success) {
        toast.success(response.message || "Social settings updated successfully!");
      } else {
        toast.error(response?.message || "Failed to update settings");
      }
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "An error occurred while saving");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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

export default SocialSettings;