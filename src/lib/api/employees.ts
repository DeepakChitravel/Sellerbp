"use server";

import { apiUrl } from "@/config";
import { employeeData, employeeParams } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

/* ---------------------------------------------------------
   GET ALL EMPLOYEES
--------------------------------------------------------- */
export const getAllEmployees = async (params: employeeParams) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  console.log("SERVER USER_ID COOKIE =>", user_id);

  if (!user_id) {
    return { totalPages: 1, totalRecords: 0, records: [] };
  }

  const url = `${apiUrl}/seller/employees/get.php`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        user_id,
        limit: params.limit ?? 10,
        page: params.page ?? 1,
        q: params.q ?? "",
      },
    });

    return response.data; // MUST contain totalPages, totalRecords, records[]
  } catch (error) {
    return { totalPages: 1, totalRecords: 0, records: [] };
  }
};

/* ---------------------------------------------------------
   ADD EMPLOYEE
--------------------------------------------------------- */
export const addEmployee = async (data: employeeData) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl}/seller/employees/add.php`;

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    return (
      error.response?.data || {
        success: false,
        message: "Server unreachable",
      }
    );
  }
};

/* ---------------------------------------------------------
   GET SINGLE EMPLOYEE (EDIT PAGE)
--------------------------------------------------------- */
export const getEmployee = async (employeeId: string) => {
  const token = cookies().get("token")?.value;

  const url = `${apiUrl}/seller/employees/single.php?id=${employeeId}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data?.success) return false;

    return response.data; // must contain data: { ... }
  } catch {
    return false;
  }
};


/* ---------------------------------------------------------
   DELETE EMPLOYEE
--------------------------------------------------------- */
export const deleteEmployee = async (id: number) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl}/seller/employees/delete.php?id=${id}`;

  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || { success: false, message: "Delete failed" };
  }
};

/* ---------------------------------------------------------
   UPDATE EMPLOYEE
--------------------------------------------------------- */
export const updateEmployee = async (employeeId: string, data: any) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl}/seller/employees/update.php?id=${employeeId}`;

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // { success: true/false, message: "" }
  } catch (error: any) {
    return (
      error.response?.data || {
        success: false,
        message: "Server unreachable",
      }
    );
  }
};
