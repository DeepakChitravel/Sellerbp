"use client";

import { useEffect, useState } from "react";
import {
  Pencil, Trash2, Eye, EyeOff, Package,
  Tag, TrendingUp, AlertCircle,
  Filter, Search, MoreVertical,
  Plus, Upload, ChevronDown, X,
  Download, BarChart3, Star, Clock,
  Percent, Hash, Layers, CheckCircle
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
import AddMenuItemForm from "@/components/forms/menu-settings/menu-items/add-menu-item-form";

export default function MenuItemsTable() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMenu, setSelectedMenu] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [processing, setProcessing] = useState<string>("");
  const [showAddItem, setShowAddItem] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);

  // Load all data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsRes, menusRes, categoriesRes] = await Promise.all([
        getMenuItems(),
        getMenus(),
        getCategories()
      ]);

      const extractArray = (res: any): any[] => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.items)) return res.items;
        if (Array.isArray(res?.data?.items)) return res.data.items;
        return [];
      };

      const normalizedItems: MenuItem[] = extractArray(itemsRes);
      const normalizedMenus: Menu[] = extractArray(menusRes);
      const normalizedCategories: ItemCategory[] = extractArray(categoriesRes);

      const safeItems: MenuItem[] = normalizedItems.map(item => ({
        ...item,
        order_count: item.order_count ?? 0,
        last_updated: item.last_updated ?? item.created_at ?? new Date().toISOString(),
        original_price: item.original_price ?? item.price,
      }));

      setItems(safeItems);
      setMenus(normalizedMenus);
      setCategories(normalizedCategories);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load menu data");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Transform stock data for display
  const getStockDisplay = (item: MenuItem) => {
    if (item.stock_type === 'unlimited') {
      return { 
        text: 'Unlimited', 
        color: 'text-emerald-700', 
        bg: 'bg-emerald-50', 
        border: 'border-emerald-200',
        icon: <CheckCircle className="w-3.5 h-3.5" />
      };
    }
    if (item.stock_type === 'limited' && item.stock_qty && item.stock_qty > 0) {
      let color = 'text-blue-700';
      let bg = 'bg-blue-50';
      let border = 'border-blue-200';
      
      if (item.stock_qty < 10) {
        color = 'text-amber-700';
        bg = 'bg-amber-50';
        border = 'border-amber-200';
      } else if (item.stock_qty < 5) {
        color = 'text-orange-700';
        bg = 'bg-orange-50';
        border = 'border-orange-200';
      }
      
      return { 
        text: `${item.stock_qty} ${item.stock_unit || 'units'}`, 
        color, 
        bg, 
        border,
        icon: <Package className="w-3.5 h-3.5" />
      };
    }
    return { 
      text: 'Out of Stock', 
      color: 'text-rose-700', 
      bg: 'bg-rose-50', 
      border: 'border-rose-200',
      icon: <AlertCircle className="w-3.5 h-3.5" />
    };
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
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;

    try {
      setProcessing(`delete-${id}`);
      const res = await deleteMenuItem(id);

      const isSuccess =
        res === true ||
        res?.success === true ||
        res?.status === true ||
        res?.message?.toLowerCase().includes("success");

      if (isSuccess) {
        setItems(prev => prev.filter(item => item.id !== id));
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
        toast.success("Item deleted successfully");
      } else {
        toast.error(res?.message || "Failed to delete item");
      }
    } catch (error) {
      console.error(error);
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
        toast.success("Availability updated");
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
        toast.success("Visibility updated");
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
      <div className="flex items-center justify-center min-h-[500px] bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-transparent border-t-blue-500 border-r-blue-300 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-500 animate-pulse" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Loading menu items</p>
            <p className="text-xs text-gray-500 mt-1">Fetching your restaurant menu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                    Menu Items
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your restaurant's menu items, pricing, and availability
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-lg border border-gray-200 shadow-xs">
                <div className="text-right">
                  <div className="text-xs font-medium text-gray-500">TOTAL ITEMS</div>
                  <div className="text-xl font-bold text-gray-900">{items.length}</div>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-right">
                  <div className="text-xs font-medium text-gray-500">AVAILABLE</div>
                  <div className="text-xl font-bold text-emerald-600">
                    {items.filter(item => item.is_available).length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="p-5 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name, description, or category..."
                    className="w-full pl-11 pr-4 py-3 border-0 focus:ring-0 text-sm placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFiltersVisible(!filtersVisible)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${filtersVisible
                        ? "bg-blue-50 border-blue-500 text-blue-600 shadow-xs"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                      }`}
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${filtersVisible ? 'rotate-180' : ''}`} />
                  </button>

                  <div className="h-6 w-px bg-gray-300"></div>

                  <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Export
                  </button>

                  <button
                    onClick={() => setShowAddItem(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow transition-all text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>
              </div>

              {/* Filters Panel */}
              {filtersVisible && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Menu
                      </label>
                      <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={selectedMenu}
                        onChange={(e) => setSelectedMenu(e.target.value)}
                      >
                        <option value="all">All Menus</option>
                        {menus.map(menu => (
                          <option key={menu.id} value={menu.id}>
                            {menu.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Category
                      </label>
                      <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Sort By
                      </label>
                      <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="recent">Recently Added</option>
                        <option value="popular">Most Popular</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="name">Alphabetical</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setSelectedMenu("all");
                          setSelectedCategory("all");
                          setSearchQuery("");
                          setSortBy("recent");
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedItems.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-medium">
                  {selectedItems.length}
                </div>
                <span className="text-blue-800 font-medium">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </span>
                <div className="hidden sm:block h-4 w-px bg-blue-300"></div>
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                    Bulk Edit
                  </button>
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                    Bulk Delete
                  </button>
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                    Change Visibility
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedItems([])}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5 hover:bg-white rounded-lg transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Best Sellers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {items.filter(item => item.is_best_seller).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((items.filter(item => item.is_best_seller).length / items.length) * 100)}% of total
                </p>
              </div>
              <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {items.filter(item => item.stock_type === 'limited' && (!item.stock_qty || item.stock_qty <= 0)).length}
                </p>
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  {items.filter(item => item.stock_type === 'unlimited').length} unlimited stock
                </p>
              </div>
              <div className="p-2 bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Avg. Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{items.length > 0 ? Math.round(items.reduce((sum, item) => sum + item.price, 0) / items.length) : 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Total revenue potential
                </p>
              </div>
              <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg">
                <Percent className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {items.reduce((sum, item) => sum + (item.order_count || 0), 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  All-time order count
                </p>
              </div>
              <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-hidden rounded-xl">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="p-6 text-left">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === sortedItems.length && sortedItems.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Menu Item
                      </span>
                    </div>
                  </th>
                  <th className="p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stock Status
                  </th>
                  <th className="p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {sortedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {searchQuery || selectedMenu !== "all" || selectedCategory !== "all"
                            ? "No items match your search"
                            : "No menu items yet"}
                        </h3>
                        <p className="text-gray-500 mb-6">
                          {searchQuery || selectedMenu !== "all" || selectedCategory !== "all"
                            ? "Try adjusting your filters or search terms"
                            : "Start by adding your first menu item to build your restaurant's menu"}
                        </p>
                        <button
                          onClick={() => setShowAddItem(true)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-sm font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add Your First Item
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
                        className={`hover:bg-gray-50/80 transition-colors ${!item.is_available ? 'bg-gray-50/50' : ''}`}
                      >
                        {/* Item Details */}
                        <td className="p-6">
                          <div className="flex items-start gap-4">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => toggleSelectItem(item.id)}
                              className="mt-1.5 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <div className="relative flex-shrink-0">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-xs">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              {item.is_best_seller && (
                                <div className="absolute -top-1 -right-1">
                                  <span className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-sm">
                                    🔥
                                  </span>
                                </div>
                              )}
                              <div className={`absolute -bottom-1 -left-1 w-5 h-5 rounded-full border-2 border-white shadow-xs ${item.food_type === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                <span className="sr-only">
                                  {item.food_type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="mb-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900 truncate">
                                    {item.name}
                                  </h3>
                                  {item.is_available ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                      Available
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      Unavailable
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {item.description || "No description provided"}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1.5">
                                  <Layers className="w-3.5 h-3.5" />
                                  {menuName}
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="flex items-center gap-1.5">
                                  <Tag className="w-3.5 h-3.5" />
                                  {categoryName}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Pricing */}
                        <td className="p-6">
                          <div className="space-y-2">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                              {item.original_price && item.original_price > item.price && (
                                <span className="text-sm text-gray-400 line-through">
                                  ₹{item.original_price}
                                </span>
                              )}
                            </div>
                            {item.original_price && item.original_price > item.price && (
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 rounded text-xs font-medium">
                                <Percent className="w-3 h-3" />
                                Save ₹{item.original_price - item.price}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Stock Status */}
                        <td className="p-6">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${stockDisplay.bg} ${stockDisplay.color} ${stockDisplay.border}`}>
                            {stockDisplay.icon}
                            {stockDisplay.text}
                          </div>
                          {item.stock_type === 'limited' && item.stock_qty && item.stock_qty > 0 && item.stock_qty < 10 && (
                            <p className="text-xs text-amber-600 mt-1.5 font-medium">
                              Low stock warning
                            </p>
                          )}
                        </td>

                        {/* Category */}
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-50 rounded-lg">
                              <Tag className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">{categoryName}</span>
                          </div>
                        </td>

                        {/* Orders */}
                        <td className="p-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                                <BarChart3 className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <span className="font-bold text-gray-900 text-lg">{item.order_count}</span>
                                <p className="text-xs text-gray-500">total orders</p>
                              </div>
                            </div>
                            {item.order_count > 50 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700">
                                Popular
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Available</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={item.is_available}
                                  onChange={() => handleToggleAvailability(item.id, item.is_available)}
                                  className="sr-only peer"
                                  disabled={processing.includes(`availability-${item.id}`)}
                                />
                                <div className={`w-11 h-6 rounded-full peer transition-colors ${item.is_available ? 'bg-emerald-500' : 'bg-gray-300'} peer-focus:ring-2 peer-focus:ring-emerald-300`}>
                                  <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform ${item.is_available ? 'translate-x-5' : ''}`} />
                                </div>
                              </label>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Visible</span>
                              <button
                                onClick={() => handleToggleVisibility(item.id, item.show_on_site)}
                                className={`p-1 rounded ${item.show_on_site ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                title={item.show_on_site ? "Visible on site" : "Hidden from site"}
                              >
                                {item.show_on_site ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-6">
                          <div className="relative">
                            <div className="flex items-center gap-1">
                              <button
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Item"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleBestSeller(item.id, item.is_best_seller)}
                                className={`p-2 rounded-lg transition-colors ${item.is_best_seller
                                    ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                  }`}
                                title={item.is_best_seller ? "Remove from best sellers" : "Mark as best seller"}
                              >
                                <TrendingUp className="w-4 h-4" />
                              </button>
                              <div className="w-px h-4 bg-gray-300"></div>
                              <button
                                onClick={() => setActionMenuOpen(actionMenuOpen === item.id ? null : item.id)}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Action Menu Dropdown */}
                            {actionMenuOpen === item.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setActionMenuOpen(null)} />
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
                                  <div className="py-1">
                                    <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                      <Pencil className="w-4 h-4" />
                                      Edit Item
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem(item.id)}
                                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete Item
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </button>
                                    <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                      <Clock className="w-4 h-4" />
                                      View History
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
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
            <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{sortedItems.length}</span> of{" "}
                  <span className="font-semibold text-gray-900">{items.length}</span> items
                </div>
                <div className="flex items-center gap-1">
                  <button className="inline-flex items-center gap-2 px-3.5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <ChevronDown className="w-4 h-4 rotate-90" />
                    Previous
                  </button>
                  <button className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800">
                    1
                  </button>
                  <button className="inline-flex items-center gap-2 px-3.5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Next
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Menu Item Modal */}
      {showAddItem && (
        <AddMenuItemForm
          onClose={() => {
            setShowAddItem(false);
            loadData();
          }}
          onItemAdded={loadData}
        />
      )}
    </>
  );
}