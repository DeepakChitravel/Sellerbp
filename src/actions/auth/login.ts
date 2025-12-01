"use server";

import { loginUser } from "@/lib/api/auth";
import { cookies } from "next/headers";

export const loginAction = async (formData: any) => {
  try {
    const response = await loginUser(formData);

    if (!response.success) return response;

    const user = response.data.user;
    const token = response.data.token;

    // Save token cookie
    cookies().set("token", token, {
      path: "/",
      httpOnly: true,
    });

    // Save user_id cookie — REQUIRED for Employees list
    cookies().set("user_id", user.id.toString(), {
      path: "/",
    });

    // Optional: save full user data
    cookies().set("user_data", JSON.stringify(user), {
      path: "/",
    });

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Login failed",
    };
  }
};
