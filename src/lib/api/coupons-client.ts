"use client";

import { apiUrl } from "@/config";

const camelToSnake = (obj: any): any => {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);

  const newObj: any = {};
  for (const key in obj) {
    newObj[key.replace(/([A-Z])/g, "_$1").toLowerCase()] = camelToSnake(obj[key]);
  }
  return newObj;
};

export const addCoupon = async (data: any) => {
  const token = document.cookie.split("; ").find((x) => x.startsWith("token="))?.split("=")[1];
  const user_id = document.cookie.split("; ").find((x) => x.startsWith("user_id="))?.split("=")[1];

  const url = `${apiUrl}/seller/coupons/create.php?user_id=${user_id}`;

  const body = JSON.stringify(camelToSnake(data));

  console.log("🚀 SENDING TO PHP:", body);

  const res = await fetch(url, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body, // ← THIS must contain JSON string
  });

  const json = await res.json();
  console.log("💡 PHP RESPONSE:", json);
  return json;
};
