"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onSave: (name: string) => void;
  initialName?: string;   // 👈 NEW
  title?: string;         // 👈 NEW
}

export default function AddMenuModal({
  onClose,
  onSave,
  initialName = "",
  title = "Add Menu",
}: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave(name.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* INPUT */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Menu Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Eg: North Indian Delights"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
