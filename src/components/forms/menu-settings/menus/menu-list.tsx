"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MenuCard from "./menu-card";
import AddMenuModal from "./add-menu-modal";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import {
  addMenu,
  getMenus,
  deleteMenu,
  updateMenu,
} from "@/lib/api/menu-items";

export interface MenuType {
  id: number;
  name: string;
  items: number;
}

export default function MenuList() {
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Modals ---------- */
  const [open, setOpen] = useState(false);
  const [editMenu, setEditMenu] = useState<MenuType | null>(null);

  /* ---------- Delete confirmation ---------- */
  const [deleteMenuId, setDeleteMenuId] = useState<number | null>(null);

  /* ---------- Carousel ---------- */
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* ================= LOAD ================= */
  useEffect(() => {
    getMenus()
      .then(setMenus)
      .finally(() => setLoading(false));
  }, []);

  /* ================= SCROLL STATE ================= */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateButtons = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    updateButtons();
    el.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);

    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [menus]);

  /* ================= SCROLL ACTIONS ================= */
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" });
  };

  /* ================= CRUD ================= */
  const handleAddMenu = async (name: string) => {
    const res = await addMenu(name);
    if (res.success) {
      setMenus(prev => [
        { id: res.id, name: res.name, items: 0 },
        ...prev,
      ]);
      setOpen(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteMenuId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteMenuId) return;

    const res = await deleteMenu(deleteMenuId);
    if (res.success) {
      setMenus(prev => prev.filter(m => m.id !== deleteMenuId));
    }

    setDeleteMenuId(null);
  };

  const handleRenameMenu = (id: number) => {
    const menu = menus.find(m => m.id === id);
    if (menu) setEditMenu(menu);
  };

  const handleUpdateMenu = async (name: string) => {
    if (!editMenu) return;

    const res = await updateMenu(editMenu.id, name);
    if (res.success) {
      setMenus(prev =>
        prev.map(m =>
          m.id === editMenu.id ? { ...m, name } : m
        )
      );
      setEditMenu(null);
    }
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mt-4">
        <h2 className="text-xl font-semibold">Menus</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-purple-500 text-white px-4 py-2 rounded-md"
        >
          Add Menu
        </button>
      </div>

      {/* ================= CAROUSEL ================= */}
      <div className="relative mt-4 w-full max-w-full">
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-12 w-full"
        >
          {loading ? (
            <p>Loading...</p>
          ) : (
            menus.map(menu => (
              <div key={menu.id} className="shrink-0 w-[320px]">
                <MenuCard
                  menu={menu}
                  onRename={handleRenameMenu}
                  onDelete={handleDeleteClick} // ✅ popup trigger
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {open && (
        <AddMenuModal
          title="Add Menu"
          onClose={() => setOpen(false)}
          onSave={handleAddMenu}
        />
      )}

      {editMenu && (
        <AddMenuModal
          title="Rename Menu"
          initialName={editMenu.name}
          onClose={() => setEditMenu(null)}
          onSave={handleUpdateMenu}
        />
      )}

      {/* ================= DELETE CONFIRMATION ================= */}
      <ConfirmationModal
        isOpen={deleteMenuId !== null}
        onClose={() => setDeleteMenuId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Menu"
        description="Are you sure you want to delete this menu? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
