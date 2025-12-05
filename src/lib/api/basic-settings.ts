"use server";

import { apiUrl } from "@/config";
import axios from "axios";
import { cookies } from "next/headers";

export interface BasicSettingsData {
  logo?: string | null;
  favicon?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  currency?: string | null;
  country?: string | null;
  state?: string | null;
  address?: string | null;
}

// Get basic settings
export const getBasicSettings = async () => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  const url = `${apiUrl}/seller/settings/basic-settings/get.php?user_id=${user_id}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching basic settings:", error);
    return { success: false, data: null };
  }
};

// Update basic settings
export const updateBasicSettings = async (data: BasicSettingsData) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  const url = `${apiUrl}/seller/settings/basic-settings/update.php?user_id=${user_id}`;

  try {
    const response = await axios.post(url, data, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data || null,
    };
  } catch (error: any) {
    console.error("Error updating basic settings:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update settings",
    };
  }
};

// Upload logo
export const uploadLogo = async (file: File) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  const formData = new FormData();
  formData.append("logo", file);

  const url = `${apiUrl}/seller/settings/upload-logo.php?user_id=${user_id}`;

  try {
    const response = await axios.post(url, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });

    return {
      success: response.data.success,
      filename: response.data.filename,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error("Error uploading logo:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to upload logo",
    };
  }
};

// Upload favicon
export const uploadFavicon = async (file: File) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  const formData = new FormData();
  formData.append("favicon", file);

  const url = `${apiUrl}/seller/settings/upload-favicon.php?user_id=${user_id}`;

  try {
    const response = await axios.post(url, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });

    return {
      success: response.data.success,
      filename: response.data.filename,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error("Error uploading favicon:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to upload favicon",
    };
  }
};