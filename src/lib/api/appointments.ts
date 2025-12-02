"use server";

import { apiUrl } from "@/config";
import { appointmentsParams, updateAppointmentData } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

const route = "/appointments";

// Get all appointments
export const getAllAppointments = async (params: appointmentsParams) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl + route}`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      limit: params.limit ? params.limit : 10,
      page: params.page && params.page >= 1 ? params.page : 1,
      q: params.q,
      status: params.status,
      paymentStatus: params.paymentStatus,
      paymentMethod: params.paymentMethod,
      customerId: params.customerId,
      fromDate: params.fromDate,
      toDate: params.toDate,
    },
  };

  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error: any) {
    return false;
  }
};

// Get calendar
export const getCalendar = async () => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl + route}/calendar`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(
      url,
      { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      options
    );
    return response.data;
  } catch (error: any) {
    return false;
  }
};

// Get single appointment
export const getAppointment = async (appointmentId: string) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl + route}/${appointmentId}`;

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

// Update a appointment
export const updateAppointment = async (
  appointmentId: string,
  data: updateAppointmentData
) => {
  const token = cookies().get("token")?.value;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `${apiUrl + route}/${appointmentId}`;

  try {
    const response = await axios.put(url, data, options);
    return { success: true, ...response.data };
  } catch (error: any) {
    return false;
  }
};

// Get Reports
export const getReports = async (timeFrame: string) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl + route}/reports`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      timeFrame: timeFrame,
    },
  };

  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error: any) {
    return false;
  }
};
