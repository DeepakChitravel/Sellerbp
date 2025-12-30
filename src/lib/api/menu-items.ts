// ❌ DO NOT USE "use server"
import axios from "axios";
import { apiUrl } from "@/config";

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // ✅ REQUIRED
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= TYPES ================= */
export type Menu = {
  id: number;
  name: string;
  items: number;
  description?: string;
  is_active?: boolean;
  created_at?: string;
};

export type ItemCategory = {
  id: number;
  name: string;
  items: number;
  menu_id?: number;
  created_at?: string;
};

export type MenuItem = {
  id: number;
  name: string;
  description?: string;
  menu_id: number;
  category_id?: number;
  category_name?: string;
  menu_name?: string;
  food_type: 'veg' | 'non-veg';
  halal: boolean;
  stock_type: string;
  stock_qty?: number;
  stock_unit?: string;
  stock: string;
  customer_limit?: number;
  customer_limit_period?: string;
  image?: string;
  preparation_time: number;
  price: number;
  original_price?: number;
  discount?: string;
  order_count: number;
  rating: number;
  is_best_seller: boolean;
  is_available: boolean;
  show_on_site: boolean;
  last_updated: string;
  veg: boolean;
  tags?: string[];
  spice_level?: 'Mild' | 'Medium' | 'Hot';
};

export type Variation = {
  id?: number;
  name: string;
  mrp_price: number;
  selling_price: number;
  discount_percent?: number;
  dine_in_price?: number;
  takeaway_price?: number;
  delivery_price?: number;
};

export type MenuItemFormData = {
  name: string;
  description: string;
  menu_id: number;
  category_id?: number;
  food_type: 'veg' | 'non-veg';
  halal: boolean;
  stock_type: 'limited' | 'unlimited' | 'out_of_stock';
  stock_qty?: number;
  stock_unit?: string;
  customer_limit?: number;
  customer_limit_period?: string;
  image?: string;
  preparation_time: number;
  variations: Variation[];
};

/* ================= MENUS ================= */

// ➕ Add Menu
export const addMenu = async (name: string) => {
  const res = await api.post(
    "/seller/menu-settings/add.php",
    JSON.stringify({ name })
  );
  return res.data;
};

// 📄 Get Menus
export const getMenus = async (): Promise<Menu[]> => {
  const res = await api.get("/seller/menu-settings/list.php");
  return res.data;
};

// ❌ Delete Menu
export const deleteMenu = async (id: number) => {
  const res = await api.delete(`/seller/menu-settings/delete.php?id=${id}`);
  return res.data;
};

// ✏️ Update Menu
export const updateMenu = async (id: number, name: string) => {
  const res = await api.post(
    "/seller/menu-settings/update.php",
    JSON.stringify({ id, name })
  );
  return res.data;
};

/* ================= ITEM CATEGORIES ================= */

// 📄 List Categories
export const getCategories = async (): Promise<ItemCategory[]> => {
  const res = await api.get("/seller/item-categories/list.php");
  return res.data;
};

// ➕ Add Category
export const addCategory = async (name: string, menu_id?: number) => {
  const res = await api.post(
    "/seller/item-categories/add.php",
    JSON.stringify({ name, menu_id })
  );
  return res.data;
};

// ✏️ Update Category
export const updateCategory = async (id: number, name: string) => {
  const res = await api.post(
    "/seller/item-categories/update.php",
    JSON.stringify({ id, name })
  );
  return res.data;
};

// ❌ Delete Category
export const deleteCategory = async (id: number) => {
  const res = await api.post(
    "/seller/item-categories/delete.php",
    JSON.stringify({ id })
  );
  return res.data;
};

/* ================= MENU ITEMS ================= */

// 📄 Get Menu Items
export const getMenuItems = async (): Promise<MenuItem[]> => {
  const res = await api.get("/seller/menu-items/list.php");
  return res.data;
};

// 📄 Get Menu Item by ID
export const getMenuItem = async (id: number): Promise<MenuItem> => {
  const res = await api.get(`/seller/menu-items/get.php?id=${id}`);
  return res.data;
};

// ➕ Add Menu Item
export const addMenuItem = async (data: MenuItemFormData) => {
  const res = await api.post(
    "/seller/menu-items/add.php",
    JSON.stringify(data)
  );
  return res.data;
};

// ✏️ Update Menu Item
export const updateMenuItem = async (id: number, data: Partial<MenuItemFormData>) => {
  const res = await api.post(
    `/seller/menu-items/update.php?id=${id}`,
    JSON.stringify({ id, ...data })
  );
  return res.data;
};

// ❌ Delete Menu Item
export const deleteMenuItem = async (id: number) => {
  const res = await api.post(
    "/seller/menu-items/delete.php",
    JSON.stringify({ id })
  );
  return res.data;
};

// 🔄 Toggle Availability
export const toggleMenuItemAvailability = async (id: number, is_available: boolean) => {
  const res = await api.post(
    "/seller/menu-items/toggle-availability.php",
    JSON.stringify({ id, is_available })
  );
  return res.data;
};

// 👁️ Toggle Visibility
export const toggleMenuItemVisibility = async (id: number, show_on_site: boolean) => {
  const res = await api.post(
    "/seller/menu-items/toggle-visibility.php",
    JSON.stringify({ id, show_on_site })
  );
  return res.data;
};

// 🏷️ Toggle Best Seller
export const toggleMenuItemBestSeller = async (id: number, is_best_seller: boolean) => {
  const res = await api.post(
    "/seller/menu-items/toggle-best-seller.php",
    JSON.stringify({ id, is_best_seller })
  );
  return res.data;
};