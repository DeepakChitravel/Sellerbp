"use server";

import { apiUrl } from "@/config";
import { manualPaymentMethodData, manualPaymentMethodsParams } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

const route = "/manual-payment-methods";

// Get all manual payment methods
export const getAllManualPaymentMethods = async (
  params: manualPaymentMethodsParams
) => {
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

// Get single manual payment method
export const getManualPaymentMethod = async (id: number) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl + route}/${id}`;

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

// Add a manual payment method
export const addManualPaymentMethod = async (data: manualPaymentMethodData) => {
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

// Update a manual payment method
export const updateManualPaymentMethod = async (
  id: number,
  data: manualPaymentMethodData
) => {
  const token = cookies().get("token")?.value;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `${apiUrl + route}/${id}`;

  try {
    const response = await axios.put(url, data, options);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: error.response.data.message };
  }
};

// Delete a manual payment method
export const deleteManualPaymentMethod = async (id: number) => {
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
