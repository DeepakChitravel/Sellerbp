"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { NavLinkProps } from "@/types";

interface Props {
  item: NavLinkProps;
}

const NavLink = ({ item }: Props) => {
  const pathname = usePathname();
  const hasChildren = Boolean(item.children);
  const isParentActive = pathname.startsWith(item.href || "");

  const [open, setOpen] = useState(false);

  // auto-open if child is active
  useEffect(() => {
    if (hasChildren) {
      const activeChild = item.children?.some((c) =>
        pathname.startsWith(c.href)
      );
      setOpen(Boolean(activeChild));
    }
  }, [pathname, hasChildren, item.children]);

  /* ===============================
     🔹 PARENT ITEM
  =============================== */
  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`
            w-full flex items-center justify-between px-3 py-2.5 rounded-lg
            transition-all duration-200
            ${
              open || isParentActive
                ? "bg-purple-600 text-white shadow-sm"
                : "text-white/80 hover:bg-white/10"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </div>

          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* ===============================
            🔹 SUB MENU
        =============================== */}
        <div
          className={`
            overflow-hidden transition-all duration-300
            ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="mt-2 ml-5 pl-4 space-y-1 border-l border-white/15">
            {item.children?.map((child) => {
              const active = pathname === child.href;

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`
                    group flex items-center gap-3 px-2 py-2 rounded-md
                    text-sm transition-all
                    ${
                      active
                        ? "text-purple-400 font-medium bg-white/5"
                        : "text-white/65 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {/* Active indicator */}
                  <span
                    className={`
                      h-1.5 w-1.5 rounded-full transition
                      ${active ? "bg-purple-400" : "bg-white/30"}
                    `}
                  />

                  <span>{child.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ===============================
     🔹 NORMAL LINK
  =============================== */
  return (
    <Link
      href={item.href!}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
        transition-all
        ${
          pathname === item.href
            ? "bg-purple-600 text-white shadow-sm"
            : "text-white/80 hover:bg-white/10"
        }
      `}
    >
      <span className="text-xl">{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );
};

export default NavLink;
