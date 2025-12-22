"use server";

import { apiUrl } from "@/config";
import { departmentData, departmentsParams } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

/* -------------------------------------------------------
  GET ALL DEPARTMENTS
-------------------------------------------------------- */
export const getAllDepartments = async (params: departmentsParams) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  if (!user_id) {
    return { totalPages: 1, totalRecords: 0, records: [] };
  }

  try {
    const response = await axios.get(
      `${apiUrl}/seller/departments/get.php`,
      {
        params: {
          user_id,
          limit: params.limit ?? 10,
          page: params.page ?? 1,
          q: params.q ?? "",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch {
    return { totalPages: 1, totalRecords: 0, records: [] };
  }
};

/* -------------------------------------------------------
  GET SINGLE DEPARTMENT
-------------------------------------------------------- */
export const getDepartment = async (departmentId: string) => {
  try {
    const response = await axios.get(
      `${apiUrl}/seller/departments/single.php?department_id=${departmentId}`
    );

    if (!response.data?.success) return false;

    return response.data;
  } catch {
    return false;
  }
};

/* -------------------------------------------------------
  ADD DEPARTMENT
-------------------------------------------------------- */
export const addDepartment = async (data: departmentData) => {
  const token = cookies().get("token")?.value;

  // Prepare data object
  const finalData: any = {
    token,
    name: data.name,
    slug: data.slug || null,
    image: data.image || null,
    meta_title: data.metaTitle || null,
    meta_description: data.metaDescription || null,
    type_main_name: data.typeMainName || null,
    type_main_amount: data.typeMainAmount || null,
  };

  // Add all type fields
  for (let i = 1; i <= 25; i++) {
    const nameKey = `type${i}Name` as keyof departmentData;
    const amountKey = `type${i}Amount` as keyof departmentData;
    
    finalData[`type_${i}_name`] = data[nameKey] || null;
    finalData[`type_${i}_amount`] = data[amountKey] || null;
  }

  console.log("SENDING DATA TO CREATE:", finalData);

  try {
    const response = await axios.post(
      `${apiUrl}/seller/departments/create.php`,
      finalData,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: any) {
    console.error("Add Department Error:", error.response?.data || error.message);
    return error.response?.data || { success: false, message: "Add failed" };
  }
};

/* -------------------------------------------------------
  UPDATE DEPARTMENT
-------------------------------------------------------- */
export const updateDepartment = async (
  departmentId: string,
  data: departmentData
) => {
  const token = cookies().get("token")?.value;

  // Prepare data object
  const finalData: any = {
    token,
    name: data.name,
    slug: data.slug || null,
    image: data.image || null,
    meta_title: data.metaTitle || null,
    meta_description: data.metaDescription || null,
    type_main_name: data.typeMainName || null,
    type_main_amount: data.typeMainAmount || null,
  };

  // Add all type fields
  for (let i = 1; i <= 25; i++) {
    const nameKey = `type${i}Name` as keyof departmentData;
    const amountKey = `type${i}Amount` as keyof departmentData;
    
    finalData[`type_${i}_name`] = data[nameKey] || null;
    finalData[`type_${i}_amount`] = data[amountKey] || null;
  }

  console.log("SENDING DATA TO UPDATE:", finalData);

  try {
    const response = await axios.post(
      `${apiUrl}/seller/departments/update.php?department_id=${departmentId}`,
      finalData,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: any) {
    console.error("Update Department Error:", error.response?.data || error.message);
    return error.response?.data || { success: false, message: "Update failed" };
  }
};

/* -------------------------------------------------------
  DELETE DEPARTMENT
-------------------------------------------------------- */
export const deleteDepartment = async (departmentId: string) => {
  const token = cookies().get("token")?.value;

  try {
    const response = await axios.delete(
      `${apiUrl}/seller/departments/delete.php?department_id=${departmentId}`,
      { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Delete Department Error:", error.response?.data || error.message);
    return error.response?.data || { success: false, message: "Delete failed" };
  }
};