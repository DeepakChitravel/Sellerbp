import { redirect } from "next/navigation";
import { currentUser } from "@/lib/api/users";
import MenuItemsTable from "@/components/forms/menu-settings/menu-items/menu-items-table";

export default async function MenuItemsPage() {
  const user = await currentUser();

  if (!user) redirect("/login");

  // HOTEL only
  if (user.service_type_id !== 2) {
    redirect("/dashboard");
  }

  return <MenuItemsTable />;
}
