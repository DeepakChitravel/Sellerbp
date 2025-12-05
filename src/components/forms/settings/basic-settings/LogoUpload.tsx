"use client";

import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import { uploadsUrl, apiUrl } from "@/config";

export default function LogoUpload({ value, setValue, userId }) {
  const [uploading, setUploading] = useState(false);

  const previewUrl = value ? `${uploadsUrl}/${value}` : "";

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${apiUrl}/seller/settings/basic-settings/upload-logo.php?user_id=${userId}`,
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
      <p className="font-medium">Logo</p>

      <label className="cursor-pointer w-40 h-40 flex items-center justify-center border rounded-lg bg-gray-50 overflow-hidden shadow">
        {uploading ? (
          <Loader2 className="animate-spin" />
        ) : previewUrl ? (
          <Image src={previewUrl} alt="Logo" width={160} height={160} className="object-contain" unoptimized />
        ) : (
          <Upload size={30} className="text-gray-500" />
        )}

        <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
      </label>
    </div>
  );
}
