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
import { getOverview, getRevenue } from "@/lib/api/analytics";
import CopyLink from "@/components/cards/copy-link";
import LinkCard from "@/components/cards/link-card";
import { siteUrl, uploadsUrl } from "@/config";
import Image from "next/image";
import { currentUser } from "@/lib/api/users";

export default async function DashboardHome() {
  const user = await currentUser();

  const revenueData = await getRevenue("7");
  const overviewData = await getOverview();

  const overviewStats = [
    { value: abbreviateNumber(overviewData.totalRevenue), label: "Total Revenue", icon: <DollarCircle /> },
    { value: abbreviateNumber(overviewData.totalAppointments), label: "Appointments", icon: <CalendarTick /> },
    { value: abbreviateNumber(overviewData.totalCustomers), label: "Total Customers", icon: <Profile2User /> },
    { value: abbreviateNumber(overviewData.totalServices), label: "Total Services", icon: <TaskSquare /> },
    { value: abbreviateNumber(overviewData.totalEmployees), label: "Total Employees", icon: <Profile2User /> },
  ];

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-bold">Overview</h1>

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-5">
        {overviewStats.map((item, i) => (
          <Stats key={i} {...item} />
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-5">
        <div className="xl:w-[70%]">
          <RevenueGraph chartData={revenueData} />
        </div>

        <div className="xl:w-[30%] space-y-3">
          <CopyLink text="Site Link" link={`${siteUrl}/${user?.siteSlug}`} />

          <LinkCard title={`${overviewData.newAppointments} New Appointments`} icon={<Calendar />} link="/appointments" />
          <LinkCard title="Explore Reports" icon={<Chart />} link="/reports" />
          <LinkCard
            title="Start your online store"
            icon={<Image src={`${uploadsUrl}/static/ztorespot.png`} alt="" width={40} height={40} />}
            link="https://ztorespot.com"
            className="!bg-purple-500 text-white"
          />
        </div>
      </div>
    </div>
  );
}
