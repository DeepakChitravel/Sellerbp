"use client";

import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import { uploadsUrl, apiUrl } from "@/config";

export default function LogoUpload({ value, setValue }) {
  const [uploading, setUploading] = useState(false);

  // ✅ FIX: remove duplicate "sellers/"
  const previewUrl = value
    ? `${uploadsUrl}/${value.replace(/^sellers\//, "")}`
    : "";

  const handleFileSelect = async (file: File) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const res = await fetch(
        `${apiUrl}/seller/settings/basic-settings/upload-logo.php`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const result = await res.json();
      console.log("UPLOAD RESULT:", result);

      if (result.success) {
        setValue(result.filename); // 👈 preview works instantly
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="font-medium">Brand Logo</p>

      <label className="border-2 border-dashed rounded-xl h-64 flex items-center justify-center cursor-pointer border-gray-300">
        {uploading ? (
          <Loader2 className="animate-spin" />
        ) : previewUrl ? (
          <Image
            src={previewUrl}
            alt="Logo"
            width={140}
            height={140}
            unoptimized
          />
        ) : (
          <Upload />
        )}

        <input
          type="file"
          hidden
          accept=".png,.jpg,.jpeg,.svg"
          onChange={(e) =>
            e.target.files && handleFileSelect(e.target.files[0])
          }
        />
      </label>
    </div>
  );
}
