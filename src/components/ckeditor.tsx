"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

interface CkEditorProps {
  data: string;
  onChange: (value: string) => void;
}

const CKEditor = dynamic(() => import("@ckeditor/ckeditor5-react").then(mod => mod.CKEditor), {
  ssr: false,
});

export default function CkEditor({ data, onChange }: CkEditorProps) {
  const [Editor, setEditor] = useState<any>(null);

  useEffect(() => {
    import("@ckeditor/ckeditor5-build-classic").then((mod) => {
      setEditor(mod.default);
    });
  }, []);

  if (!Editor) return <p>Loading editor...</p>;

  return (
    <CKEditor
      editor={Editor}
      data={data}
      onChange={(event: any, editor: any) => {
        onChange(editor.getData());
      }}
    />
  );
}
