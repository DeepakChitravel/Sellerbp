import { redirect } from "next/navigation";
import { currentUser } from "@/lib/api/users";

export default async function HotOptsPage() {
  const user = await currentUser();

  if (!user) redirect("/login");

  if (user.service_type_id !== 2) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1>Hotel Options</h1>
    </div>
  );
}
