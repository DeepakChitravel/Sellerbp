"use client";
import FormInputs from "@/components/form-inputs";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/constants";
import { updateUser } from "@/lib/api/users";
import { handleToast } from "@/lib/utils";
import { InputField, User } from "@/types";
import React, { useState } from "react";
import { toast } from "sonner";
import ProfileImage from "@/components/forms/settings/profile-image";

interface Props {
  user: User;
}

interface Form {
  [key: string]: InputField;
}

const ProfileSettings = ({ user }: Props) => {
  // FIX — ALWAYS use correct ID (fallback to user.id)
  const userId = user.user_id ?? user.id;

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState<string>(user?.name);
  const [email, setEmail] = useState<string>(user?.email);
  const [phone, setPhone] = useState<string>(user?.phone);
  const [country, setCountry] = useState<string>(user?.country);
  const [image, setImage] = useState<any>(user?.image);

  const inputFields: Form = {
    name: {
      type: "text",
      value: name,
      setValue: setName,
      label: "Your Name",
      placeholder: "Name",
      containerClassName: "md:col-span-6",
    },
    phone: {
      type: "phone",
      value: phone,
      setValue: setPhone,
      label: "Mobile Number",
      placeholder: "Mobile Number",
      containerClassName: "md:col-span-6",
    },
    email: {
      type: "email",
      value: email,
      setValue: setEmail,
      label: "Email Address",
      placeholder: "Email Address",
      containerClassName: "md:col-span-6",
    },
    country: {
      type: "select",
      value: country,
      setValue: setCountry,
      label: "Where you are living now?",
      options: COUNTRIES,
      containerClassName: "md:col-span-6",
    },
  };

  const handleSave = async () => {
    setIsLoading(true);

    let uploadedImage = image;

    // FIX — Upload image with correct userId
    if (image instanceof File) {
      const formData = new FormData();
      formData.append("file", image);

      const uploadRes = await fetch(
        `http://localhost/managerbp/public/seller/users/upload-profile.php?user_id=${userId}`,
        { method: "POST", body: formData }
      );

      const result = await uploadRes.json();
      if (result.success) {
        uploadedImage = result.filename;
      }
    }

    try {
      // FIX — Send correct user ID to backend
      const response = await updateUser({
        user_id: userId,
        name,
        email,
        phone,
        country,
        image: uploadedImage,
      });

      handleToast(response);

    } catch (error: any) {
      toast.error(error.message);
    }

    setIsLoading(false);
  };

  console.log("PROFILE USER:", user);

  return (
    <>
      <FormInputs inputFields={inputFields} />

      <ProfileImage
        value={image}
        setValue={setImage}
        userId={userId} // FIXED
      />

      <div className="flex items-center justify-end mt-6">
        <Button onClick={handleSave} disabled={isLoading} isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default ProfileSettings;
