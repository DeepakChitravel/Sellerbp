import { FormValueProps } from "@/types";
import FileDialog from "@/components/file-upload/file-dialog";

const EmployeeImage = ({ images }: FormValueProps) => {
  return (
    <div className="bg-white rounded-xl p-5">
      <div className="mb-9 space-y-1.5">
        <h3 className="font-medium">Employee Image</h3>
        <p className="text-black/50 text-sm font-medium">
          Upload employee image.
        </p>
      </div>

      <div className="space-y-6">
        <FileDialog files={images.value} setFiles={images.setValue} />
      </div>
    </div>
  );
};

export default EmployeeImage;
