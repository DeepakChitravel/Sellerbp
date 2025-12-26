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