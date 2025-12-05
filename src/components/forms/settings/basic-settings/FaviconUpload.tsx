"use client";

import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import { uploadsUrl, apiUrl } from "@/config";

export default function FaviconUpload({ value, setValue, userId }) {
  const [uploading, setUploading] = useState(false);

  const previewUrl = value ? `${uploadsUrl}/${value}` : "";

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${apiUrl}/seller/settings/basic-settings/upload-favicon.php?user_id=${userId}`,
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
      <p className="font-medium">Favicon</p>

      <label className="cursor-pointer w-20 h-20 flex items-center justify-center border rounded-lg bg-gray-50 overflow-hidden shadow">
        {uploading ? (
          <Loader2 className="animate-spin" />
        ) : previewUrl ? (
          <Image src={previewUrl} alt="Favicon" width={80} height={80} className="object-contain" unoptimized />
        ) : (
          <Upload size={20} className="text-gray-500" />
        )}

        <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
      </label>
    </div>
  );
}
