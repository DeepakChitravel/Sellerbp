"use server";

import axios from "axios";
import { apiUrl } from "@/config";

export const getPlans = async () => {
  try {
    const res = await axios.get(`${apiUrl}/seller/plans/get.php`);
    return res.data;
  } catch {
    return { 
      success: false, 
      data: [],
      gst_settings: {
        gst_percentage: 18,
        gst_tax_type: 'exclusive'
      }
    };
  }
};

// Validate discount code only
export const validateDiscount = async (code, planId) => {
  try {
    const res = await axios.post(`${apiUrl}/seller/plans/discount_validate.php`, {
      code,
      planId
    });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: "Error validating discount code"
    };
  }
};