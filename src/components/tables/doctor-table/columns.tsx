"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DoctorSchedule } from "@/types";
import { formatNumber } from "@/lib/utils";
import { useState } from "react"; // ✅ FIX HERE

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

import { deleteDoctorSchedule } from "@/lib/api/doctor_schedule";

/* --------------------------------
   Helpers
--------------------------------- */

const getSrc = (path?: string | null) => {
  if (!path) return "/placeholder-image.jpg";

  // already full URL
  if (path.startsWith("http")) return path;

  // ✅ CORRECT base path
  return `http://localhost/managerbp/public/uploads/${path}`;
};



const formatPrettyDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* --------------------------------
   Action Menu
--------------------------------- */

function Action({ serviceId }: { serviceId: string }) {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false); // ✅ FIXED
  const [menuOpen, setMenuOpen] = useState(false);     // ✅ FIXED

  const handleDelete = async () => {
    try {
      const res = await deleteDoctorSchedule(serviceId);
      toast.success(res.message || "Deleted successfully");

      setDialogOpen(false);
      setMenuOpen(false);

      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    }
  };

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <More />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuGroup>
<Link href={`/hos-opts/${serviceId}`}>
            <DropdownMenuItem className="text-blue-600">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </Link>

          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-red-600"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete doctor?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
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

export const columns: ColumnDef<DoctorSchedule>[] = [
  {
    header: "#",
    cell: ({ row }) => row.index + 1,
  },

{
  header: "Doctor",
  cell: ({ row }) => {
    const d = row.original;

    return (
      <div className="flex items-center gap-3">
        <img
          src={getSrc(d.image)}
          alt={d.name || "Doctor"}
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "/placeholder-image.jpg";
          }}
        />

        <div>
          <p className="font-semibold text-gray-900">
            {d.name || "Unnamed Doctor"}
          </p>
        </div>
      </div>
    );
  },
},


  {
    header: "Specialization",
    cell: ({ row }) => row.original.specialization || "—",
  },

  {
    header: "Qualification",
    cell: ({ row }) => row.original.qualification || "—",
  },

  {
    header: "Fees",
    cell: ({ row }) => (
      <span className="font-medium">
        ₹{formatNumber(Number(row.original.amount || 0))}
      </span>
    ),
  },

  {
    header: "Created At",
    cell: ({ row }) =>
      formatPrettyDate(row.original.createdAt),
  },

  {
    header: "Action",
    cell: ({ row }) => (
      <Action serviceId={row.original.serviceId} />
    ),
  },
];
