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

// Get settings
export const getBasicSettings = async () => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  const url = `${apiUrl}/seller/settings/basic-settings/get.php?user_id=${user_id}`;

  try {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    console.error("Error fetching basic settings:", err);
    return { success: false, data: null };
  }
};

// Update settings (filename only)
export const updateBasicSettings = async (data: BasicSettingsData) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  const url = `${apiUrl}/seller/settings/basic-settings/update.php?user_id=${user_id}`;

  try {
    const res = await axios.post(url, data, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
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
  formData.append("file", file);

  const url = `${apiUrl}/seller/settings/upload-logo.php?user_id=${user_id}`;

  try {
    const res = await axios.post(url, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: res.data.success,
      filename: res.data.filename,  // IMPORTANT
      message: res.data.message,
    };
  } catch (err) {
    console.error("Error uploading logo:", err);
    return { success: false, message: "Upload failed" };
  }
};

// Upload favicon
export const uploadFavicon = async (file: File) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  const formData = new FormData();
  formData.append("file", file);

  const url = `${apiUrl}/seller/settings/upload-favicon.php?user_id=${user_id}`;

  try {
    const res = await axios.post(url, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: res.data.success,
      filename: res.data.filename,
      message: res.data.message,
    };
  } catch (err) {
    console.error("Error uploading favicon:", err);
    return { success: false, message: "Upload failed" };
  }
};
