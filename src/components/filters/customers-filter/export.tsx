"use client";
import { exportToExcel } from "@/lib/utils";
import { Customer } from "@/types";
import { Export as ExportIcon } from "iconsax-react";

const Export = ({ data }: { data: Customer[] }) => {
  const updatedData = data?.map((person) => {
    const { id, user, userId, password, photo, countData, ...rest } = person;
    return {
      ...rest,
    };
  });

  const handleExport = () => {
    const date = new Date();
    exportToExcel(
      updatedData,
      `customers_${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`
    );
  };

  return (
    <button
      className="bg-primary text-white rounded-full h-12 px-5 flex items-center justify-center gap-2 w-full sm:w-auto transition hover:bg-primary/90"
      onClick={handleExport}
    >
      <ExportIcon />
      Export
    </button>
  );
};

export default Export;
