"use client";
import { deleteCookie } from "cookies-next";

interface Props {
  children: React.ReactNode;
  className: string;
}

const Logout = ({ children, className }: Props) => {
  const handleLogout = () => {
    deleteCookie("token");
    window.location.href = "/";
  };

  return (
    <button type="button" onClick={handleLogout} className={className}>
      {children}
    </button>
  );
};

export default Logout;
