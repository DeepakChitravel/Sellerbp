"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";
import { uploadsUrl } from "@/config";

interface Props {
  value: string; // example: "user/9/profile/1764909180_iphone.png"
  setValue: (v: any) => void;
  userId: number;
}

export default function ProfileImage({ value, setValue, userId }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `http://localhost/managerbp/public/seller/users/upload-profile.php?user_id=${userId}`,
      { method: "POST", body: formData }
    );

    const result = await res.json();
    setUploading(false);

    if (result.success) {
      setValue(result.filename); // "user/9/profile/xxxx.png"
    }
  };

  // Build final URL from DB value
const finalImageUrl = value
  ? `${uploadsUrl}/${value.replace("sellers/", "")}`
  : "";


  console.log("DB Value:", value);
  console.log("Final URL:", finalImageUrl);

  return (
    <div className="bg-white rounded-xl p-5 mt-5">
      <h3 className="font-medium mb-3">Profile Photo</h3>

      {!value && (
        <label className="border border-dashed p-5 rounded cursor-pointer text-center block">
          <input type="file" className="hidden" onChange={handleUpload} />
          {uploading ? "Uploading..." : "Click to upload"}
        </label>
      )}

      {value && (
        <div className="mt-3 relative w-32 h-32">
          <button
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
            onClick={() => setValue("")}
          >
            <X size={16} />
          </button>

          <Image
            src={finalImageUrl}
            width={128}
            height={128}
            className="rounded-full border object-cover"
            alt="Profile"
            unoptimized
          />
        </div>
      )}
    </div>
  );
}
