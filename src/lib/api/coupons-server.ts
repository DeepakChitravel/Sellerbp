"use server";

import { apiUrl } from "@/config";
import { cookies } from "next/headers";
import axios from "axios";
import { couponsParams } from "@/types";

// KEEP ALL YOUR SERVER-SIDE STUFF HERE

export const getAllCoupons = async (params: couponsParams) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  const url = `${apiUrl}/seller/coupons/get.php`;

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
    params: { user_id, ...params },
  });

  return response.data;
};

export const getCoupon = async (id: string) => {
  const token = cookies().get("token")?.value;

  const url = `${apiUrl}/seller/coupons/single.php?coupon_id=${id}`;

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const deleteCoupon = async (id: number) => {
  const token = cookies().get("token")?.value;

  const url = `${apiUrl}/seller/coupons/delete.php?id=${id}`;

  const response = await axios.delete(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const updateCoupon = async (couponId: string, formattedData: any) => {
  const token = cookies().get("token")?.value;

  const url = `${apiUrl}/seller/coupons/update.php?id=${couponId}`;

  const response = await axios.post(url, formattedData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
