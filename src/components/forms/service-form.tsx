"use client";
import { useEffect, useState } from "react";
import ServiceInformation from "./service-forms/service-information";
import ServiceImage from "./service-forms/service-image";
import ServiceSEO from "./service-forms/service-seo";
import Sticky from "../sticky";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { addService, updateService } from "@/lib/api/services";
import { handleToast } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ServiceFormProps } from "@/types";
import AdditionalImages from "./service-forms/additional-images";
import ServiceGst from "./service-forms/serviceGst";
import useCurrentUser from "@/hooks/useCurrentUser";

const ServiceForm = ({ serviceId, serviceData, isEdit }: ServiceFormProps) => {
  const router = useRouter();
  const { userData } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  // Basic fields
  const [name, setName] = useState<string>(serviceData?.name);
  const [slug, setSlug] = useState<string>(serviceData?.slug);
  const [amount, setAmount] = useState<string>(serviceData?.amount);
  const [previousAmount, setPreviousAmount] = useState<string>(serviceData?.previousAmount);

  const [categoryId, setCategoryId] = useState<string | undefined>(
    serviceData?.categoryId ? serviceData.categoryId.toString() : undefined
  );

  const [timeSlotInterval, setTimeSlotInterval] = useState<string>(serviceData?.timeSlotInterval);
  const [intervalType, setIntervalType] = useState<string>(
    serviceData?.intervalType || "minutes"
  );

  const [description, setDescription] = useState<string>(serviceData?.description);
  const [gstPercentage, setGstPercentage] = useState<string | number>(
    serviceData?.gstPercentage?.toString()
  );
  const [status, setStatus] = useState<boolean>(serviceData?.status);

  // ----------------------------
  // ⭐ MAIN IMAGE (store raw DB path)
  // ----------------------------
const [image, setImage] = useState<string>(
  serviceData?.image?.startsWith("/") 
    ? serviceData.image 
    : "/" + serviceData?.image || ""
);

  // ----------------------------
  // ⭐ ADDITIONAL IMAGES (always raw paths)
  // ----------------------------
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  useEffect(() => {
    if (!serviceData?.additionalImages) {
      setAdditionalImages([]);
      return;
    }

    // backend gives: [{ image: "uploads/sellers/..." }]
    const arr = serviceData.additionalImages.map((item) => item.image);

    setAdditionalImages(arr);
  }, [serviceData]);

  const [metaTitle, setMetaTitle] = useState<string>(serviceData?.metaTitle);
  const [metaDescription, setMetaDescription] = useState<string>(serviceData?.metaDescription);

  // ----------------------------
  // SAVE HANDLER
  // ----------------------------
  const handleSave = async () => {
    setIsLoading(true);

    try {
      const data = {
        name,
        slug,
        amount,
        previousAmount,
        image, // raw relative path
        categoryId: categoryId ? parseInt(categoryId) : null,
        timeSlotInterval,
        intervalType,
        description,
        gstPercentage,
        metaTitle,
        metaDescription,
        status,
        additionalImages, // raw list of relative paths
      };

      const response = !isEdit
        ? await addService(data)
        : await updateService(serviceId, data);

      handleToast(response);

      if (!isEdit && response.success) {
        router.push(`/services?${Math.floor(Math.random() * 100)}`);
      }
    } catch (error: any) {
      toast.error(error.message);
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-7 col-span-12 grid gap-5">
          <ServiceInformation
            name={{ value: name, setValue: setName }}
            slug={{ value: slug, setValue: setSlug }}
            amount={{ value: amount, setValue: setAmount }}
            previousAmount={{ value: previousAmount, setValue: setPreviousAmount }}
            description={{ value: description, setValue: setDescription }}
            categoryId={{ value: categoryId, setValue: setCategoryId }}
            timeSlotInterval={{ value: timeSlotInterval, setValue: setTimeSlotInterval }}
            intervalType={{ value: intervalType, setValue: setIntervalType }}
            status={{ value: status, setValue: setStatus }}
          />

          <ServiceSEO
            metaTitle={{ value: metaTitle, setValue: setMetaTitle }}
            metaDescription={{ value: metaDescription, setValue: setMetaDescription }}
          />
        </div>

        <div className="lg:col-span-5 col-span-12">
          <div className="grid gap-5">

            {/* ⭐ Main Image */}
            <ServiceImage
              images={{
                value: image,
                setValue: (v: string) => setImage(v), // MUST be raw path
              }}
            />

            {/* ⭐ Additional Images */}
            <AdditionalImages
              images={{
                value: additionalImages,
                setValue: (arr: string[]) => setAdditionalImages(arr),
              }}
            />

            {userData?.siteSettings?.[0]?.gstNumber && (
              <ServiceGst
                gstPercentage={{ value: gstPercentage, setValue: setGstPercentage }}
              />
            )}
          </div>
        </div>
      </div>

      <Sticky>
        <Button onClick={handleSave} disabled={isLoading} isLoading={isLoading}>
          Save
        </Button>
      </Sticky>
    </>
  );
};

export default ServiceForm;
