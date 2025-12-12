"use server";
import { apiUrl } from "@/config";
import { changePasswordData, updateUserData } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

const route = "/users";

export const currentUser = async () => {
  const token = cookies().get("token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${apiUrl}/users/user-with-token.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    });

    const raw = await res.text();

    let json;
    try {
      json = JSON.parse(raw);
    } catch {
      console.log(" INVALID JSON RESPONSE => ", raw);
      return null;
    }

    if (!json.success || !json.data) return null;
console.log("🔥 FULL RAW USER RESPONSE =>", json);

    const u = json.data;

    // ⭐ NORMALIZE THE USER OBJECT HERE
    return {
      id: u.id,                 // DB primary key
      user_id: u.user_id,       // SELLER ID (68294)
      name: u.name,
      email: u.email,
      phone: u.phone,
      image: u.image,
      siteName: u.site_name,
      siteSlug: u.site_slug,
      country: u.country,
    };

  } catch (err) {
    console.log("currentUser ERROR:", err);
    return null;
  }
};



// Update a user data
export const updateUser = async (data: any) => {
  const token = cookies().get("token")?.value;

  try {
    const response = await axios.post(
      `${apiUrl}/seller/users/update-profile.php`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: response.data.success,
      message: response.data.message,
    };

  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Update failed.",
    };
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
