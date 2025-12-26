"use client";

import { useEffect, useState } from "react";
import DepartmentInformation from "./department-form/department-information";
import DepartmentImage from "./department-form/department-image";
import DepartmentSEO from "./department-form/department-seo";
import Sticky from "../sticky";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { addDepartment, updateDepartment } from "@/lib/api/departments";
import { handleToast } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { DepartmentFormProps } from "@/types";
import DepartmentAdditionalImages from "./department-form/department-additional-images";

/* ============================
   ✅ TYPE VALIDATION (IMPORTANT)
============================ */
const validateTypes = (types: { name: string; amount: string }[]) => {
  // Main type (required)
  if (!types[0].name.trim() || !types[0].amount.trim()) {
    return "Main type name and amount are required";
  }

  // Additional types
  for (let i = 1; i <= 25; i++) {
    const { name, amount } = types[i];

    // unused → OK
    if (!name && !amount) continue;

    // partially filled → ❌
    if (!name || !amount) {
      return `Type ${i}: Please fill both name and amount`;
    }
  }

  return null; // ✅ valid
};

const DepartmentForm = ({
  departmentId,
  departmentData,
  isEdit,
  userId,
}: DepartmentFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [slug, setSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(false);

  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  // 0 → 25 Type fields
  const [types, setTypes] = useState(
    Array.from({ length: 26 }, () => ({ name: "", amount: "" }))
  );

  const updateType = (index: number, key: "name" | "amount", value: string) => {
    setTypes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [images, setImages] = useState("");

  /* ============================
     LOAD EDIT DATA
  ============================ */
  useEffect(() => {
    if (!departmentData) return;

    setName(departmentData.name || "");
    setType(departmentData.type || "");
    setSlug(departmentData.slug || "");
    setMetaTitle(departmentData.metaTitle || "");
    setMetaDescription(departmentData.metaDescription || "");
    setImages(departmentData.image || "");
    setAdditionalImages(departmentData.additionalImages || []);

    const newTypes = [...types];
    newTypes[0].name = departmentData.typeMainName || "";
    newTypes[0].amount = departmentData.typeMainAmount || "";

    for (let i = 1; i <= 25; i++) {
      newTypes[i].name = departmentData[`type${i}Name`] || "";
      newTypes[i].amount = departmentData[`type${i}Amount`] || "";
    }

    setTypes(newTypes);
  }, [departmentData]);

  /* ============================
     AUTO SLUG
  ============================ */
  useEffect(() => {
    if (slugLocked || !name.trim()) return;
    setSlug(
      name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
    );
  }, [name, slugLocked]);

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

  /* ============================
     ✅ SAVE WITH VALIDATION
  ============================ */
  const handleSave = async () => {
    // ⛔ TYPE VALIDATION FIRST
    const typeError = validateTypes(types);
    if (typeError) {
      toast.error(typeError);
      return;
    }

    setIsLoading(true);

    try {
      const payload: any = {
        name,
        type,
        slug,
        image: normalizeImagePath(images),
        metaTitle,
        metaDescription,
        typeMainName: types[0].name,
        typeMainAmount: types[0].amount,
        additionalImages,
      };

      for (let i = 1; i <= 25; i++) {
        payload[`type${i}Name`] = types[i].name;
        payload[`type${i}Amount`] = types[i].amount;
      }

      const resp = isEdit
        ? await updateDepartment(departmentId, payload)
        : await addDepartment(payload);

      handleToast(resp);

      if (resp.success) {
        router.replace("/departments");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-5 pb-32">
        <div className="lg:col-span-7 col-span-12 grid gap-5">
          <DepartmentInformation
            name={{ value: name, setValue: setName }}
            type={{ value: type, setValue: setType }}
            slug={{ value: slug, setValue: handleSlugChange }}
            typeMainName={{
              value: types[0].name,
              setValue: (v) => updateType(0, "name", v),
            }}
            typeMainAmount={{
              value: types[0].amount,
              setValue: (v) => updateType(0, "amount", v),
            }}
            {...Array.from({ length: 25 }).reduce((acc, _, i) => {
              const index = i + 1;
              acc[`type${index}Name`] = {
                value: types[index]?.name ?? "",
                setValue: (v: string) => updateType(index, "name", v),
              };
              acc[`type${index}Amount`] = {
                value: types[index]?.amount ?? "",
                setValue: (v: string) => updateType(index, "amount", v),
              };
              return acc;
            }, {})}
          />
        </div>

        <div className="lg:col-span-5 col-span-12 grid gap-5">
          <DepartmentImage images={{ value: images, setValue: setImages }} userId={userId} />
          <DepartmentAdditionalImages images={additionalImages} setImages={setAdditionalImages} userId={userId} />
          <DepartmentSEO
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

export default DepartmentForm;
