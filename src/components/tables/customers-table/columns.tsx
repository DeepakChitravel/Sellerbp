"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  abbreviateNumber,
  formatDate,
  formatNumber,
  getInitials,
} from "@/lib/utils";
import {
  formatPhoneNumber,
  formatPhoneNumberIntl,
} from "react-phone-number-input";
import { Customer } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import getSymbolFromCurrency from "currency-symbol-map";
import { uploadsUrl } from "@/config";
import Link from "next/link";

export const columns: ColumnDef<Customer>[] = [
  {
    header: "Customer",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <Link
          href={`/customers/${data.customerId}`}
          className="flex items-center gap-3"
        >
          <Avatar>
            <AvatarImage src={uploadsUrl + "/" + data.photo} />
            <AvatarFallback>{getInitials(data.name)}</AvatarFallback>
          </Avatar>

          <div>
            <span className="block font-medium text-sm text-primary">
              {data.name}
            </span>
            <span className="text-xs text-black/50">
              {formatPhoneNumber(data.phone)}
            </span>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "customerId",
    header: "Customer ID",
  },
  {
    header: "Mobile Number",
    cell: ({ row }) => {
      const data = row.original;
      return formatPhoneNumberIntl(data.phone);
    },
  },
  {
    accessorKey: "email",
    header: "Email Address",
  },
  {
    header: "Total Appointments",
    cell: ({ row }) => {
      const data = row.original;
      return abbreviateNumber(data.countData.appointments);
    },
  },
  {
    header: "Total Spent",
    cell: ({ row }) => {
      const data = row.original;
      return (
        getSymbolFromCurrency(data.user.siteSettings[0].currency) +
        formatNumber(data.countData.totalSpent)
      );
    },
  },
  {
    header: "Account Creation Date",
    cell: ({ row }) => {
      const data = row.original;
      return formatDate(new Date(data.createdAt));
    },
  },
];
