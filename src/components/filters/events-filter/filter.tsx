"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

const EventsFilterOptions = ({ categories }: { categories: string[] }) => {
  const cleanCategories = categories.filter(Boolean);

  return (
    <Select>
      <SelectTrigger className="rounded-full bg-muted border-0 px-5 gap-2 w-auto">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <SelectValue placeholder="Filter" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {cleanCategories.map((cat) => (
          <SelectItem key={cat} value={cat}>
            {cat}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default EventsFilterOptions;
