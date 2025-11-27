"use client";
import { useState } from "react";
import EmployeeDetails from "./employee-forms/employee-details";
import Sticky from "../sticky";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { handleToast } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { EmployeeFormProps } from "@/types";
import { addEmployee, updateEmployee } from "@/lib/api/employees";
import EmployeeImage from "./employee-forms/category-image";

const EmployeeForm = ({
  employeeId,
  employeeData,
  isEdit,
}: EmployeeFormProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState<string>(employeeData?.name);
  const [position, setPosition] = useState<string>(employeeData?.position);
  const [email, setEmail] = useState<string>(employeeData?.email);
  const [phone, setPhone] = useState<string>(employeeData?.phone);
  const [address, setAddress] = useState<string>(employeeData?.address);
  const [image, setImage] = useState<string>(employeeData?.image);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const data = {
        name,
        position,
        email,
        phone,
        address,
        image,
      };

      const response = !isEdit
        ? await addEmployee(data)
        : await updateEmployee(employeeId, data);

      handleToast(response);
      !isEdit &&
        response.success &&
        router.push(`/employees?${Math.floor(Math.random() * 100)}`);
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-7 col-span-12 grid gap-5">
          <EmployeeDetails
            name={{
              value: name,
              setValue: setName,
            }}
            position={{
              value: position,
              setValue: setPosition,
            }}
            email={{
              value: email,
              setValue: setEmail,
            }}
            phone={{
              value: phone,
              setValue: setPhone,
            }}
            address={{
              value: address,
              setValue: setAddress,
            }}
          />
        </div>

        <div className="lg:col-span-5 col-span-12">
          <div className="grid gap-5">
            <EmployeeImage
              images={{
                value: image,
                setValue: setImage,
              }}
            />
          </div>
        </div>
      </div>

      <Sticky>
        <Button onClick={handleSave} disabled={isLoading} isLoading={isLoading}>
          Save
        </Button>
      </Sticky>
    </>
  );
};

export default EmployeeForm;
