import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Notification } from "iconsax-react";
import { User, Card, Logout as LogoutIcon, More, Setting } from "iconsax-react";
import Logout from "../logout";
import { MY_ACCOUNT_DROPDOWN_OPTIONS } from "@/constants";
import React from "react";
import Link from "next/link";

const TopBar = () => {
  return (
    <div className="bg-white py-3 px-8 flex items-center justify-end gap-6">
      <ul>
        <li>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="w-11 h-11 bg-red-50 text-red-500 rounded-full flex items-center justify-center relative">
                  <Notification size="24" variant="Bulk" />

                  <div className="absolute top-0 right-0">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
      </ul>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-11 h-11 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center outline-none">
            <More variant="Bold" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {MY_ACCOUNT_DROPDOWN_OPTIONS.map((item) => (
              <Link key={item.href} href={item.href}>
                <DropdownMenuItem>
                  {React.cloneElement(item.icon, {
                    size: 16,
                    className: "mr-2",
                    variant: "Bold",
                  })}
                  <span>{item.label}</span>
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
 <DropdownMenuItem>
  <Logout className="flex items-center">
    <LogoutIcon size="16" className="mr-2" variant="Bold" />
    <span>Log out</span>
  </Logout>
</DropdownMenuItem>


        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TopBar;
