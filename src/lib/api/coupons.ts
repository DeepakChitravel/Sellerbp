// coupons.ts - COMPLETE FIXED VERSION
"use server";

import { apiUrl } from "@/config";
import { couponData, couponsParams } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

// Helper function: Convert camelCase to snake_case
const camelToSnake = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(camelToSnake);
  }

  const snakeObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      snakeObj[snakeKey] = camelToSnake(obj[key]);
    }
  }
  return snakeObj;
};

// Helper function: Convert snake_case to camelCase
const snakeToCamel = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }

  const camelObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      camelObj[camelKey] = snakeToCamel(obj[key]);
    }
  }
  return camelObj;
};

/* ---------------------------------------------------------
   GET ALL COUPONS
--------------------------------------------------------- */
export const getAllCoupons = async (params: couponsParams) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  console.log("SERVER USER_ID COOKIE =>", user_id);

  if (!user_id) {
    return { totalPages: 1, totalRecords: 0, records: [] };
  }

  const url = `${apiUrl}/seller/coupons/get.php`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        user_id,
        limit: params.limit ?? 10,
        page: params.page ?? 1,
        q: params.q ?? "",
      },
    });

    // Convert snake_case to camelCase for frontend
    if (response.data.success && response.data.records) {
      response.data.records = snakeToCamel(response.data.records);
    }

    return response.data;
  } catch (error) {
    console.error("Get coupons error:", error);
    return { totalPages: 1, totalRecords: 0, records: [] };
  }
};

/* ---------------------------------------------------------
   ADD COUPON
--------------------------------------------------------- */
export const addCoupon = async (data: couponData) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl}/seller/coupons/create.php`;

  // Convert camelCase to snake_case for backend
  const formattedData = camelToSnake(data);

  console.log("Adding coupon - Frontend data:", data);
  console.log("Adding coupon - Backend data:", formattedData);

  try {
    const response = await axios.post(url, formattedData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Add coupon error:", error.response?.data || error);
    return (
      error.response?.data || {
        success: false,
        message: "Server unreachable",
      }
    );
  }
};

/* ---------------------------------------------------------
   GET SINGLE COUPON (EDIT PAGE)
--------------------------------------------------------- */
export const getCoupon = async (couponId: string) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl}/seller/coupons/single.php?coupon_id=${couponId}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data?.success) {
      console.log("Coupon not found or error:", response.data);
      return false;
    }

    // Convert snake_case to camelCase for frontend
    if (response.data.data) {
      response.data.data = snakeToCamel(response.data.data);
    }

    return response.data;
  } catch (error) {
    console.error("Get single coupon error:", error);
    return false;
  }
};

/* ---------------------------------------------------------
   DELETE COUPON
--------------------------------------------------------- */
export const deleteCoupon = async (id: number) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl}/seller/coupons/delete.php?id=${id}`;

  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Delete coupon error:", error.response?.data || error);
    throw error.response?.data || { success: false, message: "Delete failed" };
  }
};

/* ---------------------------------------------------------
   UPDATE COUPON
--------------------------------------------------------- */
export const updateCoupon = async (couponId: string, data: any) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl}/seller/coupons/update.php?id=${couponId}`;

  // Convert camelCase to snake_case for backend
  const formattedData = camelToSnake(data);

  console.log("Updating coupon", couponId, "- Frontend data:", data);
  console.log("Updating coupon", couponId, "- Backend data:", formattedData);

  try {
    const response = await axios.post(url, formattedData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Update coupon error:", error.response?.data || error);
    return (
      error.response?.data || {
        success: false,
        message: "Server unreachable",
      }
    );
  }
};