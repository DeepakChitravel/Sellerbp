"use client";

import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import { uploadsUrl, apiUrl } from "@/config";

export default function HeroImageUpload({ value, setValue, userId }) {
  const [uploading, setUploading] = useState(false);

  // ⭐ Correct preview URL
  const previewUrl = value ? `${uploadsUrl}/${value}` : "";

  const handleFileSelect = async (e) => {
    if (!userId) {
      console.log("❌ Missing REAL userId");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${apiUrl}/seller/website-setup/homepage-settings/upload-hero-image.php?user_id=${userId}`,
      { method: "POST", body: formData }
    );

    const result = await res.json();
    console.log("UPLOAD RESULT:", result);

    if (result.success) {
      console.log("PREVIEW URL:", `${uploadsUrl}/${result.filename}`);
      setValue(result.filename);
    }

    setUploading(false);
  };

  return (
    <div className="mt-6">
      <p className="font-medium mb-2">Hero Image</p>

      <label className="cursor-pointer w-48 h-48 bg-gray-100 border rounded-lg flex items-center justify-center overflow-hidden">
        {uploading ? (
          <Loader2 className="animate-spin" />
        ) : previewUrl ? (
          <Image
            src={previewUrl}
            alt="Hero Image"
            width={200}
            height={200}
            className="object-cover"
            unoptimized
          />
        ) : (
          <Upload size={32} className="text-gray-500" />
        )}

        <input type="file" className="hidden" onChange={handleFileSelect} />
      </label>
    </div>
  );
}
