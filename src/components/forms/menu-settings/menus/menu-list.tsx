"use client";

import { useEffect, useState } from "react";
import MenuCard from "./menu-card";
import AddMenuModal from "./add-menu-modal";
import { addMenu, getMenus } from "@/lib/api/menu-items";

export interface MenuType {
  id: number;
  name: string;
  items: number;
  active?: boolean;
}

export default function MenuList() {
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ LOAD MENUS FROM DB
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await getMenus();
        setMenus(data);
      } catch (err) {
        console.error("Failed to load menus", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // ✅ SAVE MENU TO DB
  const handleAddMenu = async (name: string) => {
    try {
      const res = await addMenu(name);

      if (res.success) {
        setMenus((prev) => [
          {
            id: res.id,
            name: res.name,
            items: 0,
          },
          ...prev,
        ]);
        setOpen(false);
      } else {
        alert(res.message || "Failed to save menu");
      }
    } catch (err) {
      console.error("Add menu error", err);
      alert("Server error");
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mt-4">
        <h2 className="text-xl font-semibold">Menus</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-purple-500 text-white px-4 py-2 rounded-md"
        >
          Add Menu
        </button>
      </div>

      {/* MENU CARDS */}
      <div className="flex gap-4 mt-4">
        {loading ? (
          <p>Loading menus...</p>
        ) : menus.length === 0 ? (
          <p className="text-gray-500">No menus found</p>
        ) : (
          menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))
        )}
      </div>

      {/* MODAL */}
      {open && (
        <AddMenuModal
          onClose={() => setOpen(false)}
          onSave={handleAddMenu}
        />
      )}
    </>
  );
}
