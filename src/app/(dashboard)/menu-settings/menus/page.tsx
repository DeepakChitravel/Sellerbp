"use client";

import { useState } from "react";
import MenuList from "@/components/forms/menu-settings/menus/menu-list";
import MenuItemsTable from "@/components/forms/menu-settings/menus/menu-items-table";
import AddMenuItemForm from "@/components/forms/menu-settings/menu-items/add-menu-item-form";

export default function MenusPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="p-6">
      {/* MENU CARDS */}
      <MenuList />

      {/* MENU ITEMS HEADER */}
      <div className="flex justify-between items-center mt-8">
        <h2 className="text-xl font-semibold">Menu Items</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Add Menu Item
        </button>
      </div>

      <MenuItemsTable />

      {/* FULL SCREEN FORM */}
      {showAddForm && (
        <AddMenuItemForm onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
}
