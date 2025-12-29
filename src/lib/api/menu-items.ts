// ❌ DO NOT USE "use server"
import axios from "axios";
import { apiUrl } from "@/config";

/* ================= API INSTANCE ================= */
const api = axios.create({
  baseURL: apiUrl, // ngrok URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= TYPES ================= */
export type Menu = {
  id: number;
  name: string;
  items: number;
};

/* ================= MENUS ================= */

// ➕ Add Menu
// ➕ Add Menu (NO userId)
export const addMenu = async (name: string) => {
  const res = await api.post(
    "/seller/menu-settings/add.php",
    JSON.stringify({ name })
  );
  return res.data;
};



// 📄 Get Menus
export const getMenus = async (): Promise<Menu[]> => {
  const res = await api.get(
    "/seller/menu-settings/list.php"
  );
  return res.data;
};
