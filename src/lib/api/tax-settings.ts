// lib/api/tax-settings.ts
"use server";

import { apiUrl } from "@/config";
import axios from "axios";
import { cookies } from "next/headers";

export interface TaxSettingsData {
  gstNumber?: string | null;
  gstType?: string | null;
  taxPercent?: number | null;
}

/* ---------------------------------------------------------
   GET TAX SETTINGS
--------------------------------------------------------- */
export const getTaxSettings = async () => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  if (!user_id) {
    return null;
  }

  const url = `${apiUrl}/seller/settings/tax-settings/get.php`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { user_id },
    });

    return response.data;
  } catch (error) {
    console.error("Get tax settings error:", error);
    return null;
  }
};

/* ---------------------------------------------------------
   UPDATE TAX SETTINGS
--------------------------------------------------------- */
export const updateTaxSettings = async (data: TaxSettingsData) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  if (!user_id) {
    return { success: false, message: "User not authenticated" };
  }

  const url = `${apiUrl}/seller/settings/tax-settings/update.php`;

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
    console.error("Update tax settings error:", error);
    return (
      error.response?.data || {
        success: false,
        message: "Server unreachable",
      }
    );
  }
};