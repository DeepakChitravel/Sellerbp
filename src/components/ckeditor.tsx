import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CkEditorProps {
  data: string;
  onChange: (data: string) => void;
}

const CkEditor: React.FC<CkEditorProps> = ({ data, onChange }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      onChange={(event, editor) => {
        const content = editor.getData();
        onChange(content);
      }}
    />
  );
};

export default CkEditor;
