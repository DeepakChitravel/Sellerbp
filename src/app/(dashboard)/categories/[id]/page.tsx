export const dynamic = "force-dynamic"; // ✅ IMPORTANT FIX

import CategoryForm from "@/components/forms/category-form";
import { getCategory } from "@/lib/api/categories";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

type Props = {
  params: {
    id: string;
  };
};

const CategoryPage = async ({ params }: Props) => {
  const { id } = params;

  // ✅ GET USER ID FROM COOKIE
  const userId = cookies().get("user_id")?.value || "";

  if (!userId) {
    // If user is not logged in
    return notFound();
  }

  // ===============================
  // ADD CATEGORY
  // ===============================
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

  // ===============================
  // EDIT CATEGORY
  // ===============================
  const category = await getCategory(id);

  if (!category?.data) {
    return notFound();
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-5">Edit Category</h1>

      <CategoryForm
        categoryId={id}
        categoryData={category.data}
        isEdit={true}
        userId={userId}
      />
    </>
  );
};

export default CategoryPage;
