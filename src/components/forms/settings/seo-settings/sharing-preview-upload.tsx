"use client";

import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import { apiUrl } from "@/config";

export default function SharingPreviewUpload({ value, setValue, userId }) {
  const [uploading, setUploading] = useState(false);

  // Preview URL — same logic as logo & favicon
  const previewUrl = value ? `${apiUrl}/uploads/${value}` : "";

  const handleFileSelect = async (e) => {
    if (!userId) {
      console.error("User ID missing — cannot upload sharing preview image.");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${apiUrl}/seller/settings/seo-settings/upload-sharing-preview.php?user_id=${userId}`,
      { method: "POST", body: formData }
    );

    const result = await res.json();

    if (result.success) {
      setValue(result.filename); 
    }

    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <p className="font-medium">Sharing Preview Image</p>

      <label className="cursor-pointer w-40 h-40 flex items-center justify-center border rounded-lg bg-gray-50 overflow-hidden shadow">
        {uploading ? (
          <Loader2 className="animate-spin" />
        ) : previewUrl ? (
          <Image
            src={previewUrl}
            alt="Sharing Preview Image"
            width={160}
            height={160}
            className="object-contain"
            unoptimized
          />
        ) : (
          <Upload size={30} className="text-gray-500" />
        )}

        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
        />
      </label>
    </div>
  );
}
