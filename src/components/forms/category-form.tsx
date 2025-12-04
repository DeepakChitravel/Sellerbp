"use client";

import { useState } from "react";
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

const CategoryForm = ({ categoryId, categoryData, isEdit, userId }: CategoryFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState<string>(categoryData?.name);
  const [slug, setSlug] = useState<string>(categoryData?.slug);
  const [metaTitle, setMetaTitle] = useState<string>(categoryData?.metaTitle);
  const [metaDescription, setMetaDescription] = useState<string>(categoryData?.metaDescription);

  const [images, setImages] = useState<string>(
    categoryData?.image?.replace("http://localhost/managerbp/public/uploads/", "")
  );

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const data = {
        name,
        slug,
        image: images,
        metaTitle,
        metaDescription,
      };

      const response = !isEdit
        ? await addCategory(data)
        : await updateCategory(categoryId, data);

      handleToast(response);

      if (!isEdit && response.success)
        router.push(`/categories?${Math.random()}`);
    } catch (error: any) {
      toast.error(error.message);
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-7 col-span-12 grid gap-5">
          <CategoryInformation
            name={{ value: name, setValue: setName }}
            slug={{ value: slug, setValue: setSlug }}
          />

          <CategorySEO
            metaTitle={{ value: metaTitle, setValue: setMetaTitle }}
            metaDescription={{ value: metaDescription, setValue: setMetaDescription }}
          />
        </div>

        <div className="lg:col-span-5 col-span-12">
          <CategoryImage
            images={{ value: images, setValue: setImages }}
            userId={userId}  // ← FIXED HERE
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
