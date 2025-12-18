"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { apiUrl } from "@/config";

export const getAllDoctors = async () => {
  const token = cookies().get("token")?.value;
  const userId = cookies().get("user_id")?.value;

  const url = `${apiUrl}/seller/doctors/get.php?user_id=${userId}`;

  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.records ?? [];
};
