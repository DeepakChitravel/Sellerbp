"use server";

import { apiUrl } from "@/config";
import { categoryData, categoriesParams } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

const route = "/categories";

// Get all categories
export const getAllCategories = async (params: categoriesParams) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl + route}`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      limit: params.limit ? params.limit : 10,
      page: params.page && params.page >= 1 ? params.page : 1,
      q: params.q,
    },
  };

  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error: any) {
    return false;
  }
};

// Get single category
export const getCategory = async (categoryId: string) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl + route}/${categoryId}`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error: any) {
    return false;
  }
};

// Add a category
export const addCategory = async (data: categoryData) => {
  const token = cookies().get("token")?.value;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `${apiUrl + route}`;

  try {
    const response = await axios.post(url, data, options);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: error.response.data.message };
  }
};

// Update a category
export const updateCategory = async (
  categoryId: string,
  data: categoryData
) => {
  const token = cookies().get("token")?.value;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `${apiUrl + route}/${categoryId}`;

  try {
    const response = await axios.put(url, data, options);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: error.response.data.message };
  }
};

// Delete a category
export const deleteCategory = async (id: number) => {
  const token = cookies().get("token")?.value;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `${apiUrl + route}/${id}`;

  try {
    const response = await axios.delete(url, options);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};
