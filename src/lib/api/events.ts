"use server";

import { apiUrl } from "@/config";
import { eventData, eventParams } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

/* ---------------------------------------------------------
   GET ALL EVENTS
--------------------------------------------------------- */
export const getAllEvents = async (params: eventParams) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  if (!user_id) {
    return { totalPages: 1, totalRecords: 0, records: [] };
  }

  const url = `${apiUrl}/seller/events/get.php`;

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

    return response.data;
  } catch (error) {
    return { totalPages: 1, totalRecords: 0, records: [] };
  }
};

/* ---------------------------------------------------------
   GET SINGLE EVENT (EDIT PAGE)
--------------------------------------------------------- */
export const getEvent = async (eventId: string) => {
  const token = cookies().get("token")?.value;

  const url = `${apiUrl}/seller/events/single.php?id=${eventId}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data?.success) return false;

    return response.data;
  } catch {
    return false;
  }
};

/* ---------------------------------------------------------
   ADD EVENT
--------------------------------------------------------- */
export const addEvent = async (data: eventData) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl}/seller/events/add.php`;

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    return (
      error.response?.data || { success: false, message: "Server unreachable" }
    );
  }
};

/* ---------------------------------------------------------
   UPDATE EVENT
--------------------------------------------------------- */
export const updateEvent = async (eventId: string, data: any) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl}/seller/events/update.php?id=${eventId}`;

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    return (
      error.response?.data || { success: false, message: "Server unreachable" }
    );
  }
};

/* ---------------------------------------------------------
   DELETE EVENT
--------------------------------------------------------- */
export const deleteEvent = async (id: number) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl}/seller/events/delete.php?id=${id}`;

  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || { success: false, message: "Delete failed" };
  }
};
