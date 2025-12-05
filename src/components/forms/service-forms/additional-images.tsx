"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const AdditionalImages = ({ images }) => {
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
    
    // Construct full URL for additional image
    return `http://localhost/managerbp/public/uploads/${path}`;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length || !userId) {
      e.target.value = '';
      return;
    }

    setUploading(true);
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append("files[]", files[i]);
    }

    try {
      const res = await fetch(
        `http://localhost/managerbp/public/seller/services/upload-multi.php?user_id=${userId}`,
        { 
          method: "POST", 
          body: formData
        }
      );

      const result = await res.json();
      
      if (result.success && result.files) {
        const currentImages = Array.isArray(images.value) ? images.value : [];
        images.setValue([...currentImages, ...result.files]);
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
        <h3 className="font-medium">Additional Images</h3>
        <div className="border border-dashed p-5 rounded text-center">
          Loading...
        </div>
      </div>
    );
  }

  const currentImages = Array.isArray(images.value) ? images.value : [];

  return (
    <div className="bg-white rounded-xl p-5">
      <h3 className="font-medium mb-4">Additional Images</h3>

      <div className="border border-dashed border-gray-300 p-5 rounded-lg text-center mb-4">
        <label className="cursor-pointer block">
          <input 
            type="file" 
            multiple 
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
              <>
                <div className="text-gray-600 mb-1">Click to upload multiple images</div>
                <div className="text-sm text-gray-500">Supports JPG, PNG, GIF, WEBP</div>
              </>
            )}
          </div>
        </label>
      </div>

      {currentImages.length > 0 && (
        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-2">
            {currentImages.length} image{currentImages.length !== 1 ? 's' : ''} uploaded
          </div>
          <div className="flex flex-wrap gap-3">
            {currentImages.map((img: string, i: number) => (
              <div key={`${img}-${i}`} className="relative w-32 h-32">
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full z-10 hover:bg-red-600"
                  onClick={() => images.setValue(currentImages.filter((_, index) => index !== i))}
                >
                  <X size={14} />
                </button>

                <div className="w-full h-full rounded border border-gray-200 overflow-hidden">
                  <Image
                    src={getSrc(img)}
                    fill
                    className="object-cover"
                    alt={`Additional image ${i + 1}`}
                    sizes="128px"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalImages;