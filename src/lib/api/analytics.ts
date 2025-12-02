"use server";

import { apiUrl } from "@/config";
import { appointmentsParams, updateAppointmentData } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

const route = "/analytics";

// Get Revenue
export const getRevenue = async (daysAgo: string) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl + route}`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      daysAgo: daysAgo,
    },
  };

  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error: any) {
    return false;
  }
};

// Get Overview
export const getOverview = async () => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl + route}/overview`;

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
