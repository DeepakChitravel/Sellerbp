"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  doctorImage: { value: string; setValue: (v: string) => void };
  userId: string;
}

const DoctorImage = ({ doctorImage, userId }: Props) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `http://localhost/managerbp/public/seller/doctors/upload.php?user_id=${userId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await res.json();
    setIsUploading(false);

    if (result.success) {
      doctorImage.setValue(result.filename);
    }
  };

  const hasImage = !!doctorImage.value;

  const imgSrc = doctorImage.value.startsWith("http")
    ? doctorImage.value
    : `http://localhost/managerbp/public/uploads/doctors/${doctorImage.value}`;

  return (
    <div className="bg-white rounded-xl p-5">
      <h3 className="font-medium text-lg">Doctor Image</h3>

      {!hasImage && (
        <label className="block border border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <p className="text-gray-500">Click to upload</p>
          {isUploading && <p className="text-blue-500 mt-2 text-sm">Uploading...</p>}
        </label>
      )}

      {hasImage && (
        <div className="relative w-[160px] mt-4">
          <button
            onClick={() => doctorImage.setValue("")}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow"
          >
            <X size={14} />
          </button>

          <Image
            src={imgSrc}
            width={160}
            height={160}
            alt="Doctor"
            className="rounded-lg object-cover border"
            unoptimized
          />
        </div>
      )}
    </div>
  );
};

export default DoctorImage;
