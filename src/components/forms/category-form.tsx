"use client";

import { useEffect, useState } from "react";
import CategoryInformation from "./category-forms/category-information";
import DoctorImage from "./category-forms/doctor-image";
import CategorySEO from "./category-forms/category-seo";
import Sticky from "../sticky";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { addCategory, updateCategory } from "@/lib/api/categories";
import { useRouter } from "next/navigation";
import DoctorInformation from "./category-forms/doctor-information";
import { CategoryFormProps } from "@/types";
import { addDoctor, updateDoctor } from "@/lib/api/doctors";

const CategoryForm = ({ categoryId, categoryData, isEdit, userId }: CategoryFormProps) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(false);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [doctorImage, setDoctorImage] = useState("");

  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [regNumber, setRegNumber] = useState("");

  // fill when editing
  useEffect(() => {
    if (!categoryData) return;

    setName(categoryData.name || "");
    setSlug(categoryData.slug || "");
    setMetaTitle(categoryData.metaTitle || "");
    setMetaDescription(categoryData.metaDescription || "");

    if (categoryData.doctorDetails) {
      setDoctorName(categoryData.doctorDetails.doctorName || "");
      setSpecialization(categoryData.doctorDetails.specialization || "");
      setQualification(categoryData.doctorDetails.qualification || "");
      setExperience(categoryData.doctorDetails.experience || "");
      setRegNumber(categoryData.doctorDetails.regNumber || "");
      setDoctorImage(categoryData.doctorDetails.doctorImage || "");
    }
  }, [categoryData]);


  // slug auto update
  useEffect(() => {
    if (slugLocked || !name.trim()) return;

    const generated = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

    setSlug(generated);
  }, [name, slugLocked]);


  const handleSlugChange = (val: string) => {
    setSlugLocked(true);
    setSlug(val);
  };


  const handleSave = async () => {
    setIsLoading(true);

    try {
      /* ----------------- VALIDATION ------------------ */

      if (!name.trim()) {
        toast.error("Category name required");
        setIsLoading(false);
        return;
      }

      if (!doctorName.trim()) {
        toast.error("Doctor name required");
        setIsLoading(false);
        return;
      }

      if (!specialization.trim()) {
        toast.error("Doctor specialization required");
        setIsLoading(false);
        return;
      }

      if (!qualification.trim()) {
        toast.error("Doctor qualification required");
        setIsLoading(false);
        return;
      }



      /* ---------- 1️⃣ Save Category first ---------- */

      const categoryPayload = {
        name,
        slug,
        metaTitle,
        metaDescription,
      };

      const categoryResp = isEdit
        ? await updateCategory(categoryId, categoryPayload)
        : await addCategory(categoryPayload);

      if (!categoryResp.success) {
        toast.error("Failed saving category");
        setIsLoading(false);
        return;
      }

const newCategoryId = isEdit
  ? categoryId                // already numeric
  : categoryResp.id;          // numeric from backend

      /* ---------- 2️⃣ Save doctor second ---------- */

const doctorPayload = {
  user_id: userId,         // ⭐ MUST BE PRESENT
  doctor_name: doctorName,
  specialization,
  qualification,
  experience,
  reg_number: regNumber,
  doctor_image: doctorImage,
  category_id: newCategoryId,
};


const doctorResp = isEdit
  ? await updateDoctor(categoryId, doctorPayload)
  : await addDoctor(doctorPayload);

console.log("🔥 doctor response:", doctorResp);   // add

if (!doctorResp.success) {
  console.error("❌ doctor save failed:", doctorResp.error || doctorResp.message);
  toast.error(doctorResp.error || "Doctor save failed");
  setIsLoading(false);
  return;
}


      toast.success("Category + Doctor saved");
      router.replace("/categories");
      router.refresh();

    } catch (err: any) {
      toast.error(err.message);
    }

    setIsLoading(false);
  };


  return (
    <>
      <div className="grid grid-cols-12 gap-5 pb-32">

        {/* LEFT */}
        <div className="lg:col-span-7 col-span-12 grid gap-5">

          <CategoryInformation
            name={{ value: name, setValue: setName }}
            slug={{ value: slug, setValue: handleSlugChange }}
          />

          <DoctorInformation
            doctorName={{ value: doctorName, setValue: setDoctorName }}
            specialization={{ value: specialization, setValue: setSpecialization }}
            qualification={{ value: qualification, setValue: setQualification }}
            experience={{ value: experience, setValue: setExperience }}
            regNumber={{ value: regNumber, setValue: setRegNumber }}
          />

        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 col-span-12 grid gap-5">

          <DoctorImage
            doctorImage={{ value: doctorImage, setValue: setDoctorImage }}
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
