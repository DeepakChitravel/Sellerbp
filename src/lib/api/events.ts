import axios from "axios";

const BASE_URL = "http://localhost/managerbp/public/seller/events";

// GET ALL EVENTS
export async function getAllEvents() {
  try {
    const res = await axios.get(`${BASE_URL}/get.php`);
    return res.data;
  } catch (err: any) {
    return { success: false, data: [], message: err.message };
  }
}

// GET A SINGLE EVENT
export const getEvent = async (id: string | number) => {
  try {
    const response = await axios.get(`${BASE_URL}/get.php?id=${id}`);
    return response.data;
  } catch (error: any) {
    return { success: false, message: "Failed to fetch event." };
  }
};

// CREATE EVENT
export const addEvent = async (data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/add.php`, data, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Error adding event",
    };
  }
};

// UPDATE EVENT
export const updateEvent = async (id: string | number, data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/update.php?id=${id}`, data, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Error updating event",
    };
  }
};
export async function uploadEventImage(file: File, type: string, userId: number) {
  const form = new FormData();
  form.append("file", file);
  form.append("type", type);
  form.append("user_id", String(userId));

  const response = await fetch(
    "http://localhost/managerbp/public/seller/events/upload-image.php",
    {
      method: "POST",
      body: form,
    }
  );

  return await response.json();
}


export const deleteEvent = async (id: number) => {
  try {
    const res = await axios.get(
      `http://localhost/managerbp/public/seller/events/delete.php?id=${id}`,
      { withCredentials: false }
    );

    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Delete failed",
    };
  }
};

