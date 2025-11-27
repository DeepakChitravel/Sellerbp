"use client";
import { Link1 } from "iconsax-react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components//ui/button";

const CopyLink = ({ text, link }: { text: string; link: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="bg-white rounded-xl p-5 flex items-end justify-between sm:flex-row flex-col sm:gap-5 gap-3">
      <div className="flex flex-col sm:flex-row items-center sm:gap-4">
        <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-xl">
          <Link1 size={24} />
        </div>

        <div>
          <span className="block mb-0.5 text-xs text-black/70">{text}</span>
          <Link
            href={link}
            target="_blank"
            className="text-base font-medium text-primary underline flex items-center gap-2"
          >
            {link} <ExternalLink width={16} height={16} />
          </Link>
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              type="button"
              onClick={handleCopy}
              className="sm:w-auto w-full"
            >
              Copy
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to copy</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CopyLink;
