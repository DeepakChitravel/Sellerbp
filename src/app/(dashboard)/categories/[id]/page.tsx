export const dynamic = "force-dynamic";

import CategoryForm from "@/components/forms/category-form";
import { getCategory } from "@/lib/api/categories";
import { getDoctorByCategory } from "@/lib/api/doctors";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

type Props = {
  params: { id: string };
};

const CategoryPage = async ({ params }: Props) => {
  const { id } = params;

  const userIdCookie = cookies().get("user_id")?.value;
  const userId = userIdCookie ? Number(userIdCookie) : null;

  if (!userId) return notFound();

  // ADD Category
  if (id === "add") {
    return (
      <>
        <h1 className="text-2xl font-bold mb-5">Add Category</h1>
        <CategoryForm
          categoryId="add"
          categoryData={null}
          isEdit={false}
          userId={userId}
        />
      </>
    );
  }

  console.log("📌 Edit Page Loaded");
  console.log("👉 Received Category ID (string):", id);
  console.log("👉 User ID:", userId);

  // Fetch category
  const category = await getCategory(id);
  console.log("🔵 Category response:", JSON.stringify(category, null, 2));

  if (!category?.data) return notFound();

  // ⭐ IMPORTANT FIX — use numeric ID for doctor lookup
  const numericCategoryId = Number(category.data.id);

  console.log("🔴 Numeric Category ID for doctor:", numericCategoryId);

  const doctorDetails = await getDoctorByCategory(numericCategoryId, userId);

  console.log("🔴 Doctor response:", JSON.stringify(doctorDetails, null, 2));

  const finalCategoryData = {
    ...category.data,
    doctorDetails: doctorDetails
      ? {
        doctorName: doctorDetails.doctor_name || "",
        specialization: doctorDetails.specialization || "",
        qualification: doctorDetails.qualification || "",
        experience: doctorDetails.experience || "",
        regNumber: doctorDetails.reg_number || "",
        doctorImage: doctorDetails.doctor_image || "",
      }
      : null,
  };


  return (
    <>
      <h1 className="text-2xl font-bold mb-5">Edit Category</h1>

      <CategoryForm
        categoryId={numericCategoryId}
        categoryData={finalCategoryData}
        isEdit={true}
        userId={userId}
      />
    </>
  );
};

export default CategoryPage;
