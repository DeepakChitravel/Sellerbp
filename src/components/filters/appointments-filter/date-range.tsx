"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "iconsax-react";
import { DateRange as DateRangeType } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DateRange = () => {
  const pathname = usePathname();
  const { replace } = useRouter();

  const [date, setDate] = React.useState<DateRangeType | undefined>();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  let limit = searchParams.get("limit");
  !limit && (limit = "10");

  let page = searchParams.get("page");
  !page || (parseInt(page.toString()) <= 1 && (page = "1"));

  const handleChangeDate = (dates: DateRangeType | undefined) => {
    setDate(dates);

    const fromDate = dates?.from?.toISOString().split("T")[0];
    const toDate = dates?.to?.toISOString().split("T")[0];

    fromDate && params.set("fromDate", fromDate?.toString() as string);
    toDate && params.set("toDate", toDate?.toString() as string);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <button
            id="date"
            className={cn(
              "bg-gray-100 rounded-full flex items-center gap-1 min-w-[300px] w-full h-12 px-5",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span className="text-black/50">Pick a date</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleChangeDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRange;
