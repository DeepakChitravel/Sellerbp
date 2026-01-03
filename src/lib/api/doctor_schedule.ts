import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/managerbp/public/';

export const addDoctorScheduleClient = async (data: any) => {
  try {
    const response = await fetch(
      `${apiUrl}/seller/doctor_schedule/create.php`, // ✅ FIXED
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// For update (if needed later)
export const updateDoctorScheduleClient = async (id: number, data: any) => {
  try {
    const response = await axios.put(
      `${apiUrl}/doctor_schedule/update.php?id=${id}`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Fetch doctors
// Fetch doctors
export const fetchDoctorsClient = async (userId: number) => {
  try {
    const res = await axios.post(
      `${apiUrl}/seller/categories/list.php`,
      { user_id: userId }
    );
    return res.data?.data ?? [];
  } catch (err: any) {
    console.error("Fetch doctors error:", err);
    return [];
  }
};
export const getDoctorSchedules = async ({
  limit = 10,
  page = 1,
  q = "",
}: {
  limit?: number;
  page?: number;
  q?: string;
}) => {
  try {
    const res = await axios.get(
      `${apiUrl}/seller/doctor_schedule/list.php`,
      {
        params: { limit, page, q },
        withCredentials: true,
      }
    );

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Failed");
    }

    return {
      records: res.data.records,
      totalRecords: res.data.totalRecords,
      totalPages: res.data.totalPages,
    };
  } catch (error) {
    console.error("Doctor schedule fetch error:", error);
    return {
      records: [],
      totalRecords: 0,
      totalPages: 1,
    };
  }
};

export const deleteDoctorSchedule = async (id: string) => {
  const res = await axios.delete(
    `${apiUrl}/seller/doctor_schedule/delete.php`,
    {
      params: { id },              // ✅ send id properly
      withCredentials: true,       // ✅ SEND COOKIE TOKEN
    }
  );

  return res.data;
};