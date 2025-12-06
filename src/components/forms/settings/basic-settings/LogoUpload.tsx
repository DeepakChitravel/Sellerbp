"use client";

import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";
import { useState } from "react";
import { apiUrl } from "@/config";

export default function LogoUpload({ value, setValue, userId }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const previewUrl = value ? `${apiUrl}/uploads/${value}` : "";

  const handleFileSelect = async (file) => {
    if (!userId) {
      console.error("User ID not ready — cannot upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${apiUrl}/seller/settings/basic-settings/upload-logo.php?user_id=${userId}`,
        { method: "POST", body: formData }
      );
      const result = await res.json();
      if (result.success) {
        setValue(result.filename);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = async (e) => {
    const file = e.target.files?.[0];
    if (file) await handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await handleFileSelect(file);
  };

  const handleRemove = () => {
    setValue("");
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="font-medium text-gray-800">Brand Logo</p>
        <p className="text-sm text-gray-500 mt-1">Your main website logo</p>
      </div>

      <div className="relative">
        <label
          className={`
            cursor-pointer flex flex-col items-center justify-center 
            border-2 ${dragOver ? "border-primary border-dashed" : "border-dashed border-gray-300"} 
            rounded-xl bg-white p-6 transition-all duration-200
            ${dragOver ? "scale-[1.02] shadow-md" : "hover:border-gray-400 hover:shadow-sm"}
            h-64
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="text-center">
              <Loader2 className="animate-spin mx-auto h-10 w-10 text-primary" />
              <p className="text-sm text-gray-600 mt-3">Uploading...</p>
            </div>
          ) : previewUrl ? (
            <div className="relative group">
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove();
                  }}
                  className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-4">
                <Image
                  src={previewUrl}
                  alt="Logo Preview"
                  width={140}
                  height={140}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm text-green-600 font-medium">Nice logo!</p>
                <p className="text-xs text-gray-500">Click to change</p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-5 rounded-full mb-4">
                <Upload className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-medium text-gray-800">Upload Logo</p>
                <p className="text-sm text-gray-600">Drag & drop or click to browse</p>
                <p className="text-xs text-gray-400">PNG, SVG, JPG</p>
              </div>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept=".png,.svg,.jpg,.jpeg"
            onChange={handleFileInput}
          />
        </label>
      </div>
    </div>
  );
}