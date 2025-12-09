"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Edit, More, Trash } from "iconsax-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteEvent } from "@/lib/api/events";
import { useRouter } from "next/navigation";

function Action({ id }: { id: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await deleteEvent(id);
      toast.success(res.message);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <More />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuGroup>
          <Link href={`/event/${id}`}>
            <DropdownMenuItem className="text-blue-600">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<Event>[] = [
  {
    header: "Title",
    accessorKey: "title",
  },

  {
    header: "Date",
    cell: ({ row }) => {
      const d = row.original.date;
      return d ? new Date(d).toLocaleDateString("en-GB") : "-";
    },
  },

  {
    header: "Location",
    accessorKey: "location",
  },

  {
    header: "Organizer",
    accessorKey: "organizer",
  },

  {
    header: "Status",
    accessorKey: "status",
  },

  {
    header: "Action",
    cell: ({ row }) => <Action id={row.original.id} />,
  },
];
