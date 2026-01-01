"use client";

import { useState, useEffect } from "react";
import {
  X, Trash2, Plus, Info, AlertCircle,
  ShoppingBag, Users, Tag, IndianRupee,
  Percent, Calendar, Clock, Shield
} from "lucide-react";

interface Props {
  onClose: () => void;
  onItemAdded?: () => void; 
}
import { addMenuItem } from "@/lib/api/menu-items";
import {
  getMenus, getCategories,
} from "@/lib/api/menu-items";
import type { Menu, ItemCategory } from "@/lib/api/menu-items";


type Variation = {
  id: number;
  name: string;
  mrpPrice: string;
  sellingPrice: string;
  discountPercent: string;
  isActive: boolean;
  dineInPrice: string | null;
  takeawayPrice: string | null;
  deliveryPrice: string | null;
};

export default function AddMenuItemForm({ onClose, onItemAdded }: Props) {
  const [categories, setCategories] = useState<ItemCategory[]>([]);

  const [hasVariations, setHasVariations] = useState(true);
  const [foodType, setFoodType] = useState<"veg" | "nonveg">("veg");
  const [isHalal, setIsHalal] = useState(false);
  const [stockType, setStockType] = useState<"unlimited" | "out" | "limited">("unlimited");
  const [stockQty, setStockQty] = useState("");
  const [stockUnit, setStockUnit] = useState("pcs");
  const [customerLimitEnabled, setCustomerLimitEnabled] = useState(false);
  const [customerLimitQty, setCustomerLimitQty] = useState("");
  const [customerLimitPeriod, setCustomerLimitPeriod] = useState<"per_order" | "per_day" | "per_week" | "per_month">("per_order");
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menuCategory, setMenuCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [variations, setVariations] = useState<Variation[]>([
    {
      id: 1,
      name: "Small",
      mrpPrice: "",
      sellingPrice: "",
      discountPercent: "",
      isActive: true,
      dineInPrice: null,
      takeawayPrice: null,
      deliveryPrice: null,
    },
  ]);
  useEffect(() => {
    if (!menuCategory) {
      setCategories([]);
      setSubCategory("");
      return;
    }

    getCategories(Number(menuCategory))
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [menuCategory]);

  useEffect(() => {
    getMenus().then(setMenus);
  }, []);
  // New form state fields
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");

  const [preparationTime, setPreparationTime] = useState("15");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addVariation = () => {
    setVariations([
      ...variations,
      {
        id: variations.length + 1,
        name: `Variation ${variations.length + 1}`,
        mrpPrice: "",
        sellingPrice: "",
        discountPercent: "",
        isActive: true,
        dineInPrice: "",
        takeawayPrice: "",
        deliveryPrice: ""
      }
    ]);
  };

  const removeVariation = (id: number) => {
    if (variations.length > 1) {
      setVariations(variations.filter(v => v.id !== id));
    }
  };




  const updateVariation = (id: number, field: keyof Variation, value: string) => {
    setVariations(variations.map(v => {
      if (v.id === id) {
        const updated = { ...v, [field]: value };

        // Calculate discount percentage automatically if both MRP and Selling price are provided
        if (field === 'mrpPrice' || field === 'sellingPrice') {
          const mrp = parseFloat(updated.mrpPrice) || 0;
          const selling = parseFloat(updated.sellingPrice) || 0;

          if (mrp > 0 && selling > 0) {
            const discount = ((mrp - selling) / mrp) * 100;
            updated.discountPercent = discount.toFixed(0);
          } else {
            updated.discountPercent = "";
          }
        }

        return updated;
      }
      return v;
    }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };



  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!itemName.trim()) {
      alert("Please enter item name");
      return;
    }

    if (!menuCategory) {
      alert("Please select a menu category");
      return;
    }

    if (hasVariations) {
      // Validate variations
      for (const variation of variations) {
        if (!variation.name.trim()) {
          alert(`Please enter name for Variation ${variation.id}`);
          return;
        }
        if (!variation.mrpPrice || parseFloat(variation.mrpPrice) <= 0) {
          alert(`Please enter valid MRP price for ${variation.name}`);
          return;
        }
        if (!variation.sellingPrice || parseFloat(variation.sellingPrice) <= 0) {
          alert(`Please enter valid selling price for ${variation.name}`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare form data
      const formData = {
        name: itemName,
        description: description,
        menu_id: Number(menuCategory),
        category_id: subCategory ? parseInt(subCategory) : null,
        food_type: foodType === "nonveg" ? "non-veg" : "veg",
        halal: isHalal,
        stock_type:
          stockType === "out" ? "out_of_stock" : stockType,
        stock_qty: stockType === "limited" ? parseInt(stockQty) || 0 : null,
        stock_unit: stockType === "limited" ? stockUnit : null,
        customer_limit: customerLimitEnabled ? parseInt(customerLimitQty) || 0 : null,
        customer_limit_period: customerLimitEnabled ? customerLimitPeriod : null,
        preparation_time: parseInt(preparationTime) || 15,
        variations: hasVariations ? variations.map(v => ({
          name: v.name,
          mrp_price: parseFloat(v.mrpPrice) || 0,
          selling_price: parseFloat(v.sellingPrice) || 0,
          discount_percent: parseFloat(v.discountPercent) || 0,
          dine_in_price: v.dineInPrice ? parseFloat(v.dineInPrice) : null,
          takeaway_price: v.takeawayPrice ? parseFloat(v.takeawayPrice) : null,
          delivery_price: v.deliveryPrice ? parseFloat(v.deliveryPrice) : null
        })) : [],
        spice_level: "Medium",
        tags: []
      };

      // First, upload image if exists
      let imageUrl = "";
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        const uploadResponse = await fetch('/api/seller/upload.php', {
          method: 'POST',
          body: imageFormData,
          credentials: 'include'
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.imageUrl || "";
        }
      }

      // Add image URL to form data
      const finalData = {
        ...formData,
        image: imageUrl
      };

      // Send to API
      const response = await fetch(
        'http://localhost/managerbp/public/seller/menu-items/add.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalData),
          credentials: 'include',
        }
      );


      const result = await response.json();

      if (result.success) {
        alert("Menu item added successfully!");
        if (onItemAdded) onItemAdded();
        onClose();
      } else {
        alert(result.message || "Failed to add menu item");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle save as draft
  const handleSaveAsDraft = async () => {
    // Similar to handleSubmit but with draft status
    alert("Draft saved! (You can implement draft functionality similarly)");
  };

  return (
    <>
      {/* 🔴 Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-200"
        onClick={onClose}
      />

      {/* 🟢 Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">

          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b px-8 py-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add Menu Item</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Add a new item to your menu with all details including pricing, stock, and restrictions
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>
          </div>

          {/* Body */}
          <form className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8" onSubmit={handleSubmit}>
            {/* ================= LEFT: PRODUCT INFO ================= */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">📦</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Butter Chicken, Margherita Pizza"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe your dish, ingredients, special notes..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Menu Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={menuCategory}
                        onChange={(e) => setMenuCategory(e.target.value)}
                        required
                      >
                        <option value="">Select Menu</option>
                        {menus.map((menu) => (
                          <option key={menu.id} value={menu.id}>
                            {menu.name}
                          </option>
                        ))}
                      </select>

                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub Category
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        disabled={!menuCategory}
                      >
                        <option value="">Select Item Category</option>

                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>

                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preparation Time (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      placeholder="15"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={preparationTime}
                      onChange={(e) => setPreparationTime(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Average time needed to prepare this item
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= STOCK MANAGEMENT ================= */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-semibold">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Stock Management</h3>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Stock Status <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setStockType("unlimited")}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200
                        ${stockType === "unlimited"
                          ? "border-purple-600 bg-purple-50 text-purple-700 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center
                        ${stockType === "unlimited" ? "bg-purple-100" : "bg-gray-100"}`}>
                        <span className="text-xl">♾️</span>
                      </div>
                      <span className="text-sm font-medium">Unlimited</span>
                      <span className="text-xs text-gray-500 text-center">Always available</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStockType("limited")}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200
                        ${stockType === "limited"
                          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center
                        ${stockType === "limited" ? "bg-blue-100" : "bg-gray-100"}`}>
                        <span className="text-xl">📦</span>
                      </div>
                      <span className="text-sm font-medium">Limited Stock</span>
                      <span className="text-xs text-gray-500 text-center">Track inventory</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStockType("out")}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200
                        ${stockType === "out"
                          ? "border-red-600 bg-red-50 text-red-700 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center
                        ${stockType === "out" ? "bg-red-100" : "bg-gray-100"}`}>
                        <span className="text-xl">🚫</span>
                      </div>
                      <span className="text-sm font-medium">Out of Stock</span>
                      <span className="text-xs text-gray-500 text-center">Hidden from menu</span>
                    </button>
                  </div>

                  {/* Limited Stock Input */}
                  {stockType === "limited" && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                          Set available stock quantity
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Available Quantity <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="100"
                              value={stockQty}
                              onChange={(e) => setStockQty(e.target.value)}
                              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Unit <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={stockUnit}
                            onChange={(e) => setStockUnit(e.target.value)}
                            className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            required
                          >
                            <option value="pcs">Pieces (pcs)</option>
                            <option value="g">Grams (g)</option>
                            <option value="kg">Kilograms (kg)</option>
                            <option value="ml">Milliliters (ml)</option>
                            <option value="ltr">Liters (ltr)</option>
                            <option value="plates">Plates</option>
                            <option value="servings">Servings</option>
                            <option value="portions">Portions</option>
                            <option value="bowls">Bowls</option>
                          </select>
                        </div>
                      </div>
                      <p className="text-xs text-blue-600">
                        Item will be automatically marked "Sold Out" when stock reaches zero.
                      </p>
                    </div>
                  )}

                  {/* Stock Type Messages */}
                  {stockType === "unlimited" && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-purple-600 mt-0.5" />
                        <span className="text-sm text-purple-700">
                          This item will always be available for ordering. No inventory tracking required.
                        </span>
                      </div>
                    </div>
                  )}

                  {stockType === "out" && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                        <span className="text-sm text-red-700">
                          This item will not be visible to customers and cannot be ordered.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ================= CUSTOMER PURCHASE LIMIT ================= */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Customer Purchase Limit</h3>
                      <p className="text-sm text-gray-500">Restrict how many items a customer can buy</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customerLimitEnabled}
                      onChange={(e) => setCustomerLimitEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                      peer-checked:after:translate-x-full peer-checked:after:border-white 
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-white after:border-gray-300 after:border after:rounded-full 
                      after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                    </div>
                  </label>
                </div>

                {customerLimitEnabled && (
                  <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Quantity Per Customer <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={customerLimitQty}
                          onChange={(e) => setCustomerLimitQty(e.target.value)}
                          placeholder="e.g., 2"
                          className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Maximum items a single customer can order
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Limit Period <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={customerLimitPeriod}
                          onChange={(e) => setCustomerLimitPeriod(e.target.value as any)}
                          className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        >
                          <option value="per_order">Per Order</option>
                          <option value="per_day">Per Day</option>
                          <option value="per_week">Per Week</option>
                          <option value="per_month">Per Month</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          How often the limit resets
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Limit Details:</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Customers will be restricted to {customerLimitQty || "_"} items
                            {customerLimitPeriod === "per_order" && " per order"}
                            {customerLimitPeriod === "per_day" && " per day"}
                            {customerLimitPeriod === "per_week" && " per week"}
                            {customerLimitPeriod === "per_month" && " per month"}
                            . This helps prevent bulk buying and ensures fair distribution.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ================= RIGHT: PRICING & VARIATIONS ================= */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">💰</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Pricing & Variations</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Item Variations
                      </label>
                      <p className="text-sm text-gray-500">Add different sizes or types</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasVariations}
                        onChange={() => setHasVariations(!hasVariations)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                        peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                        after:bg-white after:border-gray-300 after:border after:rounded-full 
                        after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                      </div>
                    </label>
                  </div>

                  {hasVariations ? (
                    <div className="space-y-4">
                      {variations.map((variation) => (
                        <div key={variation.id} className="border border-gray-200 rounded-xl p-4 space-y-4 bg-white hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 text-sm font-medium">V{variation.id}</span>
                              </div>
                              <h4 className="font-medium text-gray-900">Variation {variation.id}</h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeVariation(variation.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              disabled={variations.length <= 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Variation Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                value={variation.name}
                                onChange={(e) => updateVariation(variation.id, 'name', e.target.value)}
                                placeholder="e.g., Small, Medium, Large, Family Pack"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            {/* MRP and Selling Price */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  MRP Price (₹) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500" />
                                  <input
                                    value={variation.mrpPrice}
                                    onChange={(e) => updateVariation(variation.id, 'mrpPrice', e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Selling Price (₹) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500" />
                                  <input
                                    value={variation.sellingPrice}
                                    onChange={(e) => updateVariation(variation.id, 'sellingPrice', e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Discount Display */}
                            {variation.discountPercent && (
                              <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Percent className="w-3 h-3 text-green-600" />
                                    <span className="text-xs font-medium text-green-700">Discount Applied</span>
                                  </div>
                                  <span className="text-sm font-bold text-green-700">
                                    {variation.discountPercent}% OFF
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  MRP: ₹{variation.mrpPrice} → Selling: ₹{variation.sellingPrice}
                                </div>
                              </div>
                            )}

                            {/* Service Type Prices */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-700 font-medium">Service Type</span>
                                <span className="text-gray-700 font-medium">Price (₹)</span>
                              </div>
                              {[
                                { type: "Dine In", value: variation.dineInPrice ?? variation.sellingPrice ?? "" },
                                { type: "Takeaway", value: variation.takeawayPrice ?? variation.sellingPrice ?? "" },
                                { type: "Delivery", value: variation.deliveryPrice ?? variation.sellingPrice ?? "" },
                              ]
                                .map((service) => (
                                  <div key={service.type} className="flex justify-between items-center border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50">
                                    <span className="text-sm text-gray-700">{service.type}</span>
                                    <div className="flex items-center gap-2">
                                      <IndianRupee className="w-3 h-3 text-gray-500" />
                                      <input
                                        value={service.value}
                                        onChange={(e) => updateVariation(variation.id, `${service.type.toLowerCase().replace(' ', '')}Price` as any, e.target.value)}
                                        placeholder="0.00"
                                        className="w-24 px-3 py-1 border border-gray-300 rounded text-right"
                                      />
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addVariation}
                        className="w-full border-2 border-dashed border-gray-300 rounded-xl py-4 text-gray-600 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add Another Variation
                      </button>
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">💲</span>
                      </div>
                      <p className="text-gray-600">No variations. Single price for all customers.</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Enable variations to add different sizes or types with separate pricing
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ================= ADDITIONAL SETTINGS ================= */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">⚙️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Additional Settings</h3>
                </div>

                <div className="space-y-5">
                  {/* Food Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Food Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFoodType("veg")}
                        className={`flex items-center justify-between gap-3 px-4 py-3 border-2 rounded-xl transition-all
                          ${foodType === "veg"
                            ? "border-green-600 bg-green-50 text-green-700 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center
                            ${foodType === "veg" ? "border-green-600" : "border-gray-300"}`}>
                            <div className={`w-2.5 h-2.5 rounded-full
                              ${foodType === "veg" ? "bg-green-600" : "bg-transparent"}`} />
                          </div>
                          <span className="font-medium">Vegetarian</span>
                        </div>
                        <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                          🥬
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFoodType("nonveg")}
                        className={`flex items-center justify-between gap-3 px-4 py-3 border-2 rounded-xl transition-all
                          ${foodType === "nonveg"
                            ? "border-red-600 bg-red-50 text-red-700 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center
                            ${foodType === "nonveg" ? "border-red-600" : "border-gray-300"}`}>
                            <div className={`w-2.5 h-2.5 rounded-full
                              ${foodType === "nonveg" ? "bg-red-600" : "bg-transparent"}`} />
                          </div>
                          <span className="font-medium">Non-Vegetarian</span>
                        </div>
                        <div className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                          🍗
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Halal Certification */}
                  <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Halal Certified</h4>
                        <p className="text-xs text-gray-600">Mark if this item is Halal certified</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isHalal}
                        onChange={(e) => setIsHalal(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                        peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                        after:bg-white after:border-gray-300 after:border after:rounded-full 
                        after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600">
                      </div>
                    </label>
                  </div>

                  {isHalal && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">Halal Certification</p>
                          <p className="text-xs text-amber-700 mt-1">
                            This item will display a Halal certified badge on customer menus.
                            Ensure all ingredients meet Halal certification standards.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Food Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                      {imagePreview ? (
                        <div className="mb-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg mx-auto"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">📷</span>
                        </div>
                      )}
                      <p className="text-gray-700 font-medium">Upload Food Image</p>
                      <p className="text-sm text-gray-500 mt-1 mb-3">JPG, PNG or WebP. Max 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="food-image"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="food-image" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer">
                        <Plus className="w-4 h-4" />
                        Browse Files
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Required fields must be filled
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save & Publish Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}