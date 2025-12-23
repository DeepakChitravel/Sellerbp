import axios from "axios";
import { cookies } from "next/headers";
import { apiUrl } from "@/config";

/* -----------------------------------------
   SAFE RETURN UTILITY
----------------------------------------- */
const safeReturn = (data: any, msg: string) => {
  if (data && typeof data === "object") return data;
  return { success: false, message: msg };
};

/* -----------------------------------------
   CREATE DOCTOR SCHEDULE
----------------------------------------- */
export const addDoctorSchedule = async (data: any) => {
  try {
    const token = cookies().get("token")?.value;
    const user_id = cookies().get("user_id")?.value;

    const loc = data.doctorLocation || {};

    const payload = {
      user_id,
      category_id: data.categoryId,
      name: data.name,
      slug: data.slug,
      amount: data.amount,
      previous_amount: data.previousAmount,
      description: data.description,

      specialization: data.specialization,
      qualification: data.qualification,
      experience: data.experience,
      doctor_image: data.doctorImage,

      gst_percentage: data.gstPercentage,
      meta_title: data.metaTitle,
      meta_description: data.metaDescription,

      country: loc.country || "",
      state: loc.state || "",
      city: loc.city || "",
      pincode: loc.pincode || "",
      address: loc.address || "",
      map_link: loc.mapLink || "",

      weekly_schedule: JSON.stringify(data.weeklySchedule || {}),
      additional_images: JSON.stringify(data.additionalImages || []),

      status: data.status,
      token,
    };

    const res = await axios.post(
      `${apiUrl}/seller/doctor_schedule/create.php`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return safeReturn(res?.data, "Empty response from server");
  } catch (err: any) {
    return safeReturn(
      err.response?.data,
      err.message || "Network error during creation"
    );
  }
};

/* -----------------------------------------
   UPDATE DOCTOR SCHEDULE
----------------------------------------- */
export const updateDoctorSchedule = async (id: number, data: any) => {
  try {
    const token = cookies().get("token")?.value;

    const loc = data.doctorLocation || {};

    const payload = {
      user_id: data.user_id,
      category_id: data.categoryId,
      name: data.name,
      slug: data.slug,
      amount: data.amount,
      previous_amount: data.previousAmount,
      description: data.description,

      specialization: data.specialization,
      qualification: data.qualification,
      experience: data.experience,
      doctor_image: data.doctorImage,

      gst_percentage: data.gstPercentage,
      meta_title: data.metaTitle,
      meta_description: data.metaDescription,

      country: loc.country || "",
      state: loc.state || "",
      city: loc.city || "",
      pincode: loc.pincode || "",
      address: loc.address || "",
      map_link: loc.mapLink || "",

      weekly_schedule: JSON.stringify(data.weeklySchedule || {}),
      additional_images: JSON.stringify(data.additionalImages || []),

      status: data.status,
      token,
    };

    const res = await axios.post(
      `${apiUrl}/seller/doctor_schedule/update.php?id=${id}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return safeReturn(res?.data, "Empty response during update");
  } catch (err: any) {
    return safeReturn(
      err.response?.data,
      err.message || "Network error during update"
    );
  }
};
