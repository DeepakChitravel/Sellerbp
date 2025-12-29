"use client";

import { useState } from "react";
import AddCategoryModal from "./add-category-modal";

const INITIAL_CATEGORIES = [
  { id: 1, name: "Starters", items: 4 },
  { id: 2, name: "Main Course", items: 8 },
  { id: 3, name: "Breads", items: 2 },
  { id: 4, name: "Rice", items: 1 },
  { id: 5, name: "Desserts", items: 0 },
];

export default function ItemCategoriesClient() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Item Categories</h1>

        <div className="flex gap-2">
          <button className="border px-4 py-2 rounded">
            Organize Menu Items
          </button>
          <button
            onClick={() => setOpen(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Add Item Category
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search your item category here"
        className="border rounded px-4 py-2 mt-4 w-80"
      />

      {/* TABLE */}
      <div className="mt-6 border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">ITEM CATEGORY</th>
              <th className="px-4 py-3">MENU ITEMS</th>
              <th className="px-4 py-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="px-4 py-3">{cat.name}</td>
                <td className="px-4 py-3">{cat.items} Item(s)</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button className="border px-3 py-1 rounded text-sm">
                    Update
                  </button>
                  <button className="border border-red-500 text-red-500 px-3 py-1 rounded text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <AddCategoryModal
          onClose={() => setOpen(false)}
          onAdd={(name) =>
            setCategories((prev) => [
              ...prev,
              { id: Date.now(), name, items: 0 },
            ])
          }
        />
      )}
    </div>
  );
}
