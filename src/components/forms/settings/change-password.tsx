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

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      label: "New Password",
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
    // ✅ Validate before API call
    if (!currentPassword || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await changePassword({
        currentPassword,
        password,
      });

      handleToast(response);

      // ✅ Clear inputs on success
      if (response?.success) {
        setCurrentPassword("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};

export default ChangePassword;
