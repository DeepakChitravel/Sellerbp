import Home from "../(dashboard)/page";
import { currentUser } from "@/lib/api/users";
import { redirect } from "next/navigation";

export default async function SlugPage({ params }) {
  const user = await currentUser();

  // Not logged in → login page
  if (!user) redirect("/login");

  // FIX: never redirect to /dashboard — only slug!
  if (!user.siteSlug) redirect("/login");

  // If slug mismatch → correct it
  if (params.slug !== user.siteSlug) {
    redirect(`/${user.siteSlug}`);
  }

  return <Home />;
}
