"use client";

import { useEffect, useState } from "react";
import CategoryInformation from "./category-forms/category-information";
import CategoryImage from "./category-forms/category-image";
import CategorySEO from "./category-forms/category-seo";
import Sticky from "../sticky";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { addCategory, updateCategory } from "@/lib/api/categories";
import { handleToast } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CategoryFormProps } from "@/types";
import DoctorInformation from "./category-forms/doctor-information";

const CategoryForm = ({
  categoryId,
  categoryData,
  isEdit,
  userId,
}: CategoryFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState<string>(categoryData?.name || "");
  const [slug, setSlug] = useState<string>(categoryData?.slug || "");

  const [metaTitle, setMetaTitle] = useState(categoryData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState<string>(
    categoryData?.metaDescription || ""
  );

  const [images, setImages] = useState<string>(categoryData?.image || "");

  // Doctor fields
  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [regNumber, setRegNumber] = useState("");

  // ⭐ FIX — hydrate doctor data when editing
  useEffect(() => {
if (categoryData?.doctorDetails) {
  setDoctorName(categoryData.doctorDetails.doctorName || "");
  setSpecialization(categoryData.doctorDetails.specialization || "");
  setQualification(categoryData.doctorDetails.qualification || "");
  setExperience(categoryData.doctorDetails.experience || "");
  setRegNumber(categoryData.doctorDetails.regNumber || "");
}

  }, [categoryData]);

  const normalizeImagePath = (img: string) => {
    if (!img) return "";

    if (img.startsWith("http")) {
      const marker = "/uploads/";
      const index = img.indexOf(marker);
      return index !== -1 ? img.slice(index + marker.length) : img;
    }

    return img;
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const data = {
        name,
        slug,
        image: normalizeImagePath(images),
        metaTitle,
        metaDescription,
        doctorDetails: {
          doctorName,
          specialization,
          qualification,
          experience,
          regNumber,
        },
      };

      const response = !isEdit
        ? await addCategory(data)
        : await updateCategory(categoryId, data);

      handleToast(response);

      if (response.success) {
        router.replace("/categories");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message);
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-5 pb-32">

        {/* LEFT side */}
        <div className="lg:col-span-7 col-span-12 grid gap-5">
          <CategoryInformation
            name={{ value: name, setValue: setName }}
            slug={{ value: slug, setValue: setSlug }}
          />

          <DoctorInformation
            doctorName={{ value: doctorName, setValue: setDoctorName }}
            specialization={{ value: specialization, setValue: setSpecialization }}
            qualification={{ value: qualification, setValue: setQualification }}
            experience={{ value: experience, setValue: setExperience }}
            regNumber={{ value: regNumber, setValue: setRegNumber }}
          />
        </div>

        {/* RIGHT side */}
        <div className="lg:col-span-5 col-span-12 grid gap-5">
          <CategoryImage
            images={{ value: images, setValue: setImages }}
            userId={userId}
          />

          <CategorySEO
            metaTitle={{ value: metaTitle, setValue: setMetaTitle }}
            metaDescription={{ value: metaDescription, setValue: setMetaDescription }}
          />
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

export default CategoryForm;
