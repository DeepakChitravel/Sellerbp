"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { apiUrl } from "@/config";

// converts camelCase to snake_case recursively
const camelToSnake = (obj: any): any => {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);

  const newObj: Record<string, any> = {};
  for (const key in obj) {
    newObj[key.replace(/([A-Z])/g, "_$1").toLowerCase()] = camelToSnake(obj[key]);
  }
  return newObj;
};

export const addDoctor = async (data: any) => {
  const token = cookies().get("token")?.value;

  const formatted = camelToSnake(data);

  try {
    const res = await axios.post(
      `${apiUrl}/seller/doctors/create.php`,
      { ...formatted, token },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.data;
  } catch (err: any) {
    console.log("ADD DOCTOR ERROR:", err.response?.data);
    return { success: false, message: "Doctor create failed" };
  }
};

export const updateDoctor = async (categoryId: string, data: any) => {
  const token = cookies().get("token")?.value;

  const formatted = camelToSnake(data);

  try {
    const response = await axios.post(
      `${apiUrl}/seller/doctors/update.php`,
      {
        ...formatted,
        category_id: categoryId,
        token,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (err:any) {
    return err.response?.data || { success:false };
  }
};

// FIXED VERSION ✔
export const getAllDoctors = async (userId:number) => {
  const token = cookies().get("token")?.value;

  try {
    const res = await axios.post(
      `${apiUrl}/seller/doctors/get.php`,
      { user_id: userId, token },     // must send both
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data?.data || [];
  } catch (err:any) {
    console.error("GET DOCTORS ERROR:", err.response?.data);
    return [];
  }
};
