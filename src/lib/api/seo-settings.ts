"use server";

import { apiUrl } from "@/config";
import axios from "axios";
import { cookies } from "next/headers";

export const updateSeoSettings = async (data: any) => {
  const token = cookies().get("token")?.value;

  try {
    const res = await axios.post(
      `${apiUrl}/seller/settings/seo-settings/update.php`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return res.data;
  } catch (err: any) {
    console.log("SEO UPDATE ERROR →", err?.response?.data);
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to update SEO settings",
    };
  }
};
export const getSeoSettings = async () => {
  const userId = cookies().get("user_id")?.value; // public ID
  const token = cookies().get("token")?.value;

  try {
    const res = await axios.get(
      `${apiUrl}/seller/settings/seo-settings/get.php?user_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return res.data;
  } catch (error) {
    console.log("SEO GET ERROR →", error?.response?.data);
    return { success: false, data: null };
  }
};

