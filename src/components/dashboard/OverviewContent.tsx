import {
  DollarCircle,
  CalendarTick,
  TaskSquare,
  Profile2User,
  Calendar,
  Chart,
} from "iconsax-react";
import { abbreviateNumber } from "@/lib/utils";
import Stats from "@/components/cards/stats";
import RevenueGraph from "@/components/charts/revenue-graph";
import CopyLink from "@/components/cards/copy-link";
import LinkCard from "@/components/cards/link-card";
import Image from "next/image";
import { siteUrl, uploadsUrl } from "@/config";

interface Props {
  user: any;
  overviewData: any;
  revenueData: any;
}

export default function OverviewContent({
  user,
  overviewData,
  revenueData,
}: Props) {
  const overviewStats = [
    {
      value: abbreviateNumber(overviewData.totalRevenue),
      label: "Total Revenue",
      color: "red",
      icon: <DollarCircle />,
    },
    {
      value: abbreviateNumber(overviewData.totalAppointments),
      label: "Appointments",
      color: "green",
      icon: <CalendarTick />,
    },
    {
      value: abbreviateNumber(overviewData.totalCustomers),
      label: "Total Customers",
      color: "orange",
      icon: <Profile2User />,
    },
    {
      value: abbreviateNumber(overviewData.totalServices),
      label: "Total Services",
      color: "yellow",
      icon: <TaskSquare />,
    },
    {
      value: abbreviateNumber(overviewData.totalEmployees),
      label: "Total Employees",
      color: "blue",
      icon: <Profile2User />,
    },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold mb-5">Overview</h1>

        <div className="grid 4xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-5">
          {overviewStats.map((item, index) => (
            <Stats key={index} {...item} />
          ))}
        </div>
      </div>

      <div className="flex flex-col 4xl:flex-row gap-5">
        <div className="4xl:w-[70%]">
          <RevenueGraph chartData={revenueData} />
        </div>

        <div className="4xl:w-[30%]">
          <div className="grid gap-3" style={{ wordBreak: "break-all" }}>
            <CopyLink text="Site Link" link={`${siteUrl}/${user.siteSlug}`} />

            <LinkCard
              title={`${overviewData.newAppointments} New Appointments Received!`}
              icon={<Calendar />}
              link="/appointments"
            />

            <LinkCard
              title="Explore Advanced Reports!"
              icon={<Chart />}
              link="/reports"
            />

            <LinkCard
              title="Start your online store at ztorespot.com"
              icon={
                <Image
                  src={uploadsUrl + "/static/ztorespot.png"}
                  alt=""
                  width={50}
                  height={50}
                />
              }
              link="https://ztorespot.com"
              className="!bg-purple-500 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
