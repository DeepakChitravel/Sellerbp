"use client";

import Image from "next/image";
import { Upload, Loader2, X, Globe } from "lucide-react";
import { useState } from "react";
import { apiUrl } from "@/config";

interface Props {
  value: string;
  setValue: (value: string) => void;
  metaTitle?: string;
  metaDescription?: string;
}

export default function SharingPreviewUpload({ 
  value, 
  setValue, 
  metaTitle = "Your Website Title",
  metaDescription = "Your website description appears here when shared..."
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const previewUrl = value ? `${apiUrl}/uploads/${value}` : "";
  const websiteUrl = "yourwebsite.com";
  
  // Get first 60 characters of description for preview
  const previewDescription = metaDescription.length > 60 
    ? metaDescription.substring(0, 60) + "..."
    : metaDescription;

    
const handleFileSelect = async (file: File) => {
  setUploading(true);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(
      `${apiUrl}/seller/settings/seo-settings/upload-sharing-preview.php`,
      {
        method: "POST",
        credentials: "include", // IMPORTANT: sends auth cookies/token
        body: formData,
      }
    );

    const result = await res.json();

    if (result.success) {
      setValue(result.filename);
    } else {
      console.error("Upload error:", result.message);
    }
  } catch (error) {
    console.error("Upload failed:", error);
  } finally {
    setUploading(false);
  }
};


  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await handleFileSelect(file);
  };

  const handleRemove = () => {
    setValue("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-800">Sharing Preview Image</p>
          <p className="text-sm text-gray-500 mt-1">Appears when sharing your link online</p>
        </div>
        <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
          <Globe size={18} />
        </div>
      </div>

      <div className="relative">
        <label
          className={`
            cursor-pointer flex flex-col items-center justify-center 
            border-2 ${dragOver ? "border-blue-400 border-dashed" : "border-dashed border-gray-300"} 
            rounded-xl bg-white p-4 transition-all duration-200
            ${dragOver ? "scale-[1.01] shadow-md" : "hover:border-blue-300 hover:shadow-sm"}
            min-h-[180px]
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="text-center py-6">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Uploading preview image...</p>
            </div>
          ) : previewUrl ? (
            <div className="w-full space-y-4">
              {/* Browser-Style Preview */}
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                {/* Browser Header with Dots */}
                <div className="bg-gray-50 px-3 py-2 flex items-center gap-2 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 truncate px-2">
                      {websiteUrl}
                    </div>
                  </div>
                </div>
                
                {/* Smaller Image Container */}
                <div className="p-3">
                  <div className="relative aspect-[1.91/1] bg-gray-50 rounded overflow-hidden border border-gray-200">
                    <Image
                      src={previewUrl}
                      alt="Sharing Preview"
                      fill
                      className="object-cover"
                      unoptimized
                      sizes="(max-width: 400px)"
                    />
                  </div>
                </div>
                
                {/* Preview Info Footer - Using actual meta data */}
                <div className="px-3 py-2 border-t bg-gray-50">
                  <div className="text-xs text-blue-600 font-medium mb-1">{websiteUrl}</div>
                  <div className="font-medium text-sm text-gray-800 mb-1 line-clamp-1">
                    {metaTitle || "Your Website Title"}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {previewDescription}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Preview active</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => document.querySelector('input[type="file"]')?.click()}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full py-4">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                {/* Left Side - Upload Area */}
                <div className="flex-1">
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <Upload className="h-6 w-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800">Add Preview Image</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-6 max-w-md">
                        Upload an image that will appear when your website link is shared on social media and messaging apps.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => document.querySelector('input[type="file"]')?.click()}
                            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            <Upload size={18} />
                            Upload Image
                          </button>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-500">or drag and drop here</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tips */}
                    <div className="mt-auto pt-6 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-700 mb-2">Why add a preview image?</p>
                      <ul className="space-y-1.5 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                          <span>Makes your links stand out on social media</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                          <span>Professional appearance when shared</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                          <span>Increases click-through rates</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right Side - Preview Example */}
                <div className="flex-1 max-w-md">
                  <div className="sticky top-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Preview example:</p>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      {/* Browser Header */}
                      <div className="bg-gray-50 px-3 py-2 flex items-center gap-2 border-b">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-600">yourwebsite.com</div>
                        </div>
                      </div>
                      
                      {/* Image Placeholder */}
                      <div className="p-3">
                        <div className="aspect-[1.91/1] bg-gradient-to-br from-gray-100 to-gray-200 rounded flex flex-col items-center justify-center">
                          <div className="text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Preview image will appear here</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Info Placeholder */}
                      <div className="px-3 py-2 border-t bg-gray-50">
                        <div className="text-xs text-blue-600 mb-1">yourwebsite.com</div>
                        <div className="font-medium text-sm text-gray-800 mb-1">Your Website Title</div>
                        <div className="text-xs text-gray-500">
                          Website description appears here when shared...
                        </div>
                      </div>
                    </div>
                    
                    {/* Recommendation */}
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs font-medium text-blue-700 mb-1">Recommended size</p>
                      <p className="text-xs text-blue-600">1200×630 pixels • PNG or JPG format</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <input
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileInput}
          />
        </label>
      </div>
      
    </div>
  );
}