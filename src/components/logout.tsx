"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

export default function Logout({ children, className }: any) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Call backend logout
      await axios.get(
        "http://localhost/managerbp/public/seller/auth/logout.php",
        { withCredentials: true }
      );

      // 2. Remove cookie on client side also
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // 3. Refresh server-side state so currentUser() re-runs
      router.refresh();

      // 4. Redirect instantly
      router.replace("/login");

    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children}
    </button>
  );
}
