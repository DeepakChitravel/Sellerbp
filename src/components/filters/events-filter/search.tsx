"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventsSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") || "");

  useEffect(() => {
    const t = setTimeout(() => {
      const query = new URLSearchParams(window.location.search);

      if (value) query.set("q", value);
      else query.delete("q");

      query.set("page", "1");
      router.push(`/event?${query.toString()}`);
    }, 400);

    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-11 rounded-full bg-muted border-0"
      />
    </div>
  );
}
