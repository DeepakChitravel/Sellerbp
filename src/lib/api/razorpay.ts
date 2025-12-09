// lib/api/razorpay.ts
"use server";

import { apiUrl } from "@/config";
import axios from "axios";

export interface RazorpayCredentials {
  razorpay_key_id: string;
  razorpay_key_secret: string;
}

export const getRazorpayCredentials = async (): Promise<RazorpayCredentials> => {
  try {
    const res = await axios.get(`${apiUrl}/seller/payment/razorpay-credentials.php`);
    return res.data;
  } catch (error) {
    // Return fallback test credentials if API fails
    return {
      razorpay_key_id: "", // Your test key from settings table
      razorpay_key_secret: "" // You'll need to add this to your settings table
    };
  }
};