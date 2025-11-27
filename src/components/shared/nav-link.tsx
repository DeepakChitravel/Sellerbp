"use client";
import { NavLinkProps } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

interface Props {
  item: NavLinkProps;
  badgeTxt?: string;
}

const NavLink = ({ item, badgeTxt }: Props) => {
  const pathname = usePathname();

  return (
    <Link
      href={item.href}
      className={`flex items-center justify-between transition rounded-md 2xl:py-2.5 2xl:px-3 w-11 h-11 2xl:w-auto 2xl:h-auto font-medium shadow ${
        item.href === pathname
          ? "bg-primary text-white"
          : "text-white/80 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center justify-center 2xl:justify-normal gap-3.5 w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="2xl:text-2xl text-4xl">
                {React.cloneElement(item.icon, {
                  variant: item.href === pathname ? `Bold` : "",
                })}
              </span>
            </TooltipTrigger>
            <TooltipContent className="2xl:hidden">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <span className="2xl:block hidden">{item.label}</span>
      </div>

      {badgeTxt && (
        <span className="bg-red-500 text-white w-5 h-5 text-sm rounded 2xl:flex hidden items-center justify-center">
          {badgeTxt}
        </span>
      )}
    </Link>
  );
};

export default NavLink;
