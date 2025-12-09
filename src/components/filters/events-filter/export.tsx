"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const EventsExport = ({ data }: { data: any[] }) => {

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Category,Date,Location"]
        .concat(
          data.map((e) =>
            [e.name, e.category, e.date, e.location].join(",")
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "events_export.csv";
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Button onClick={handleExport} variant="outline">
      <Download className="w-4 h-4 mr-2" />
      Export
    </Button>
  );
};

export default EventsExport;
