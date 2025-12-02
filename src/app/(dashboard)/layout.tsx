export const dynamic = "force-dynamic";

import LeftSidebar from "@/components/shared/left-sidebar";
import TopBar from "@/components/shared/topbar";
import { currentUser } from "@/lib/api/users";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <aside className="2xl:w-[270px] w-[70px] fixed left-0 top-0 h-full">
        <LeftSidebar />
      </aside>

      <div className="bg-[#f8f8f9] min-h-screen overflow-y-auto w-[calc(100%_-_70px)] 2xl:w-[calc(100%_-_270px)] ms-auto mainWrapper">
        <TopBar />
        <main className="2xl:px-8 px-5 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
