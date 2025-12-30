export const dynamic = "force-dynamic";

import LeftSidebar from "@/components/shared/left-sidebar";
import TopBar from "@/components/shared/topbar";
import { currentUser } from "@/lib/api/users";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) redirect("/login");

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-[70px] 2xl:w-[270px]">
        <LeftSidebar />
      </aside>

      {/* MAIN CONTENT */}
      <div
  className="
    ml-[70px] 2xl:ml-[270px]
    w-[calc(100vw-70px)]
    2xl:w-[calc(100vw-270px)]
    min-h-screen
    bg-[#f8f8f9]
    overflow-x-hidden
  "
>
  <TopBar />

  <main className="2xl:px-8 px-5 py-8 max-w-full overflow-x-hidden">
    {children}
  </main>
</div>

    </div>
  );
}
