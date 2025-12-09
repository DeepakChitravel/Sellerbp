"use client";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const EventsFilterOptions = ({ categories }: { categories: string[] }) => {
  // Remove empty, null, undefined values
  const cleanCategories = categories.filter((c) => c && c.trim() !== "");

  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Category" />
      </SelectTrigger>

      <SelectContent>
        {/* Valid non-empty default option */}
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
