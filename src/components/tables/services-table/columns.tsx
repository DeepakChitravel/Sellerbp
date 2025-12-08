"use client";

import { formatDate, formatNumber } from "@/lib/utils";
import { Service } from "@/types";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteService } from "@/lib/api/services";
import getSymbolFromCurrency from "currency-symbol-map";


// ⭐ UNIVERSAL getSrc FIXED — only ONE version
const getSrc = (path: string) => {
  if (!path) return "/placeholder-image.jpg";

  // If backend returned a full URL (starting with http)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Otherwise treat path as relative to uploads folder
  return `http://localhost/managerbp/public/uploads/${path}`;
};



// ⭐ CLEANED ACTION BUTTON
function Action({ id, serviceId }: { id: number; serviceId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await deleteService(serviceId);
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

          <Link href={`/services/${serviceId}`}>
            <DropdownMenuItem className="text-blue-600">
              <Edit variant="Bold" className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger className="w-full">
              <button className="flex w-full items-center px-2 py-1.5 text-sm text-red-600 hover:bg-accent rounded">
                <Trash variant="Bold" className="mr-2 h-4 w-4" />
                Delete
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete service?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
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




// ⭐ TABLE COLUMNS FIXED
export const columns: ColumnDef<Service>[] = [
  {
    header: "#",
    cell: ({ row }) => row.index + 1,
  },

  {
    header: "Image",
    cell: ({ row }) => {
      const service = row.original;

      return (
        <Image
          src={getSrc(service.image)}
          alt={service.name}
          width={50}
          height={50}
          className="rounded object-cover"
          unoptimized
        />
      );
    },
  },

  {
    header: "Service",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <>
          <span>{s.name}</span>
          <small className="block text-gray-500">/{s.slug}</small>
        </>
      );
    },
  },

  {
    header: "Amount",
    cell: ({ row }) => {
      const data = row.original;

      const currency = data?.user?.siteSettings?.[0]?.currency || "INR";
      const symbol = getSymbolFromCurrency(currency);

      return (
        <>
          <span>{symbol + formatNumber(parseInt(data.amount))}</span>

          {data.previousAmount && (
            <small className="line-through text-gray-500">
              {symbol + formatNumber(parseInt(data.previousAmount))}
            </small>
          )}
        </>
      );
    },
  },

  {
    header: "Created At",
    cell: ({ row }) => {
      const data = row.original;

      // ⭐ FIX: Only show date, not time
      const onlyDate = data.created_at?.split(" ")[0] || "";

      return onlyDate || "-";
    },
  },

  {
    header: "Action",
    cell: ({ row }) => {
      const data = row.original;
      return <Action id={data.id} serviceId={data.service_id} />;
    },
  },
];
