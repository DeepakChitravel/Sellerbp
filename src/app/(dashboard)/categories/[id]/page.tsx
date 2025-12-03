import CategoryForm from "@/components/forms/category-form";
import { getCategory } from "@/lib/api/categories";
import { notFound } from "next/navigation";

const Category = async ({ params: { id } }: { params: { id: string } }) => {
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
        categoryData={id === "add" ? null : category.data} // ⭐ FIXED
        isEdit={id !== "add"}
      />
    </>
  );
};

export default Category;
