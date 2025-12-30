"use client";

import { useEffect, useState } from "react";
import {
  Pencil, Trash2, Eye, EyeOff, Package,
  Clock, Tag, TrendingUp, AlertCircle,
  ChevronDown, MoreVertical, Star,
  ShoppingBag, IndianRupee, Users,
  Loader2, Filter, Grid3x3, Search,
  Plus, Upload
} from "lucide-react";
import {
  getMenuItems,
  getMenus,
  getCategories,
  deleteMenuItem,
  toggleMenuItemAvailability,
  toggleMenuItemVisibility,
  toggleMenuItemBestSeller
} from "@/lib/api/menu-items";
import type { MenuItem, Menu, ItemCategory } from "@/lib/api/menu-items";
import toast from "react-hot-toast";

export default function MenuItemsTable() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMenu, setSelectedMenu] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [processing, setProcessing] = useState<string>("");

  // Load all data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsData, menusData, categoriesData] = await Promise.all([
        getMenuItems(),
        getMenus(),
        getCategories()
      ]);
      
      setItems(itemsData);
      setMenus(menusData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load menu data");
    } finally {
      setLoading(false);
    }
  };

  // Transform stock data for display
  const getStockDisplay = (item: MenuItem) => {
    if (item.stock_type === 'unlimited') return 'Unlimited Stock';
    if (item.stock_type === 'limited' && item.stock_qty && item.stock_qty > 0) {
      return `${item.stock_qty} ${item.stock_unit || ''} left`.trim();
    }
    return 'Out of Stock';
  };

  // Filter and sort items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMenu = selectedMenu === "all" || 
                       item.menu_id.toString() === selectedMenu;
    
    const matchesCategory = selectedCategory === "all" || 
                           (item.category_id?.toString() === selectedCategory);
    
    return matchesSearch && matchesMenu && matchesCategory;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.order_count - a.order_count;
      case "recent":
        return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime();
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const toggleSelectAll = () => {
    if (selectedItems.length === sortedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedItems.map(item => item.id));
    }
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    
    try {
      setProcessing(`delete-${id}`);
      const res = await deleteMenuItem(id);
      
      if (res.success) {
        setItems(prev => prev.filter(item => item.id !== id));
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
        toast.success("Item deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete item");
      }
    } catch (error) {
      toast.error("Failed to delete item");
    } finally {
      setProcessing("");
    }
  };

  const handleToggleAvailability = async (id: number, currentStatus: boolean) => {
    try {
      setProcessing(`availability-${id}`);
      const res = await toggleMenuItemAvailability(id, !currentStatus);
      
      if (res.success) {
        setItems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, is_available: !currentStatus } : item
          )
        );
        toast.success("Availability updated successfully");
      } else {
        toast.error(res.message || "Failed to update availability");
      }
    } catch (error) {
      toast.error("Failed to update availability");
    } finally {
      setProcessing("");
    }
  };

  const handleToggleVisibility = async (id: number, currentStatus: boolean) => {
    try {
      setProcessing(`visibility-${id}`);
      const res = await toggleMenuItemVisibility(id, !currentStatus);
      
      if (res.success) {
        setItems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, show_on_site: !currentStatus } : item
          )
        );
        toast.success("Visibility updated successfully");
      } else {
        toast.error(res.message || "Failed to update visibility");
      }
    } catch (error) {
      toast.error("Failed to update visibility");
    } finally {
      setProcessing("");
    }
  };

  const handleToggleBestSeller = async (id: number, currentStatus: boolean) => {
    try {
      setProcessing(`bestseller-${id}`);
      const res = await toggleMenuItemBestSeller(id, !currentStatus);
      
      if (res.success) {
        setItems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, is_best_seller: !currentStatus } : item
          )
        );
        toast.success("Best seller status updated");
      } else {
        toast.error(res.message || "Failed to update best seller status");
      }
    } catch (error) {
      toast.error("Failed to update best seller status");
    } finally {
      setProcessing("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
            <p className="text-gray-600 mt-1">
              Manage your restaurant menu items, categories, and menus
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {items.length} Items
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-green-600">
              {items.filter(item => item.is_available).length} available
            </span>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-3">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search menu items by name, description, or tags..."
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
                    Menu
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={selectedMenu}
                    onChange={(e) => setSelectedMenu(e.target.value)}
                  >
                    <option value="all">All Menus</option>
                    {menus.map(menu => (
                      <option key={menu.id} value={menu.id}>
                        {menu.name} ({menu.items || 0} items)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.items || 0} items)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>All Items</option>
                    <option>Available Only</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="recent">Recently Added</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name">Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-blue-700 font-medium">
                {selectedItems.length} items selected
              </span>
              <div className="h-4 w-px bg-blue-300"></div>
              <button className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 hover:bg-blue-100 rounded-lg">
                Bulk Edit
              </button>
              <button className="text-sm text-red-600 hover:text-red-800 px-3 py-1 hover:bg-red-100 rounded-lg">
                Bulk Delete
              </button>
              <button className="text-sm text-green-600 hover:text-green-800 px-3 py-1 hover:bg-green-100 rounded-lg">
                Toggle Availability
              </button>
            </div>
            <button
              onClick={() => setSelectedItems([])}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="relative w-full overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === sortedItems.length && sortedItems.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                    <span className="text-xs font-semibold text-gray-700 uppercase">Item Details</span>
                  </label>
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Pricing</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Stock & Info</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Performance</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="w-12 h-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchQuery || selectedMenu !== "all" || selectedCategory !== "all" 
                          ? "No menu items found" 
                          : "No menu items yet"}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery || selectedMenu !== "all" || selectedCategory !== "all" 
                          ? "Try adjusting your filters" 
                          : "Get started by adding your first menu item"}
                      </p>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 shadow-sm transition-all">
                        <Plus className="w-4 h-4" />
                        Add Menu Item
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedItems.map((item) => {
                  const stockDisplay = getStockDisplay(item);
                  const categoryName = categories.find(cat => cat.id === item.category_id)?.name || "Uncategorized";
                  const menuName = menus.find(menu => menu.id === item.menu_id)?.name || "Unknown Menu";
                  
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${!item.is_available ? 'opacity-60' : ''}`}
                    >
                      {/* Item Details */}
                      <td className="p-4">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleSelectItem(item.id)}
                            className="mt-5 w-4 h-4 text-blue-600 rounded border-gray-300"
                          />
                          <div className="relative">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="w-8 h-8 text-amber-400" />
                                </div>
                              )}
                            </div>
                            {item.is_best_seller && (
                              <div className="absolute -top-2 -right-2">
                                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                  🔥
                                </span>
                              </div>
                            )}
                            {item.food_type === 'veg' ? (
                              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                <span className="text-white text-xs font-bold">V</span>
                              </div>
                            ) : (
                              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                <span className="text-white text-xs font-bold">NV</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900 truncate max-w-full">
                                    {item.name}
                                  </h3>
                                  {item.original_price && item.original_price > item.price && (
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                      Save ₹{item.original_price - item.price}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 break-words max-w-full">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {item.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {categoryName}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="flex items-center gap-1">
                                <span className="font-medium">{menuName}</span>
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Updated {item.last_updated}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-baseline gap-2">
                            <IndianRupee className="w-4 h-4 text-gray-500" />
                            <span className="text-xl font-bold text-gray-900">{item.price}</span>
                            {item.original_price && item.original_price > item.price && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{item.original_price}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Selling Price</span>
                              <span className="font-medium">₹{item.price}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">MRP</span>
                              <span className="font-medium">₹{item.original_price || item.price}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Stock & Information */}
                      <td className="p-4">
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Package className={`w-4 h-4 ${
                                stockDisplay.includes("Unlimited")
                                  ? "text-green-600"
                                  : stockDisplay.includes("Out of Stock")
                                    ? "text-red-600"
                                    : "text-amber-600"
                              }`} />
                              <span className={`text-sm font-medium ${
                                stockDisplay.includes("Unlimited")
                                  ? "text-green-700"
                                  : stockDisplay.includes("Out of Stock")
                                    ? "text-red-700"
                                    : "text-amber-700"
                              }`}>
                                {stockDisplay}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Clock className="w-3 h-3" />
                              Prep: {item.preparation_time} mins
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Spice Level</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                item.spice_level === "Mild"
                                  ? "bg-green-100 text-green-800"
                                  : item.spice_level === "Medium"
                                    ? "bg-amber-100 text-amber-800"
                                    : item.spice_level === "Hot"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}>
                                {item.spice_level || "Medium"}
                              </span>
                            </div>

                            {item.customer_limit && item.customer_limit > 0 && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Customer Limit</span>
                                <span className="flex items-center gap-1 font-medium">
                                  <Users className="w-3 h-3" />
                                  {item.customer_limit}/order
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category Info */}
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {categoryName}
                            </span>
                            <p className="text-xs text-gray-600">{menuName}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            Menu ID: {item.menu_id}
                            {item.category_id && ` • Category ID: ${item.category_id}`}
                          </div>
                        </div>
                      </td>

                      {/* Performance */}
                      <td className="p-4">
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Orders</span>
                              <div className="flex items-center gap-1">
                                <ShoppingBag className="w-3 h-3 text-blue-600" />
                                <span className="font-semibold">{item.order_count}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Rating</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span className="font-semibold">{item.rating}</span>
                              </div>
                            </div>
                          </div>

                          {item.is_best_seller && (
                            <div className="text-xs bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 px-2 py-1.5 rounded-lg text-center border border-amber-200">
                              ⚡ Best Seller
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Available</span>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.is_available
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {item.is_available ? "Yes" : "No"}
                              </div>
                            </div>
                            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.is_available ? "bg-green-500" : "bg-red-500"}`}
                                style={{ width: item.is_available ? "100%" : "0%" }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Visible</span>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.show_on_site
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {item.show_on_site ? "Shown" : "Hidden"}
                              </div>
                            </div>
                            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.show_on_site ? "bg-blue-500" : "bg-gray-400"}`}
                                style={{ width: item.show_on_site ? "100%" : "0%" }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Item"
                            disabled={processing.includes(`edit-${item.id}`)}
                          >
                            {processing.includes(`edit-${item.id}`) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Pencil className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Item"
                            disabled={processing.includes(`delete-${item.id}`)}
                          >
                            {processing.includes(`delete-${item.id}`) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleToggleAvailability(item.id, item.is_available)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title={item.is_available ? "Mark as unavailable" : "Mark as available"}
                            disabled={processing.includes(`availability-${item.id}`)}
                          >
                            {processing.includes(`availability-${item.id}`) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              item.is_available ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )
                            )}
                          </button>
                          <button
                            onClick={() => handleToggleBestSeller(item.id, item.is_best_seller)}
                            className={`p-2 rounded-lg transition-colors ${
                              item.is_best_seller
                                ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                            title={item.is_best_seller ? "Remove from best sellers" : "Mark as best seller"}
                            disabled={processing.includes(`bestseller-${item.id}`)}
                          >
                            {processing.includes(`bestseller-${item.id}`) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <TrendingUp className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {sortedItems.length > 0 && (
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {sortedItems.length} of {items.length} items
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  1
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Best Sellers</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.is_best_seller).length}
              </p>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.stock_type === 'limited' && (!item.stock_qty || item.stock_qty <= 0)).length}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.length > 0 
                  ? (items.reduce((sum, item) => sum + item.rating, 0) / items.length).toFixed(1)
                  : "0.0"
                }
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-6 h-6 text-blue-600 fill-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}