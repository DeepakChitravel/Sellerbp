"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface DepartmentFormValues {
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  image?: File | null;
}

export default function DepartmentForm({
  department,
  onSubmit,
}: {
  department?: any;
  onSubmit?: (data: DepartmentFormValues) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<DepartmentFormValues>({
    defaultValues: department ?? {},
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit((data) => {
        console.log("Form submitted:", data);
        onSubmit?.(data);
      })}
    >
      {/* Department Information */}
      <div className="border p-4 rounded-md space-y-4">
        <h2 className="text-lg font-semibold">Department Info</h2>

        <input
          type="text"
          placeholder="Name"
          {...register("name")}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Slug"
          {...register("slug")}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          {...register("description")}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* SEO Section */}
      <div className="border p-4 rounded-md space-y-4">
        <h2 className="text-lg font-semibold">SEO</h2>

        <input
          type="text"
          placeholder="Meta Title"
          {...register("metaTitle")}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Meta Description"
          {...register("metaDescription")}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Keywords (comma separated)"
          {...register("keywords")}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Image Upload */}
      <div className="border p-4 rounded-md space-y-4">
        <h2 className="text-lg font-semibold">Department Image</h2>

        <input
          type="file"
          accept="image/*"
          {...register("image")}
          onChange={handleImageChange}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-32 rounded object-cover"
          />
        )}
      </div>

      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Save Department
      </button>
    </form>
  );
}
