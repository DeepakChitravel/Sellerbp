"use server";

import { apiUrl } from "@/config";
import axios from "axios";
import { cookies } from "next/headers";

export interface SocialSettingsData {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  pinterest?: string;
}

/* ---------------------------------------------------------
   GET SOCIAL SETTINGS
--------------------------------------------------------- */
export const getSocialSettings = async () => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  if (!user_id) {
    return { success: false, message: "User not authenticated" };
  }

  const url = `${apiUrl}/seller/settings/social-settings/get.php`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { user_id },
    });

    return response.data;
  } catch (error: any) {
    console.error("Get social settings error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch settings",
    };
  }
};

/* ---------------------------------------------------------
   UPDATE SOCIAL SETTINGS
--------------------------------------------------------- */
export const updateSocialSettings = async (data: SocialSettingsData) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  if (!user_id) {
    return { success: false, message: "User not authenticated" };
  }

  const url = `${apiUrl}/seller/settings/social-settings/update.php`;

  // Add user_id to data
  const requestData = { ...data, user_id };

  try {
    const response = await axios.post(url, requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Update social settings error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Server unreachable",
    };
  }
};