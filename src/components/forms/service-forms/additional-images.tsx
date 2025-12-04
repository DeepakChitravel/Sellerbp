"use client";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { getCookie } from "cookies-next";

const AdditionalImages = ({ images }) => {
  const [uploading, setUploading] = useState(false);

  const getSrc = (path) =>
    path?.startsWith("http")
      ? path
      : `http://localhost/managerbp/public/uploads/${path}`;

  const handleUpload = async (e: any) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);

    const userId = getCookie("user_id");
    let newPaths = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `http://localhost/managerbp/public/seller/services/upload.php?user_id=${userId}`,
        { method: "POST", body: formData }
      );

      const result = await res.json();
      if (result.success) newPaths.push(result.filename);
    }

    setUploading(false);
    images.setValue([...images.value, ...newPaths]);
  };

  return (
    <div className="bg-white rounded-xl p-5">
      <h3 className="font-medium">Additional Images</h3>

      <label className="border border-dashed p-5 rounded cursor-pointer block text-center">
        <input type="file" multiple className="hidden" onChange={handleUpload} />
        {uploading ? "Uploading..." : "Upload Images"}
      </label>

      <div className="flex flex-wrap gap-3 mt-3">
        {images.value.map((img, i) => (
          <div key={i} className="relative">
            <button
              className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full"
              onClick={() =>
                images.setValue(images.value.filter((x) => x !== img))
              }
            >
              <X size={14} />
            </button>

            <Image
              src={getSrc(img)}
              width={120}
              height={80}
              className="rounded border object-cover"
              alt="Service Additional"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdditionalImages;
