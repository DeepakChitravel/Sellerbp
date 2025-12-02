"use client";
import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  images: { value: string; setValue: (v: string) => void };
}

const EmployeeImage = ({ images }: Props) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      "http://localhost/managerbp/public/seller/employees/upload.php",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await res.json();
    setIsUploading(false);

    if (result.success) {
      images.setValue(result.filename);
    }
  };

  return (
    <div className="bg-white rounded-xl p-5">
      <h3 className="font-medium text-lg">Employee Image</h3>
      <p className="text-sm text-black/50 mb-4">Upload employee profile picture.</p>

      {/* Upload Box */}
      {!images.value && (
        <label className="block border border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />

          <div className="text-gray-500">
            <p className="font-medium">Click to upload</p>
            <p className="text-xs mt-1">Supports: PNG, JPG, WEBP</p>
          </div>

          {isUploading && (
            <p className="text-blue-500 mt-2 text-sm">Uploading...</p>
          )}
        </label>
      )}

      {/* Image Preview */}
      {images.value && (
        <div className="relative w-[160px] mt-4">
          <button
            onClick={() => images.setValue("")}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow"
          >
            <X size={14} />
          </button>

          <Image
            src={`http://localhost/managerbp/public/uploads/employees/${images.value}`}
            width={160}
            height={160}
            className="rounded-lg object-cover border"
            alt="Employee"
            unoptimized
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeImage;
