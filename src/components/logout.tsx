"use client";

import axios from "axios";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Logout = ({ children, className }: Props) => {
  const handleLogout = async () => {
    try {
      await axios.get(
        "http://localhost/managerbp/public/seller/auth/logout.php",
        { withCredentials: true }
      );

      // Force full reload so Next.js re-checks cookies
      window.location.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div onClick={handleLogout} className={className}>
      {children}
    </div>
  );
};

export default Logout;
