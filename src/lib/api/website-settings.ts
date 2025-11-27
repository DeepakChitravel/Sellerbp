"use server";
import { apiUrl } from "@/config";
import { WebsiteSettingsData } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

const route = "/website-settings";

// Get data
export const getWebsiteSettings = async () => {
  const token = cookies().get("token")?.value;
  const url = apiUrl + route;

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

// save website settings
export const saveWebsiteSettings = async (data: WebsiteSettingsData) => {
  const token = cookies().get("token")?.value;
  const url = apiUrl + route;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(url, data, options);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: error.response.data.message };
  }
};
