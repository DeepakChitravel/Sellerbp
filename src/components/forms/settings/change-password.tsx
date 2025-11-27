"use client";
import FormInputs from "@/components/form-inputs";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/lib/api/users";
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

const ChangePassword = ({ user }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const inputFields: Form = {
    currentPassword: {
      type: "password",
      value: currentPassword,
      setValue: setCurrentPassword,
      label: "Current Password",
      placeholder: "********",
    },
    password: {
      type: "password",
      value: password,
      setValue: setPassword,
      label: "Password",
      placeholder: "********",
      containerClassName: "md:col-span-6",
    },
    confirmPassword: {
      type: "password",
      value: confirmPassword,
      setValue: setConfirmPassword,
      label: "Confirm Password",
      placeholder: "********",
      containerClassName: "md:col-span-6",
    },
  };

  const handleSave = async () => {
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error("Password and Confirm password does not matched.");
      setIsLoading(false);
      return;
    }

    try {
      const data = {
        currentPassword,
        password,
      };

      const response = await changePassword(data);

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

export default ChangePassword;
