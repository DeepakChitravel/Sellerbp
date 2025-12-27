"use client";

import { useState } from "react";

type FoodItem = {
  food: string;
  price: string;
};

export type SlotData = {
  slotName: string;
  items: FoodItem[];
};

interface Props {
  onRemove?: () => void;
  onSave?: (data: SlotData) => void;
}

export default function FoodSlot({ onRemove, onSave }: Props) {
  const [slotName, setSlotName] = useState("");
  const [items, setItems] = useState<FoodItem[]>([
    { food: "", price: "" },
  ]);

  const addFood = () => {
    setItems([...items, { food: "", price: "" }]);
  };

  const updateItem = (
    index: number,
    key: keyof FoodItem,
    value: string
  ) => {
    const copy = [...items];
    copy[index][key] = value;
    setItems(copy);
  };

  const handleSave = () => {
    if (!slotName.trim()) {
      alert("Please enter slot name");
      return;
    }

    onSave?.({
      slotName,
      items,
    });
  };

  return (
    <div className="border rounded-md p-4 space-y-4 bg-gray-50">
      {/* Slot Name */}
      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Slot name (eg: Mutton, Chicken)"
          className="border p-2 rounded w-full"
          value={slotName}
          onChange={(e) => setSlotName(e.target.value)}
        />

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        )}
      </div>

      {/* Food Rows */}
      {items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Food name"
            className="border p-2 rounded"
            value={item.food}
            onChange={(e) =>
              updateItem(index, "food", e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Price"
            className="border p-2 rounded"
            value={item.price}
            onChange={(e) =>
              updateItem(index, "price", e.target.value)
            }
          />
        </div>
      ))}

      {/* Actions */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={addFood}
          className="text-blue-600 text-sm font-medium"
        >
          + Add food
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm"
        >
          Save Slot
        </button>
      </div>
    </div>
  );
}
