"use client";

import { formatDate, formatNumber } from "@/lib/utils";
import { Coupon } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

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
import { deleteCoupon } from "@/lib/api/coupons";
import getSymbolFromCurrency from "currency-symbol-map";
import { Badge } from "@/components/ui/badge";

function Action({ id, couponId }: { id: number; couponId: string }) {
  const { refresh } = useRouter();

  const handleDelete = async () => {
    try {
      const response = await deleteCoupon(id);
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
          <Link href={`/coupons/${couponId}`}>
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
                  your coupon from our servers.
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

export const columns: ColumnDef<Coupon>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    accessorKey: "name",
    header: "Coupon Name",
  },
  {
    accessorKey: "code",
    header: "Coupon Code",
  },
  {
    header: "Discount",
    cell: ({ row }) => {
      const data = row.original;

      const currency = data.user.siteSettings[0].currency;
      const symbol = getSymbolFromCurrency(currency);

      let content;
      if (data.discountType === "percentage") {
        content = `${formatNumber(data.discount)}%`;
      } else {
        content = `${symbol + formatNumber(data.discount)}`;
      }

      return <span className="block">{content}</span>;
    },
  },
  {
    header: "Start Date",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <Badge
          variant="outline"
          className="font-medium bg-green-500 border-green-500 text-white"
        >
          {formatDate(new Date(data.startDate)).split(", ")[0]}
        </Badge>
      );
    },
  },
  {
    header: "End Date",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <Badge
          variant="outline"
          className="font-medium bg-orange-500 border-orange-500 text-white"
        >
          {formatDate(new Date(data.endDate)).split(", ")[0]}
        </Badge>
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

      return <Action id={data.id} couponId={data.couponId} />;
    },
  },
];
