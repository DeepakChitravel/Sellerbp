"use server";

import { apiUrl } from "@/config";
import { departmentData, departmentsParams } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

// camelCase → snake_case
const camelToSnake = (obj: any): any => {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);

  const newObj: any = {};
  for (const key in obj) {
    newObj[key.replace(/([A-Z])/g, "_$1").toLowerCase()] = camelToSnake(obj[key]);
  }
  return newObj;
};

// snake_case → camelCase
const snakeToCamel = (obj: any): any => {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(snakeToCamel);

  const newObj: any = {};
  for (const key in obj) {
    const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    newObj[camel] = snakeToCamel(obj[key]);
  }
  return newObj;
};

/* -------------------------------------------------------
  GET ALL DEPARTMENTS
-------------------------------------------------------- */
export const getAllDepartments = async (params: departmentsParams) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  const url = `${apiUrl}/seller/departments/get.php`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        user_id,
        limit: params.limit ?? 10,
        page: params.page ?? 1,
        q: params.q ?? "",
      },
    });

    if (response.data.records) {
      response.data.records = snakeToCamel(response.data.records);
    }

    return response.data;
  } catch (err) {
    return { success: false, records: [] };
  }
};

/* -------------------------------------------------------
  GET SINGLE DEPARTMENT
-------------------------------------------------------- */
export const getDepartment = async (departmentId: string) => {
  const token = cookies().get("token")?.value;

  const url = `${apiUrl}/seller/departments/single.php?department_id=${departmentId}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data.success) return false;

    let data = snakeToCamel(response.data.data);

    return { ...response.data, data };
  } catch (err) {
    return false;
  }
};

/* -------------------------------------------------------
  CREATE DEPARTMENT
-------------------------------------------------------- */
export const addDepartment = async (data: departmentData) => {
  const token = cookies().get("token")?.value;

  const url = `${apiUrl}/seller/departments/create.php`;

  const formatted = camelToSnake(data); // convert ALL fields

  try {
    const response = await axios.post(
      url,
      {
        ...formatted,
        token, // MUST send this
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err: any) {
    console.log("DEPARTMENT CREATE ERROR →", err.response?.data);
    return err.response?.data || { success: false, message: "Create failed" };
  }
};

/* -------------------------------------------------------
  UPDATE DEPARTMENT
-------------------------------------------------------- */
export const updateDepartment = async (departmentId: string, data: departmentData) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  const url = `${apiUrl}/seller/departments/update.php?department_id=${departmentId}`;

  const formatted = {
    ...camelToSnake(data),
    user_id, // needed for backend
  };

  console.log("UPDATE API → sending data:", formatted);

  try {
    const response = await axios.post(
      url,
      {
        ...formatted,
        token,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    console.log("UPDATE API → response:", response.data);

    return response.data;
  } catch (err: any) {
    console.log("UPDATE API → ERROR:", err.response?.data);
    return err.response?.data || { success: false, message: "Update failed" };
  }
};

/* -------------------------------------------------------
  DELETE DEPARTMENT
-------------------------------------------------------- */
export const deleteDepartment = async (departmentId: string) => {
  const token = cookies().get("token")?.value;

  const url = `${apiUrl}/seller/departments/delete.php?department_id=${departmentId}`;

  try {
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err: any) {
    return err.response?.data || { success: false, message: "Delete failed" };
  }
};