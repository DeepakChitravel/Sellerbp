"use client";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { getCookie } from "cookies-next";

const ServiceImage = ({ images }) => {
  const [uploading, setUploading] = useState(false);

  const getSrc = (path) =>
    path?.startsWith("http")
      ? path
      : `http://localhost/managerbp/public/uploads/${path}`;

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const userId = getCookie("user_id");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `http://localhost/managerbp/public/seller/services/upload.php?user_id=${userId}`,
      { method: "POST", body: formData }
    );

    const result = await res.json();
    setUploading(false);

    if (result.success) {
      images.setValue(result.filename);
    }
  };

  return (
    <div className="bg-white rounded-xl p-5">
      <h3 className="font-medium">Main Image</h3>

      {!images.value && (
        <label className="border border-dashed p-5 rounded cursor-pointer block text-center">
          <input type="file" className="hidden" onChange={handleUpload} />
          {uploading ? "Uploading..." : "Click to upload"}
        </label>
      )}

      {images.value && (
        <div className="mt-3 relative w-40">
          <button
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
            onClick={() => images.setValue("")}
          >
            <X size={16} />
          </button>

          <Image
            src={getSrc(images.value)}
            width={150}
            height={150}
            className="rounded border object-cover"
            alt="Service"
            unoptimized
          />
        </div>
      )}
    </div>
  );
};

export default ServiceImage;
