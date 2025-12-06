"use server";
import axios from "axios";
import { apiUrl } from "@/config";
import { cookies } from "next/headers";

export const getWebsiteSettings = async () => {
  const publicId = cookies().get("user_id")?.value;
  const token = cookies().get("token")?.value;

  if (!publicId) return null;

  try {
    const res = await axios.get(
      `${apiUrl}/seller/website-setup/header-settings/get.php?user_id=${publicId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return res.data?.data;
  } catch (err) {
    console.log("HEADER GET ERROR →", err?.response?.data);
    return null;
  }
};

export const saveWebsiteSettings = async (data: any) => {
  const token = cookies().get("token")?.value;

  try {
    const res = await axios.post(
      `${apiUrl}/seller/website-setup/header-settings/update.php`,
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
  } catch (error: any) {
    console.log("HEADER UPDATE ERROR →", error?.response?.data);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Failed to update header settings",
    };
  }
};
