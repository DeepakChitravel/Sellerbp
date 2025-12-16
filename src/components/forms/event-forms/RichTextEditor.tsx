"use client";

import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
  name: string;
  label: string;
  placeholder?: string;
}

export default function RichTextEditor({
  name,
  label,
  placeholder = "Write here...",
}: RichTextEditorProps) {
  const { watch, setValue } = useFormContext();
  const value = watch(name);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="mt-4">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="rounded-lg border border-gray-300 bg-white transition focus-within:border-purple-600">
        <ReactQuill
          theme="snow"
          value={value || ""}
          onChange={(v) => setValue(name, v, { shouldDirty: true })}
          modules={modules}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
