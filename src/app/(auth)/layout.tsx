import { currentUser } from "@/lib/api/users";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  (await currentUser()) && redirect("/");

  return children;
}
