"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Edit, More, Trash } from "iconsax-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteEvent } from "@/lib/api/events";
import { useRouter } from "next/navigation";

/* ===============================
   ACTION MENU
================================ */
function Action({ id }: { id: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    const res = await deleteEvent(id);

    if (res?.success) {
      toast.success(res.message || "Deleted");
      router.refresh();
    } else {
      toast.error(res.message || "Delete failed");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <More />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuGroup>
          <Link href={`/event/${id}`}>
            <DropdownMenuItem className="text-blue-600">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ===============================
   TABLE COLUMNS
================================ */
export const columns: ColumnDef<Event>[] = [
  /* 🔢 INDEX COLUMN (1,2,3) */
  {
    header: "#",
    cell: ({ row }) => row.index + 1,
  },

  /* 📌 TITLE */
  {
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium text-sm truncate max-w-[220px]" title={row.original.title}>
        {row.original.title}
      </span>
    ),
  },

  /* 📅 DATE (17 Dec 2025 FORMAT) */
  {
    header: "Date",
    cell: ({ row }) => {
      const d = row.original.date;
      if (!d) return "-";

      return new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },

  /* 📍 LOCATION */
  {
    header: "Location",
    cell: ({ row }) => (
      <span className="text-sm text-black/70 truncate max-w-[200px]">
        {row.original.location || "-"}
      </span>
    ),
  },

  /* 👤 ORGANIZER */
  {
    header: "Organizer",
    cell: ({ row }) => (
      <span className="text-sm text-black/70 truncate max-w-[180px]">
        {row.original.organizer || "-"}
      </span>
    ),
  },

  /* ⚡ STATUS */
  {
    header: "Status",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.status || "-"}
      </span>
    ),
  },

  /* ⋮ ACTION */
  {
    header: "Action",
    cell: ({ row }) => <Action id={row.original.id} />,
  },
];
