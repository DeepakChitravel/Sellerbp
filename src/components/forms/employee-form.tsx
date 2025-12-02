"use client";

import { useState, useEffect } from "react";
import EmployeeDetails from "./employee-forms/employee-details";
import Sticky from "../sticky";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { handleToast } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { EmployeeFormProps } from "@/types";
import { addEmployee, updateEmployee } from "@/lib/api/employees";
import EmployeeImage from "./employee-forms/category-image";
import useCurrentUser from "@/hooks/useCurrentUser";

const EmployeeForm = ({ employeeId, employeeData, isEdit }: EmployeeFormProps) => {
  const router = useRouter();
  const { userData } = useCurrentUser();

  const [isLoading, setIsLoading] = useState(false);

  // state
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);

  // ⭐ ADD THIS STATE
  const [joining_date, setJoiningDate] = useState("");

  // load edit data
  useEffect(() => {
    if (employeeData) {
      setName(employeeData.name || "");
      setPosition(employeeData.position || "");
      setEmail(employeeData.email || "");
      setPhone(employeeData.phone || "");
      setAddress(employeeData.address || "");
      setImage(employeeData.image || null);

      // ⭐ LOAD JOINING DATE
      setJoiningDate(employeeData.joining_date || "");
    }
  }, [employeeData]);

  const handleSave = async () => {
    if (!userData?.id) {
      toast.error("User not logged in");
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        user_id: userData.id,
        employee_id: isEdit ? employeeData.employee_id : crypto.randomUUID(),
        name,
        position,
        email,
        phone,
        address,
        image,
        joining_date, // ⭐ SEND IT TO API
      };

      const response = isEdit
        ? await updateEmployee(employeeData.employee_id, data)
        : await addEmployee(data);

      handleToast(response);

      if (response.success) {
        router.push(`/employees?refresh=${Date.now()}`);
      }
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
            name={{ value: name, setValue: setName }}
            position={{ value: position, setValue: setPosition }}
            email={{ value: email, setValue: setEmail }}
            phone={{ value: phone, setValue: setPhone }}
            address={{ value: address, setValue: setAddress }}

            // ⭐ FIX: NOW PASS JOINING DATE
            joining_date={{ value: joining_date, setValue: setJoiningDate }}
          />
        </div>

        <div className="lg:col-span-5 col-span-12">
          <EmployeeImage images={{ value: image, setValue: setImage }} />
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
