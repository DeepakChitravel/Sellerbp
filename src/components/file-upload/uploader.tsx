import { useState } from "react";
import { FileUploader as ReactFileUploader } from "react-drag-drop-files";
import { uploadFile } from "@/lib/api/files";
import { getCookie } from "cookies-next";
import { Progress } from "../ui/progress";
import { ImageUp } from "lucide-react";

const Uploader = ({ ...props }) => {
  const [progress, setProgress] = useState(0);

  // On files change
  const handleFileChange = async (selectedFiles: any) => {
    const token = getCookie("token");

    if (token && selectedFiles) {
      let data: string[] = [];

      const formData = new FormData();
      for (
        let i = 0;
        i < (selectedFiles?.name ? 1 : selectedFiles.length);
        i++
      ) {
        formData.append(
          "files",
          (selectedFiles.name ? selectedFiles : selectedFiles[i]) as File
        );
      }

      const response = await uploadFile(token, formData, setProgress);
      props.getFilesData();
      setProgress(0);
    }
  };

  return (
    <>
      <ReactFileUploader
        handleChange={handleFileChange}
        name="file"
        multiple={true}
        {...props}
      >
        <div className="bg-gray-50 border-2 border-dashed rounded-md p-3 flex items-center flex-col cursor-pointer">
          <div className="flex gap-2 flex-wrap">
            {props.fileTypes.map((fileType: string) => (
              <span
                className="text-xs border border-dashed text-gray-500 px-1 py-1 block"
                key={fileType}
              >
                {fileType}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-center text-center flex-col mt-8 mb-5 space-y-2">
            <ImageUp size={38} className="text-gray-500" />
            <span className="text-gray-500 block text-sm">
              Drag and drop files here or
            </span>
          </div>

          <button className="h-10 px-3 border text-gray-500 text-sm font-medium rounded block">
            Browse Files
          </button>
        </div>
      </ReactFileUploader>

      {progress !== 0 && (
        <Progress value={progress} className="bg-gray-100 mt-3" />
      )}
    </>
  );
};

export default Uploader;
