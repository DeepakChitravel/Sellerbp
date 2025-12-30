"use client";

import { useEffect, useState } from "react";
import AddCategoryModal from "./add-category-modal";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api/item-categories";
import DeleteCategoryModal from "./delete-category-modal";
import { Plus, Edit2, Trash2, Loader2, FolderOpen } from "lucide-react";
import toast from "react-hot-toast";

export interface Category {
  id: number;
  name: string;
  items: number;
}

export default function ItemCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Category | null>(null);
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);
  const [processing, setProcessing] = useState(false);

  /* 🔄 LOAD */
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load categories");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ➕ ADD CATEGORY */
  const handleAdd = async (name: string): Promise<string | null> => {
    setProcessing(true);
    try {
      const exists = categories.some(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );

      if (exists) {
        return "Category already exists";
      }

      const res = await addCategory(name);

      if (!res?.success) {
        return "Failed to save category";
      }

      setCategories((prev) => [
        { id: res.id, name: res.name, items: 0 },
        ...prev,
      ]);

      setOpen(false);
      toast.success("Category added successfully");
      return null;
    } catch (error) {
      toast.error("Failed to add category");
      return "An unexpected error occurred";
    } finally {
      setProcessing(false);
    }
  };

  /* ✏️ UPDATE CATEGORY */
  const handleUpdate = async (name: string): Promise<string | null> => {
    setProcessing(true);
    try {
      if (!edit) return "Invalid category";

      const exists = categories.some(
        (c) =>
          c.name.toLowerCase() === name.toLowerCase() &&
          c.id !== edit.id
      );

      if (exists) {
        return "Category already exists";
      }

      const res = await updateCategory(edit.id, name);

      if (!res?.success) {
        return "Failed to update category";
      }

      setCategories((prev) =>
        prev.map((c) =>
          c.id === edit.id ? { ...c, name } : c
        )
      );

      setEdit(null);
      toast.success("Category updated successfully");
      return null;
    } catch (error) {
      toast.error("Failed to update category");
      return "An unexpected error occurred";
    } finally {
      setProcessing(false);
    }
  };

  /* ❌ DELETE CATEGORY */
  const confirmDelete = async () => {
    if (!deleteCat) return;

    setProcessing(true);
    try {
      const res = await deleteCategory(deleteCat.id);

      if (res?.success) {
        setCategories(prev =>
          prev.filter(c => c.id !== deleteCat.id)
        );
        toast.success("Category deleted successfully");
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setDeleteCat(null);
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Item Categories</h1>
          <p className="text-gray-600 mt-1">Manage your menu item categories</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          disabled={processing}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add Item Category
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* TABLE HEADER */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-800">All Categories</h2>
            <span className="bg-gray-100 text-gray-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {categories.length}
            </span>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Menu Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      <p className="text-gray-500">Loading categories...</p>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <FolderOpen className="h-12 w-12 text-gray-300" />
                      <div>
                        <p className="text-gray-500 font-medium">No categories found</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Get started by adding your first category
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr 
                    key={cat.id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-800 font-medium">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {cat.items} Item{cat.items !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEdit(cat)}
                          disabled={processing}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteCat(cat)}
                          disabled={processing || cat.items > 0}
                          title={cat.items > 0 ? "Cannot delete category with items" : "Delete category"}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MODAL */}
      {open && (
        <AddCategoryModal
          title="Add Item Category"
          onClose={() => setOpen(false)}
          onAdd={handleAdd}
          processing={processing}
        />
      )}

      {/* UPDATE MODAL */}
      {edit && (
        <AddCategoryModal
          title="Update Item Category"
          initialName={edit.name}
          onClose={() => setEdit(null)}
          onAdd={handleUpdate}
          processing={processing}
        />
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteCat && (
        <DeleteCategoryModal
          name={deleteCat.name}
          itemsCount={deleteCat.items}
          onClose={() => setDeleteCat(null)}
          onConfirm={confirmDelete}
          processing={processing}
        />
      )}
    </div>
  );
}