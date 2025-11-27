import { apiUrl } from "@/config";
import { customerParams } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

const route = "/customers";

// Get all customers
export const getAllCustomers = async (params: customerParams) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl + route}`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      limit: params.limit ? params.limit : 10,
      page: params.page && params.page >= 1 ? params.page : 1,
      q: params.q,
    },
  };

  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error: any) {
    return false;
  }
};

// Get single customer
export const getCustomer = async (customerId: number) => {
  const token = cookies().get("token")?.value;
  const url = `${apiUrl + route}/${customerId}`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error: any) {
    return false;
  }
};
