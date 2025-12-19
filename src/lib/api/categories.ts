  "use server";

  import { apiUrl } from "@/config";
  import { categoryData, categoriesParams } from "@/types";
  import axios from "axios";
  import { cookies } from "next/headers";

  // camelCase → snake_case
  const camelToSnake = (obj: any): any => {
    if (typeof obj !== "object" || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(camelToSnake);

    const newObj: any = {};
    for (const key in obj) {
      newObj[key.replace(/([A-Z])/g, "_$1").toLowerCase()] = camelToSnake(obj[key]);
    }
    return newObj;
  };

  // snake_case → camelCase
  const snakeToCamel = (obj: any): any => {
    if (typeof obj !== "object" || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(snakeToCamel);

    const newObj: any = {};
    for (const key in obj) {
      const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      newObj[camel] = snakeToCamel(obj[key]);
    }
    return newObj;
  };

  /* -------------------------------------------------------
    GET ALL CATEGORIES
  -------------------------------------------------------- */
  export const getAllCategories = async (params: categoriesParams) => {
    const token = cookies().get("token")?.value;
    const user_id = cookies().get("user_id")?.value;

    const url = `${apiUrl}/seller/categories/get.php`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          user_id,
          limit: params.limit ?? 10,
          page: params.page ?? 1,
          q: params.q ?? "",
        },
      });

if (response.data.records) {
  const rows = snakeToCamel(response.data.records);

  response.data.records = rows.map((row: any) => {
    const doctor = {
      doctorName: row.doctorName || "",
      specialization: row.specialization || "",
      qualification: row.qualification || "",
      experience: row.experience || "",
      regNumber: row.regNumber || "",
    };

    // remove flat columns
    delete row.doctorName;
    delete row.specialization;
    delete row.qualification;
    delete row.experience;
    delete row.regNumber;

    return {
      ...row,
      doctorDetails: doctor,
    };
  });
}


      return response.data;
    } catch (err) {
      return { success: false, records: [] };
    }
  };

  /* -------------------------------------------------------
    GET SINGLE CATEGORY
  -------------------------------------------------------- */
  export const getCategory = async (categoryId: string) => {
    const token = cookies().get("token")?.value;

    const url = `${apiUrl}/seller/categories/single.php?category_id=${categoryId}`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) return false;

      let data = snakeToCamel(response.data.data);

      return { ...response.data, data };
    } catch (err) {
      return false;
    }
  };

  /* -------------------------------------------------------
    CREATE CATEGORY
  -------------------------------------------------------- */
  export const addCategory = async (data: categoryData) => {
    const token = cookies().get("token")?.value;

    const url = `${apiUrl}/seller/categories/create.php`;

    const formatted = camelToSnake(data); // convert ALL fields

    try {
      const response = await axios.post(
        url,
        {
          ...formatted,
          token, // MUST send this
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (err: any) {
      console.log("CATEGORY CREATE ERROR →", err.response?.data);
      return err.response?.data || { success: false, message: "Create failed" };
    }
  };




  /* -------------------------------------------------------
    UPDATE CATEGORY
  -------------------------------------------------------- */
export const updateCategory = async (categoryId: string, data: categoryData) => {
  const token = cookies().get("token")?.value;
  const user_id = cookies().get("user_id")?.value;

  const url = `${apiUrl}/seller/categories/update.php?category_id=${categoryId}`;

  const formatted = {
    ...camelToSnake(data),
    user_id, // needed for backend
  };

  // 🔥 ADD THIS (1)
  console.log("UPDATE API → sending data:", formatted);

  try {
    const response = await axios.post(
      url,
      {
        ...formatted,
        token,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    // 🔥 ADD THIS (2)
    console.log("UPDATE API → response:", response.data);

    return response.data;
  } catch (err: any) {
    console.log("UPDATE API → ERROR:", err.response?.data);
    return err.response?.data || { success: false, message: "Update failed" };
  }
};



export const addDoctor = async (data: any) => {
  const token = cookies().get("token")?.value;

  const formatted = camelToSnake(data);

  const url = `${apiUrl}/seller/doctors/create.php`;

  try {
    const response = await axios.post(
      url,
      {
        ...formatted,
        token,
      },
      { headers: { "Content-Type": "application/json" }}
    );

    return response.data;
  } catch (err:any) {
    return err.response?.data || { success:false };
  }
};


  /* -------------------------------------------------------
    DELETE CATEGORY
  -------------------------------------------------------- */
  export const deleteCategory = async (categoryId: string) => {
    const token = cookies().get("token")?.value;

    const url = `${apiUrl}/seller/categories/delete.php?category_id=${categoryId}`;

    try {
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (err: any) {
      return err.response?.data || { success: false, message: "Delete failed" };
    }
  };

