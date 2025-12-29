"use client";

import Image from "next/image";
import { 
  Search, Filter, Grid3x3, Upload, Plus, 
  MoreVertical, Edit2, Trash2, Eye, EyeOff, 
  Package, Clock, Tag, TrendingUp, AlertCircle,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

const MENU_ITEMS = [
  {
    id: 1,
    name: "Veg Manchow Soup",
    desc: "Spicy vegetable soup with crispy fried noodles.",
    price: 120,
    originalPrice: 150,
    category: "Starters",
    menu: "Indo-Chinese Fusion",
    image: "/static/food-1.jpg",
    veg: true,
    available: true,
    showOnSite: true,
    stock: "Unlimited",
    preparationTime: 15,
    bestSeller: true,
    discount: "20% OFF",
    rating: 4.5,
    orderCount: 245,
    lastUpdated: "2 hours ago"
  },
  {
    id: 2,
    name: "Spring Rolls",
    desc: "Crispy rolls stuffed with vegetables and served with sweet chili sauce.",
    price: 150,
    originalPrice: 180,
    category: "Starters",
    menu: "Indo-Chinese Fusion",
    image: "/static/food-2.jpg",
    veg: true,
    available: true,
    showOnSite: true,
    stock: "Limited: 45 pcs",
    preparationTime: 10,
    bestSeller: true,
    discount: "17% OFF",
    rating: 4.2,
    orderCount: 189,
    lastUpdated: "1 day ago"
  },
  {
    id: 3,
    name: "Chilli Paneer",
    desc: "Paneer tossed in spicy Indo-Chinese sauce with bell peppers and onions.",
    price: 240,
    originalPrice: 280,
    category: "Main Course",
    menu: "Indo-Chinese Fusion",
    image: "/static/food-3.jpg",
    veg: true,
    available: true,
    showOnSite: true,
    stock: "Unlimited",
    preparationTime: 20,
    bestSeller: false,
    discount: "14% OFF",
    rating: 4.7,
    orderCount: 312,
    lastUpdated: "5 hours ago"
  },
  {
    id: 4,
    name: "Chicken Manchurian",
    desc: "Juicy chicken balls tossed in classic Manchurian sauce.",
    price: 260,
    originalPrice: 300,
    category: "Main Course",
    menu: "Indo-Chinese Fusion",
    image: "/static/food-4.jpg",
    veg: false,
    available: false,
    showOnSite: true,
    stock: "Out of Stock",
    preparationTime: 25,
    bestSeller: true,
    discount: "13% OFF",
    rating: 4.8,
    orderCount: 421,
    lastUpdated: "3 days ago"
  },
  {
    id: 5,
    name: "Hakka Noodles",
    desc: "Stir-fried noodles with vegetables in authentic Hakka style.",
    price: 180,
    originalPrice: 200,
    category: "Main Course",
    menu: "Indo-Chinese Fusion",
    image: "/static/food-5.jpg",
    veg: true,
    available: true,
    showOnSite: false,
    stock: "Unlimited",
    preparationTime: 15,
    bestSeller: false,
    discount: "10% OFF",
    rating: 4.3,
    orderCount: 156,
    lastUpdated: "1 week ago"
  },
  {
    id: 6,
    name: "Gobi Manchurian",
    desc: "Crispy cauliflower florets in spicy Manchurian sauce.",
    price: 220,
    originalPrice: 250,
    category: "Starters",
    menu: "Indo-Chinese Fusion",
    image: "/static/food-6.jpg",
    veg: true,
    available: true,
    showOnSite: true,
    stock: "Limited: 28 pcs",
    preparationTime: 18,
    bestSeller: true,
    discount: "12% OFF",
    rating: 4.6,
    orderCount: 278,
    lastUpdated: "Yesterday"
  }
];

export default function MenuItemsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filteredItems = MENU_ITEMS.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.menu.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedItems.length === MENU_ITEMS.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(MENU_ITEMS.map(item => item.id));
    }
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {MENU_ITEMS.length} Items
            </span>
            <span className="text-gray-300">•</span>
            <span>Last updated: Today, 10:30 AM</span>
          </div>
        </div>
        <p className="text-gray-600">
          Manage your restaurant menu items, availability, pricing, and visibility
        </p>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search menu items by name, category, or menu..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                filtersVisible
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {filtersVisible && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 rounded-md transition-colors ${
                  viewMode === "table"
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>

            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" />
              Bulk Upload
            </button>

            <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 shadow-sm transition-all">
              <Plus className="w-5 h-5" />
              Add Menu Item
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {filtersVisible && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All Categories</option>
                  <option>Starters</option>
                  <option>Main Course</option>
                  <option>Desserts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All Status</option>
                  <option>Available</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Menu Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All Menus</option>
                  <option>Indo-Chinese Fusion</option>
                  <option>North Indian Delights</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Best Seller
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All Items</option>
                  <option>Best Sellers Only</option>
                  <option>Regular Items</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header with Stats */}
        <div className="px-6 py-4 border-b bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedItems.length === MENU_ITEMS.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  {selectedItems.length > 0
                    ? `${selectedItems.length} selected`
                    : "Select all"}
                </span>
              </label>
              
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-3">
                  <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 hover:bg-gray-100 rounded">
                    Bulk Edit
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-700 px-3 py-1 hover:bg-red-50 rounded">
                    Bulk Delete
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Total Orders:</span>
                <span className="font-semibold">
                  {MENU_ITEMS.reduce((sum, item) => sum + item.orderCount, 0)}
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                Sort by: Newest
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ITEM DETAILS
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  PRICING
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  STOCK & TIMING
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  CATEGORY
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  PERFORMANCE
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Item Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="mt-5 w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <div className="relative">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <Tag className="w-6 h-6 text-gray-400" />
                          </div>
                        </div>
                        {item.bestSeller && (
                          <div className="absolute -top-1 -right-1">
                            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                              🔥
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full border-2 ${
                            item.veg 
                              ? "border-green-500 bg-green-500/10" 
                              : "border-red-500 bg-red-500/10"
                          }`}>
                            <div className={`w-1 h-1 rounded-full mx-auto mt-0.5 ${
                              item.veg ? "bg-green-500" : "bg-red-500"
                            }`} />
                          </div>
                          <h3 className="font-semibold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          {item.discount && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                              {item.discount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {item.desc}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Pricing */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-gray-600">Base Price:</span>
                        <span className="font-medium">₹{item.price}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-gray-600">Dine-in:</span>
                        <span className="font-medium">₹{item.price + 20}</span>
                      </div>
                    </div>
                  </td>

                  {/* Stock & Timing */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Package className={`w-4 h-4 ${
                          item.stock.includes("Unlimited") 
                            ? "text-green-600" 
                            : item.stock.includes("Out of Stock")
                            ? "text-red-600"
                            : "text-amber-600"
                        }`} />
                        <span className={`text-sm font-medium ${
                          item.stock.includes("Unlimited") 
                            ? "text-green-700" 
                            : item.stock.includes("Out of Stock")
                            ? "text-red-700"
                            : "text-amber-700"
                        }`}>
                          {item.stock}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">
                          {item.preparationTime} mins
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {item.category}
                      </span>
                      <p className="text-xs text-gray-600">{item.menu}</p>
                    </div>
                  </td>

                  {/* Performance */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Orders</span>
                        <span className="font-semibold">{item.orderCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Rating</span>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">{item.rating}</span>
                          <span className="text-amber-500">★</span>
                        </div>
                      </div>
                      {item.bestSeller && (
                        <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded text-center">
                          Top Seller
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Available</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.available}
                            readOnly
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600">
                          </div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Visible</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.showOnSite}
                            readOnly
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600">
                          </div>
                        </label>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredItems.length} of {MENU_ITEMS.length} items
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{MENU_ITEMS.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {MENU_ITEMS.filter(item => item.available).length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Best Sellers</p>
              <p className="text-2xl font-bold text-gray-900">
                {MENU_ITEMS.filter(item => item.bestSeller).length}
              </p>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {MENU_ITEMS.filter(item => item.stock.includes("Out of Stock")).length}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}