"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const ServiceImage = ({ images }) => {
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_id='))
        ?.split('=')[1];
      
      if (cookieValue) {
        setUserId(cookieValue);
      }
    }
  }, []);

  const getSrc = (path: string) => {
    if (!path) return "/placeholder-image.jpg";
    
    if (path.startsWith("http")) {
      return path;
    }
    
    // Construct full URL for main image
    return `http://localhost/managerbp/public/uploads/${path}`;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) {
      e.target.value = '';
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `http://localhost/managerbp/public/seller/services/upload.php?user_id=${userId}`,
        { 
          method: "POST", 
          body: formData
        }
      );

      const result = await res.json();
      if (result.success) {
        images.setValue(result.filename);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl p-5">
        <h3 className="font-medium">Main Image</h3>
        <div className="border border-dashed p-5 rounded text-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5">
      <h3 className="font-medium mb-4">Main Image</h3>

      {!images.value ? (
        <div className="border border-dashed border-gray-300 p-5 rounded-lg text-center">
          <label className="cursor-pointer block">
            <input 
              type="file" 
              className="hidden" 
              onChange={handleUpload}
              accept="image/*"
              disabled={uploading || !userId}
            />
            <div className="py-3">
              {uploading ? (
                <div className="text-blue-600">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  Uploading...
                </div>
              ) : !userId ? (
                <div className="text-red-500">User ID not found</div>
              ) : (
                <div className="text-gray-600">Click to upload main image</div>
              )}
            </div>
          </label>
        </div>
      ) : (
        <div className="mt-3">
          <div className="relative w-40 inline-block">
            <button
              type="button"
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full z-10 hover:bg-red-600"
              onClick={() => images.setValue("")}
            >
              <X size={16} />
            </button>

            <div className="w-40 h-40 rounded border border-gray-200 overflow-hidden">
              <Image
                src={getSrc(images.value)}
                fill
                className="object-cover"
                alt="Service main image"
                sizes="160px"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceImage;