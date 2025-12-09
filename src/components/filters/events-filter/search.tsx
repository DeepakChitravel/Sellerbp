"use client";

import { Input } from "@/components/ui/input";
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
    <Input
      placeholder="Search events..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full sm:w-56"
    />
  );
}
