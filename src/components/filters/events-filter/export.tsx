"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const EventsExport = ({ data }: { data: any[] }) => {
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Category,Date,Location"]
        .concat(data.map((e) => [e.name, e.category, e.date, e.location].join(",")))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "events_export.csv";
    link.click();
  };

  return (
    <Button
      onClick={handleExport}
      className="rounded-full px-6 bg-indigo-500 hover:bg-indigo-600 text-white"
    >
      <Upload className="w-4 h-4 mr-2" />
      Export
    </Button>
  );
};

export default EventsExport;
