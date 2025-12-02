import { FormValueProps } from "@/types";
import FileDialog from "@/components/file-upload/file-dialog";

const ServiceImage = ({ images }: FormValueProps) => {
  return (
    <div className="bg-white rounded-xl p-5">
      <div className="mb-9 space-y-1.5">
        <h3 className="font-medium">Main Image</h3>
        <p className="text-black/50 text-sm font-medium">
          Upload service image to make your service stand out.
        </p>
      </div>

      <div className="space-y-6">
        <FileDialog files={images.value} setFiles={images.setValue} />
      </div>
    </div>
  );
};

export default ServiceImage;
