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

  const [slugLocked, setSlugLocked] = useState(false); // ⭐ avoid overwrite slug when user edits
const [typeMainName, setTypeMainName] = useState("");
const [typeMainAmount, setTypeMainAmount] = useState("");

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [images, setImages] = useState("");

  // load existing values when editing
  useEffect(() => {
    if (!departmentData) return;

    setName(departmentData.name || "");
    setType(departmentData.type || "");
    setSlug(departmentData.slug || "");
    setMetaTitle(departmentData.metaTitle || "");
    setMetaDescription(departmentData.metaDescription || "");
    setImages(departmentData.image || "");
  }, [departmentData]);

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
        type,
        slug,
        image: normalizeImagePath(images),
        metaTitle,
        metaDescription,
      };

      const resp = isEdit
        ? await updateDepartment(departmentId, payload)
        : await addDepartment(payload);

      handleToast(resp);

      if (resp.success) {
        router.replace("/department");
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
   <DepartmentInformation
  name={{ value:name, setValue:setName }}
  type={{ value:type, setValue:setType }}
  slug={{ value:slug, setValue:handleSlugChange }}

  typeMainName={{ value:typeMainName, setValue:setTypeMainName }}
  typeMainAmount={{ value:typeMainAmount, setValue:setTypeMainAmount }}
/>

        </div>

        <div className="lg:col-span-5 col-span-12 grid gap-5">
          <DepartmentImage
            images={{ value: images, setValue: setImages }}
            userId={userId}
          />
          <DepartmentSEO
            metaTitle={{ value: metaTitle, setValue: setMetaTitle }}
            metaDescription={{
              value: metaDescription,
              setValue: setMetaDescription
            }}
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