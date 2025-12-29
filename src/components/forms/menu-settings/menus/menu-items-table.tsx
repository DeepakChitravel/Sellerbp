"use client";

import Image from "next/image";
import { 
  Pencil, Trash2, Eye, EyeOff, Package, 
  Clock, Tag, TrendingUp, AlertCircle, 
  ChevronDown, MoreVertical, Star,
  ShoppingBag, IndianRupee, Users
} from "lucide-react";
import { useState } from "react";

const ITEMS = [
  {
    id: 1,
    name: "Butter Naan",
    desc: "Soft and fluffy leavened bread baked in clay tandoor, brushed with butter.",
    price: 40,
    originalPrice: 50,
    category: "Breads & Rotis",
    menu: "North Indian Delights",
    image: "/static/naan.jpg",
    veg: true,
    available: true,
    showOnSite: true,
    stock: "Unlimited",
    preparationTime: 10,
    bestSeller: true,
    discount: "20% OFF",
    rating: 4.7,
    orderCount: 892,
    spiceLevel: "Mild",
    customerLimit: 4,
    lastUpdated: "2 hours ago",
    tags: ["Tandoor", "Fresh Bread", "Best Seller"]
  },
  {
    id: 2,
    name: "Butter Chicken",
    desc: "Tender chicken pieces cooked in rich tomato and butter gravy with cream.",
    price: 320,
    originalPrice: 350,
    category: "Main Course",
    menu: "North Indian Delights",
    image: "/static/butter-chicken.jpg",
    veg: false,
    available: true,
    showOnSite: true,
    stock: "Limited: 18 plates",
    preparationTime: 25,
    bestSeller: true,
    discount: "9% OFF",
    rating: 4.9,
    orderCount: 1245,
    spiceLevel: "Medium",
    customerLimit: 2,
    lastUpdated: "1 hour ago",
    tags: ["Signature Dish", "Non-Veg", "Most Ordered"]
  },
  {
    id: 3,
    name: "Paneer Tikka",
    desc: "Cubes of cottage cheese marinated in spices and grilled in tandoor.",
    price: 280,
    originalPrice: 300,
    category: "Starters",
    menu: "North Indian Delights",
    image: "/static/paneer-tikka.jpg",
    veg: true,
    available: false,
    showOnSite: false,
    stock: "Out of Stock",
    preparationTime: 20,
    bestSeller: true,
    discount: "7% OFF",
    rating: 4.8,
    orderCount: 756,
    spiceLevel: "Medium",
    customerLimit: 3,
    lastUpdated: "Yesterday",
    tags: ["Vegetarian", "Grilled", "Appetizer"]
  },
  {
    id: 4,
    name: "Dal Makhani",
    desc: "Black lentils slow-cooked overnight with butter and cream.",
    price: 220,
    originalPrice: 240,
    category: "Main Course",
    menu: "North Indian Delights",
    image: "/static/dal-makhani.jpg",
    veg: true,
    available: true,
    showOnSite: true,
    stock: "Unlimited",
    preparationTime: 15,
    bestSeller: false,
    discount: "8% OFF",
    rating: 4.6,
    orderCount: 643,
    spiceLevel: "Mild",
    customerLimit: 0,
    lastUpdated: "Today",
    tags: ["Classic", "Comfort Food", "Lentils"]
  },
  {
    id: 5,
    name: "Rogan Josh",
    desc: "Tender lamb cooked in aromatic Kashmiri red chili gravy.",
    price: 380,
    originalPrice: 420,
    category: "Main Course",
    menu: "North Indian Delights",
    image: "/static/rogan-josh.jpg",
    veg: false,
    available: true,
    showOnSite: true,
    stock: "Limited: 12 plates",
    preparationTime: 30,
    bestSeller: true,
    discount: "10% OFF",
    rating: 4.9,
    orderCount: 512,
    spiceLevel: "Hot",
    customerLimit: 2,
    lastUpdated: "3 hours ago",
    tags: ["Kashmiri", "Lamb", "Special"]
  },
  {
    id: 6,
    name: "Jeera Rice",
    desc: "Basmati rice tempered with cumin seeds and whole spices.",
    price: 150,
    originalPrice: 160,
    category: "Rice & Biryani",
    menu: "North Indian Delights",
    image: "/static/jeera-rice.jpg",
    veg: true,
    available: true,
    showOnSite: true,
    stock: "Unlimited",
    preparationTime: 12,
    bestSeller: false,
    discount: "6% OFF",
    rating: 4.4,
    orderCount: 421,
    spiceLevel: "Mild",
    customerLimit: 0,
    lastUpdated: "4 hours ago",
    tags: ["Rice", "Sidedish", "Fragrant"]
  }
];

