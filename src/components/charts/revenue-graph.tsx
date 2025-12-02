// "use client";
// import Chart from "react-apexcharts";

// const RevenueGraph = () => {
//   const options = {
//     chart: {
//       height: "100%",
//       maxWidth: "100%",
//       type: "area",
//       fontFamily: "Inter, sans-serif",
//       dropShadow: {
//         enabled: false,
//       },
//       toolbar: {
//         show: false,
//       },
//     },
//     tooltip: {
//       enabled: true,
//       x: {
//         show: false,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       width: 6,
//       curve: "smooth",
//     },
//     grid: {
//       show: true,
//       strokeDashArray: 4,
//       padding: {
//         left: 2,
//         right: 2,
//         top: -26,
//       },
//     },
//     series: [
//       {
//         name: "Revenue",
//         color: "#ef4444",
//         data: ["1420", "1620", "1820", "1420"],
//       },
//       {
//         name: "Appointments",
//         color: "#22c55e",
//         data: ["400", "800", "1400", "2300"],
//       },
//     ],
//     legend: {
//       show: false,
//     },
//     xaxis: {
//       categories: ["Today", "This Week", "This Month", "This Year"],
//       labels: {
//         show: true,
//         style: {
//           fontFamily: "Inter, sans-serif",
//           cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
//         },
//       },
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//     },
//     yaxis: {
//       show: false,
//     },
//   };

//   return (
//     <div className="bg-white rounded-xl py-8 px-12">
//       <Chart
//         options={options as any}
//         series={options.series as any}
//         type="area"
//         height={400}
//       />
//     </div>
//   );
// };

// export default RevenueGraph;

"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RevenueGraph as RevenueGraphProps } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const description = "An interactive area chart";

const chartConfig = {
  appointments: {
    label: "Appointments",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function RevenueGraph({
  chartData,
}: {
  chartData: RevenueGraphProps[];
}) {
  const pathname = usePathname();


  const [timeRange, setTimeRange] = React.useState("90");

const safeData = Array.isArray(chartData) ? chartData : [];

const filteredData = safeData.filter((item) => {
  return item;
});



  return (
    <Card className="shadow-none border-none rounded-xl">
      <CardHeader className="flex items-center gap-2 space-y-0 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Revenue Graph</CardTitle>
          <CardDescription>
            Showing total revenue for the last {timeRange} days
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="appointments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-appointments)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-appointments)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillrevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillrevenue)"
              stroke="var(--color-revenue)"
              stackId="a"
            />
            <Area
              dataKey="appointments"
              type="natural"
              fill="url(#appointments)"
              stroke="var(--color-appointments)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
