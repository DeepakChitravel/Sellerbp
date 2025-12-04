import CategoryForm from "@/components/forms/category-form";
import { getCategory } from "@/lib/api/categories";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";   // ⭐ ADD THIS

const Category = async ({ params: { id } }: { params: { id: string } }) => {
  // ⭐ GET USER ID FROM COOKIE
  const userId = cookies().get("user_id")?.value || "";

  if (!userId) {
    // optional: handle missing userId however you want
    // return notFound();
  }

  let category = null;

  if (id !== "add") category = await getCategory(id);

  if (id !== "add" && !category?.data) return notFound();

  return (
    <>
      <h1 className="text-2xl font-bold mb-5">
        {id === "add" ? "Add" : "Edit"} Category
      </h1>

      <CategoryForm
        categoryId={id}
        categoryData={id === "add" ? null : category.data}
        isEdit={id !== "add"}
        userId={userId}      // ⭐ PASS USER ID HERE
      />
    </>
  );
};

export default Category;