export default function MenuItemsTable() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortBy, setSortBy] = useState("popular");

  const toggleSelectAll = () => {
    if (selectedItems.length === ITEMS.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(ITEMS.map(item => item.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Menu Items</h2>
          <p className="text-sm text-gray-600">Manage all items in your menu</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Total:</span>
            <span className="font-semibold">{ITEMS.length} items</span>
            <span className="text-gray-300">•</span>
            <span className="text-green-600">
              {ITEMS.filter(item => item.available).length} available
            </span>
          </div>
          
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
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

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
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

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === ITEMS.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                    <span className="text-xs font-semibold text-gray-700 uppercase">Item Details</span>
                  </label>
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Pricing</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Stock & Info</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Performance</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {ITEMS.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    !item.available ? 'opacity-60' : ''
                  }`}
                >
                  {/* Item Details */}
                  <td className="p-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => setSelectedItems(prev => 
                          prev.includes(item.id) 
                            ? prev.filter(id => id !== item.id)
                            : [...prev, item.id]
                        )}
                        className="mt-5 w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <div className="relative">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                          {/* Placeholder for image */}
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-amber-400" />
                          </div>
                        </div>
                        {item.bestSeller && (
                          <div className="absolute -top-2 -right-2">
                            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                              🔥
                            </span>
                          </div>
                        )}
                        {item.veg ? (
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
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              {item.discount && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                  {item.discount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.tags?.map((tag, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {item.category}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Updated {item.lastUpdated}
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
                        {item.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Price</span>
                          <span className="font-medium">₹{item.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dine-in</span>
                          <span className="font-medium">₹{item.price + 20}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Takeaway</span>
                          <span className="font-medium">₹{item.price}</span>
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
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          Prep: {item.preparationTime} mins
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Spice Level</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.spiceLevel === "Mild" 
                              ? "bg-green-100 text-green-800"
                              : item.spiceLevel === "Medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {item.spiceLevel}
                          </span>
                        </div>
                        
                        {item.customerLimit > 0 && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Customer Limit</span>
                            <span className="flex items-center gap-1 font-medium">
                              <Users className="w-3 h-3" />
                              {item.customerLimit}/order
                            </span>
                          </div>
                        )}
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
                            <span className="font-semibold">{item.orderCount}</span>
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
                      
                      {item.bestSeller && (
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
                            item.available 
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {item.available ? "Yes" : "No"}
                          </div>
                        </div>
                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              item.available 
                                ? "bg-green-500" 
                                : "bg-red-500"
                            }`}
                            style={{ width: item.available ? "100%" : "0%" }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Visible</span>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.showOnSite 
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {item.showOnSite ? "Shown" : "Hidden"}
                          </div>
                        </div>
                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              item.showOnSite 
                                ? "bg-blue-500" 
                                : "bg-gray-400"
                            }`}
                            style={{ width: item.showOnSite ? "100%" : "0%" }}
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
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        {item.showOnSite ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
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
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {ITEMS.length} of {ITEMS.length} items
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{ITEMS.reduce((sum, item) => sum + item.price, 0)}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Best Sellers</p>
              <p className="text-2xl font-bold text-gray-900">
                {ITEMS.filter(item => item.bestSeller).length}
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
                {ITEMS.filter(item => item.stock.includes("Out of Stock")).length}
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
                {(
                  ITEMS.reduce((sum, item) => sum + item.rating, 0) / ITEMS.length
                ).toFixed(1)}
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