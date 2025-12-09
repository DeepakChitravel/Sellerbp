"use client";

import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function RichTextEditor({ name, label }: { name: string; label: string }) {
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
      <label className="font-medium mb-1 block">{label}</label>

      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={(v) => setValue(name, v)}
        modules={modules}
        className="bg-white rounded-md"
      />
    </div>
  );
}
