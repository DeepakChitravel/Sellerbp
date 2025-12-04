"use client";

import { uploadsUrl } from "@/config";
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

function Action({ id, serviceId }: { id: number; serviceId: string }) {
  const { refresh } = useRouter();

  const handleDelete = async () => {
    try {
      const response = await deleteService(serviceId);
      toast.success(response.message);
      refresh();
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
              <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 w-full">
                <Trash variant="Bold" className="mr-2 h-4 w-4" />
                Delete
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove
                  your service from our servers.
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

export const columns: ColumnDef<Service>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    header: "Image",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <Image
          src={data.image?.startsWith("http") ? data.image : `${uploadsUrl}/${data.image}`}
          alt={data.name}
          width={50}
          height={50}
          className="rounded"
        />
      );
    },
  },
  {
    header: "Service",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <>
          <span className="block">{data.name}</span>
          <small className="block">/{data.slug}</small>
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
          <span className="block">
            {symbol + formatNumber(parseInt(data.amount))}
          </span>
          {data.previousAmount && (
            <small className="block line-through">
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
      return formatDate(new Date(data.createdAt));
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
