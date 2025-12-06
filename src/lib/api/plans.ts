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