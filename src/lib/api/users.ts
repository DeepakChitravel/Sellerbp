"use server";
import { apiUrl } from "@/config";
import { changePasswordData, updateUserData } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

const route = "/users";



export const currentUser = async () => {
  const token = cookies().get("token")?.value;

  // ⭐ DEBUG HERE
  console.log("SERVER TOKEN:", token);

  if (!token) return null;

  try {
    const res = await fetch(`${apiUrl}/users/user-with-token.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    });

    const text = await res.text();

    try {
      const data = JSON.parse(text);
      if (!data.success) return null;
      return data.data || data.user || null;
    } catch {
      console.log("SERVER RESPONSE (NOT JSON):", text);
      return null;
    }

  } catch (err) {
    return null;
  }
};


// Update a user data
export const updateUser = async (data: updateUserData) => {
  const token = cookies().get("token")?.value;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `${apiUrl + route}`;

  try {
    const response = await axios.put(url, data, options);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: error.response.data.message };
  }
};

// Change password
export const changePassword = async (data: changePasswordData) => {
  const token = cookies().get("token")?.value;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `${apiUrl + route}/change-password`;

  try {
    const response = await axios.put(url, data, options);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: error.response.data.message };
  }
};
