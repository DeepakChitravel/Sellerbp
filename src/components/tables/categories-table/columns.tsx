"use client";

import { formatDate } from "@/lib/utils";
import { Category } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
 DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Edit, More, Trash } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/lib/api/categories";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Action({ categoryId }: { categoryId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await deleteCategory(categoryId);
      toast.success(response.message);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <More />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuGroup>
          <Link href={`/categories/${categoryId}`}>
            <DropdownMenuItem className="text-blue-600">
              <Edit variant="Bold" className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger className="w-full">
              <button
                className="relative flex cursor-default select-none items-center 
                rounded-sm px-2 py-1.5 text-sm outline-none transition-colors 
                hover:bg-accent hover:text-accent-foreground text-red-600 w-full"
              >
                <Trash variant="Bold" className="mr-2 h-4 w-4" />
                Delete
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete the category.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<Category>[] = [
  {
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
{
  header: "Image",
  cell: ({ row }) => {
    const data = row.original;
    const img = data.image;

    // ❌ If image is null, undefined, empty, or missing extension — show placeholder
    const isValid =
      img &&
      typeof img === "string" &&
      img.includes("."); // ensures a real file is present

    if (!isValid) {
      return (
        <div className="w-[50px] h-[50px] rounded bg-gray-200 border flex items-center justify-center text-xs text-gray-500">
          N/A
        </div>
      );
    }

    // ✔ Safe to use <Image>
    return (
      <Image
        src={img}
        alt={data.name}
        width={50}
        height={50}
        className="rounded object-cover border"
        unoptimized
      />
    );
  },
},

  {
    accessorKey: "name",
    header: "Category Name",
  },
  {
    accessorKey: "slug",
    header: "Category Slug",
  },
  {
    header: "Created At",
    cell: ({ row }) => {
      const data = row.original;
      return formatDate(new Date(data.created_at));
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const data = row.original;

      // ⭐ CORRECT VALUE — MUST USE categoryId, NOT category_id
      return <Action categoryId={data.categoryId} />;
    },
  },
];
