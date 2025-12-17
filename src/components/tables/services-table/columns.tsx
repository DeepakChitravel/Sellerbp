"use client";

import { formatNumber } from "@/lib/utils";
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

/* --------------------------------
   Helpers
--------------------------------- */

// Image src helper
const getSrc = (path?: string) => {
  if (!path) return "/placeholder-image.jpg";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // ✅ SAME LOGIC AS EMPLOYEES
  return `http://localhost/managerbp/public${path}`;
};


// Date formatter → 12 Dec 2025
const formatPrettyDate = (dateStr?: string) => {
  if (!dateStr) return "-";

  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* --------------------------------
   Action menu
--------------------------------- */

function Action({ serviceId }: { serviceId: string }) {
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
            <AlertDialogTrigger asChild>
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

/* --------------------------------
   Table Columns
--------------------------------- */

export const columns: ColumnDef<Service>[] = [
  {
    header: "#",
    cell: ({ row }) => row.index + 1,
  },

  {
    header: "Image",
    cell: ({ row }) => {
      const service = row.original;

      if (!service.image) {
        return (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
            {service.name?.charAt(0).toUpperCase()}
          </div>
        );
      }

      return (
       <img
  src={getSrc(service.image)}
  alt={service.name}
  className="w-12 h-12 rounded-full object-cover"
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
          <span>{symbol + formatNumber(Number(data.amount))}</span>

          {data.previousAmount && (
            <small className="block line-through text-gray-500">
              {symbol + formatNumber(Number(data.previousAmount))}
            </small>
          )}
        </>
      );
    },
  },

  {
    header: "Created At",
    cell: ({ row }) => {
      return formatPrettyDate(row.original.created_at);
    },
  },

  {
    header: "Action",
    cell: ({ row }) => (
      <Action serviceId={row.original.service_id} />
    ),
  },
];
