import { currentUser } from "@/lib/api/users";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // If user exists → block access to /login and /register pages
  if (user) {
    redirect("/dashboard");
  }

  console.log("AUTH LAYOUT EXECUTED");

  return <>{children}</>;
}
