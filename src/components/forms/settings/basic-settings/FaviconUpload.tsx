"use client";

import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import { uploadsUrl, apiUrl } from "@/config";

export default function FaviconUpload({ value, setValue }) {
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
        .find((r) => r.startsWith("token="))
        ?.split("=")[1];

      const res = await fetch(
        `${apiUrl}/seller/settings/basic-settings/upload-favicon.php`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const result = await res.json();
      if (result.success) {
        setValue(result.filename); // preview updates instantly
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="border-2 border-dashed h-48 flex items-center justify-center cursor-pointer rounded-xl">
      {uploading ? (
        <Loader2 className="animate-spin" />
      ) : previewUrl ? (
        <Image
          src={previewUrl}
          alt="Favicon"
          width={64}
          height={64}
          unoptimized
        />
      ) : (
        <Upload />
      )}

      <input
        type="file"
        hidden
        accept=".png,.ico"
        onChange={(e) =>
          e.target.files && handleFileSelect(e.target.files[0])
        }
      />
    </label>
  );
}
