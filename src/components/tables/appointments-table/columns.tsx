"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { uploadsUrl } from "@/config";
import { formatDate, formatNumber, getInitials } from "@/lib/utils";
import { Appointment } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import getSymbolFromCurrency from "currency-symbol-map";
import Link from "next/link";
import { formatPhoneNumber } from "react-phone-number-input";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "Appointment ID",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <Link
          href={`/appointments/${data.appointmentId}`}
          className="font-medium text-primary"
        >
          #{data.appointmentId}
        </Link>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date/Time",
    cell: ({ row }) => {
      const data = row.original;
      return formatDate(new Date(data.date)).split(",")[0] + " | " + data.time;
    },
  },
  {
    header: "Customer",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              className="object-cover"
              src={uploadsUrl + "/" + data?.customer?.photo}
            />
            <AvatarFallback>{getInitials(data.name)}</AvatarFallback>
          </Avatar>

          <div>
            <span className="block font-medium text-sm">{data.name}</span>
            <span className="text-xs text-black/50">
              {formatPhoneNumber(data.phone)}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: "Assigned to",
    cell: ({ row }) => {
      const data = row.original;
      return data.employee ? (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              className="object-cover"
              src={uploadsUrl + "/" + data.employee.image}
            />
            <AvatarFallback>{getInitials(data.employee.name)}</AvatarFallback>
          </Avatar>

          <div>
            <span className="block font-medium text-sm">
              {data.employee.name}
            </span>
            <span className="text-xs text-black/50">
              {formatPhoneNumber(data.employee.phone)}
            </span>
          </div>
        </div>
      ) : (
        "NULL"
      );
    },
  },
  {
    header: "Payment Status",
    cell: ({ row }) => {
      const data = row.original;
      let className: { [key: string]: string } = {
        bg: "",
        border: "",
        text: "text-primary",
      };

      switch (data.paymentStatus) {
        case "Paid":
          className = {
            bg: "bg-green-50",
            border: "border-green-500",
            text: "text-green-500",
          };
          break;
        case "Unpaid":
          className = {
            bg: "bg-red-50",
            border: "border-red-500",
            text: "text-red-500",
          };
          break;
      }

      return (
        <Badge
          variant="outline"
          className={`font-medium ${className.bg} ${className.border} ${className.text}`}
        >
          {data.paymentStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const data = row.original;
      let className: { [key: string]: string } = {
        bg: "",
        border: "",
        text: "text-primary",
      };

      switch (data.status) {
        case "Booked":
          className = {
            bg: "bg-orange-50",
            border: "border-orange-500",
            text: "text-orange-500",
          };
          break;
        case "Processing":
          className = {
            bg: "bg-yellow-50",
            border: "border-yellow-500",
            text: "text-yellow-500",
          };
          break;
        case "Completed":
          className = {
            bg: "bg-green-50",
            border: "border-green-500",
            text: "text-green-500",
          };
          break;
        case "Cancelled":
          className = {
            bg: "bg-red-50",
            border: "border-red-500",
            text: "text-red-500",
          };
          break;
      }

      return (
        <Badge
          variant="outline"
          className={`font-medium ${className.bg} ${className.border} ${className.text}`}
        >
          {data.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Total Amount",
    cell: ({ row }) => {
      const data = row.original;
      const currency = data.user.siteSettings[0].currency;
      const symbol = getSymbolFromCurrency(currency);

      return symbol + formatNumber(parseInt(data.amount));
    },
  },
  {
    accessorKey: "booked_at",
    header: "Booked At",
    cell: ({ row }) => {
      const data = row.original;
      return formatDate(new Date(data.createdAt));
    },
  },
];
