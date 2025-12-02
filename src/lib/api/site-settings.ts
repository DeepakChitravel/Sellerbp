"use server";

import { apiUrl } from "@/config";
import { siteSettingsData } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

const route = "/site-settings";

// Update a site settings
export const updateSiteSettings = async (data: siteSettingsData) => {
  const token = cookies().get("token")?.value;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `${apiUrl + route}`;

  try {
    const response = await axios.put(url, data, options);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: error.response.data.message };
  }
};
