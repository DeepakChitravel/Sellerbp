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

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [slugLocked, setSlugLocked] = useState(false); // ⭐ avoid overwrite slug when user edits

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [images, setImages] = useState("");

  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [regNumber, setRegNumber] = useState("");

  // load existing values when editing
  useEffect(() => {
    if (!categoryData) return;

    setName(categoryData.name || "");
    setSlug(categoryData.slug || "");
    setMetaTitle(categoryData.metaTitle || "");
    setMetaDescription(categoryData.metaDescription || "");
    setImages(categoryData.image || "");

    if (categoryData.doctorDetails) {
      setDoctorName(categoryData.doctorDetails.doctorName || "");
      setSpecialization(categoryData.doctorDetails.specialization || "");
      setQualification(categoryData.doctorDetails.qualification || "");
      setExperience(categoryData.doctorDetails.experience || "");
      setRegNumber(categoryData.doctorDetails.regNumber || "");
    }
  }, [categoryData]);

  // auto slug sync – but allow manual override
  useEffect(() => {
    if (slugLocked || !name.trim()) return;

    const generated = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

    setSlug(generated);
  }, [name, slugLocked]);

  // when user enters slug manually → lock
  const handleSlugChange = (val: string) => {
    setSlugLocked(true);
    setSlug(val);
  };

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
      const payload = {
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

      const resp = isEdit
        ? await updateCategory(categoryId, payload)
        : await addCategory(payload);

      handleToast(resp);

      if (resp.success) {
        router.replace("/categories");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message);
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-5 pb-32">
        <div className="lg:col-span-7 col-span-12 grid gap-5">

          <CategoryInformation
            name={{ value: name, setValue: setName }}
            slug={{ value: slug, setValue: handleSlugChange }} // ⭐ override here
          />

          <DoctorInformation
            doctorName={{ value: doctorName, setValue: setDoctorName }}
            specialization={{ value: specialization, setValue: setSpecialization }}
            qualification={{ value: qualification, setValue: setQualification }}
            experience={{ value: experience, setValue: setExperience }}
            regNumber={{ value: regNumber, setValue: setRegNumber }}
          />

        </div>

        <div className="lg:col-span-5 col-span-12 grid gap-5">
          <CategoryImage images={{ value: images, setValue: setImages }} userId={userId} />
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
