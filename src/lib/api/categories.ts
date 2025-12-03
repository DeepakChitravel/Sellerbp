"use server";

import { apiUrl } from "@/config";
import { categoryData, categoriesParams } from "@/types";
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
   GET ALL CATEGORIES
-------------------------------------------------------- */
export const getAllCategories = async (params: categoriesParams) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  const url = `${apiUrl}/seller/categories/get.php`;

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
   GET SINGLE CATEGORY
-------------------------------------------------------- */
export const getCategory = async (categoryId: string) => {
  const token = cookies().get("token")?.value;

  const url = `${apiUrl}/seller/categories/single.php?category_id=${categoryId}`;

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
   CREATE CATEGORY
-------------------------------------------------------- */
export const addCategory = async (data: categoryData) => {
  const token = cookies().get("token")?.value;

  const user_id = cookies().get("user_id")?.value;

  const url = `${apiUrl}/seller/categories/create.php?user_id=${user_id}`;

  const formatted = camelToSnake(data);

  try {
    const response = await axios.post(url, formatted, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err: any) {
    return err.response?.data || { success: false, message: "Create failed" };
  }
};

/* -------------------------------------------------------
   UPDATE CATEGORY
-------------------------------------------------------- */
export const updateCategory = async (
  categoryId: string,
  data: categoryData
) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

const url = `${apiUrl}/seller/categories/update.php?category_id=${categoryId}&user_id=${user_id}`;

  const formatted = camelToSnake(data);

  try {
    const response = await axios.post(url, formatted, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err: any) {
    return err.response?.data || { success: false, message: "Update failed" };
  }
};

/* -------------------------------------------------------
   DELETE CATEGORY
-------------------------------------------------------- */
export const deleteCategory = async (categoryId: string) => {
  const token = cookies().get("token")?.value;

  const url = `${apiUrl}/seller/categories/delete.php?category_id=${categoryId}`;

  try {
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err: any) {
    return err.response?.data || { success: false, message: "Delete failed" };
  }
};

