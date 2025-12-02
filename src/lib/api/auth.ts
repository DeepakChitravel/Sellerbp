import { apiUrl } from "@/config";
import {
  forgotPasswordData,
  loginUserData,
  registerUserData,
  sendOtp as sendOtpType,
} from "@/types";
import axios from "axios";

const route = "/seller/auth";

// Send OTP
export const sendOtp = async (options: sendOtpType) => {
  const url = `${apiUrl}${route}/send-otp.php`;
  console.log("API URL:", apiUrl);

  try {
    const response = await axios.post(url, options, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    const err = error.response?.data || {
      success: false,
      message: "Server unreachable",
    };
    throw err;
  }
};

// Register User
export const registerUser = async (options: registerUserData) => {
  const url = `${apiUrl}${route}/register.php`;

  try {
    const response = await axios.post(url, options, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    const err = error.response?.data || {
      success: false,
      message: "Server unreachable",
    };
    throw err;
  }
};

// Login
export const loginUser = async (options: loginUserData) => {
  const url = `${apiUrl}${route}/login.php`;
  // console.log("Sending to backend:", options);

  try {
    const response = await axios.post(url, options, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,  // ⭐ REQUIRED ⭐
    });
    return response.data;
  } catch (error: any) {
    const err = error.response?.data || {
      success: false,
      message: "Server unreachable",
    };
    throw err;
  }
};

// Forgot Password
export const forgotPassword = async (options: forgotPasswordData) => {
  const url = `${apiUrl}${route}/forgot-password.php`;

  try {
    const response = await axios.post(url, options, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    const err = error.response?.data || {
      success: false,
      message: "Server unreachable",
    };
    throw err;
  }
};
