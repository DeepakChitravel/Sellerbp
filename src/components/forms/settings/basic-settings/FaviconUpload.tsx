"use client";

import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";
import { useState } from "react";
import { apiUrl } from "@/config";

export default function FaviconUpload({ value, setValue, userId }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const previewUrl = value ? `${apiUrl}/uploads/${value}` : "";

  const handleFileSelect = async (file) => {
    if (!userId) {
      console.error("User ID missing — cannot upload favicon");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${apiUrl}/seller/settings/basic-settings/upload-favicon.php?user_id=${userId}`,
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

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValue("");
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Open file selector when image is clicked
    document.getElementById("favicon-file-input")?.click();
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="font-medium text-gray-800">Favicon</p>
        <p className="text-sm text-gray-500 mt-1">Small icon for browser tabs</p>
      </div>

      <div className="relative">
        <label
          className={`
            cursor-pointer flex flex-col items-center justify-center 
            border-2 ${dragOver ? "border-primary border-dashed" : "border-dashed border-gray-300"} 
            rounded-xl bg-white p-6 transition-all duration-200
            ${dragOver ? "scale-[1.02] shadow-md" : "hover:border-gray-400 hover:shadow-sm"}
            h-48
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="text-center">
              <Loader2 className="animate-spin mx-auto h-8 w-8 text-primary" />
              <p className="text-sm text-gray-600 mt-3">Uploading...</p>
            </div>
          ) : previewUrl ? (
            <div className="relative">
              {/* X button positioned closer to the image */}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-1 -right-1 z-10 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
              >
                <X size={12} />
              </button>
              
              <div 
                onClick={handleImageClick}
                className="cursor-pointer hover:opacity-90 transition-opacity flex flex-col items-center"
              >
                <Image
                  src={previewUrl}
                  alt="Favicon Preview"
                  width={64}
                  height={64}
                  className="object-contain"
                  unoptimized
                />
                <div className="mt-3 text-center">
                  <p className="text-xs text-green-600 font-medium">Looking good!</p>
                  <p className="text-xs text-gray-500 mt-1">Click image to change</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 p-4 rounded-full mb-3">
                <Upload className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-700">Upload Favicon</p>
                <p className="text-xs text-gray-500 mt-2">PNG or ICO format</p>
              </div>
            </>
          )}
          <input
            id="favicon-file-input"
            type="file"
            className="hidden"
            accept=".png,.ico"
            onChange={handleFileInput}
          />
        </label>
      </div>
    </div>
  );
}