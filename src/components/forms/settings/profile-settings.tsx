"use client";
import FormInputs from "@/components/form-inputs";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/constants";
import { updateUser } from "@/lib/api/users";
import { handleToast } from "@/lib/utils";
import { InputField, User } from "@/types";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  user: User;
}

interface Form {
  [key: string]: InputField;
}

const ProfileSettings = ({ user }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState<string>(user?.name);
  const [email, setEmail] = useState<string>(user?.email);
  const [phone, setPhone] = useState<string>(user?.phone);
  const [country, setCountry] = useState<string>(user?.country);
  const [image, setImage] = useState<string>(user?.image);

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
    image: {
      type: "file",
      value: image,
      setValue: setImage,
      label: "Your Photo",
      containerClassName: "md:col-span-6",
    },
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const data = {
        name,
        email,
        phone,
        country,
        image,
      };

      const response = await updateUser(data);

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

export default ProfileSettings;
