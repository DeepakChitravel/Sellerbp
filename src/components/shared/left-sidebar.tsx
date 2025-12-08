import { ExternalLink } from "lucide-react";
import { Award } from "iconsax-react";
import { SIDEBAR_LINKS } from "../../constants";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NavLink from "./nav-link";
import { currentUser } from "@/lib/api/users";
import { siteUrl, uploadsUrl } from "@/config";

const LeftSidebar = async () => {
  const user = await currentUser();

  return (
    <div className="bg-secondary text-white py-5 2xl:px-5 h-full flex justify-between flex-col items-center 2xl:items-stretch">
      <div>
        <div className="flex items-center justify-between gap-3 border-b border-white/10 mb-5 pb-5">
          {/* Logo */}
          <div className="flex items-center gap-3">
<Image
  src={
    user?.siteSettings?.logo_url 
      ? user.siteSettings.logo_url
      : uploadsUrl + "/static/logo.png"
  }
  alt="Site Logo"
  width={44}
  height={44}
  className="object-contain"
/>


            <span className="font-semibold text-white text-lg 2xl:block hidden">
              {user.siteName}
            </span>
          </div>

          <div className="2xl:flex hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href={siteUrl + "/" + user.siteSlug}
                    target="_blank"
                    className="bg-white/10 text-white/80 w-9 h-9 rounded-sm flex items-center justify-center"
                  >
                    <ExternalLink width={22} height={22} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visit Site</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <ul className="space-y-2">
          {SIDEBAR_LINKS.map((item, index: number) => (
            <li key={index}>
              <NavLink item={item} />
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

export default LeftSidebar;
