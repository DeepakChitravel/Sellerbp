"use client";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Whatsapp } from "iconsax-react";
import { Globe, Mail, MapPin, PhoneCall } from "lucide-react";
import ReactQRCode from "react-qr-code";

const QRCode = () => {
  const { userData } = useCurrentUser();

  return (
    <div className="bg-primary rounded-lg p-5">
      <div className="grid grid-cols-2 w-[740px] min-h-[320px]">
        <div className="bg-[#303642] rounded-l-lg h-full py-7 px-8 flex justify-center flex-col border-r-4 border-r-primary">
          <div className="mb-10">
            <h4 className="text-white text-3xl font-medium">
              {userData?.name}
            </h4>
            <span className="block mt-2 text-white/80">CEO & Founder</span>
          </div>

          <ul className="grid gap-4">
            <li className="text-white flex items-center gap-3">
              <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
                <PhoneCall size={20} />
              </div>
              <div className="w-[calc(100%_-_52px)] text-[15px]">
                {userData?.siteSettings[0].phone}
              </div>
            </li>

            {userData?.siteSettings[0].whatsapp && (
              <li className="text-white flex items-center gap-3">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
                  <Whatsapp size={20} />
                </div>
                <div className="w-[calc(100%_-_52px)] text-[15px]">
                  {userData?.siteSettings[0].whatsapp}
                </div>
              </li>
            )}

            {userData?.siteSettings[0].email && (
              <li className="text-white flex items-center gap-3">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <div className="w-[calc(100%_-_52px)] text-[15px]">
                  {userData?.siteSettings[0].email}
                </div>
              </li>
            )}

            <li className="text-white flex items-center gap-3">
              <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
                <Globe size={20} />
              </div>
              <div className="w-[calc(100%_-_52px)] text-[15px]">
                www.mysaas.com/{userData?.siteSlug}
              </div>
            </li>

            {userData?.siteSettings[0].address && (
              <li className="text-white flex gap-3">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div className="w-[calc(100%_-_52px)] text-[15px]">
                  {userData?.siteSettings[0].address}
                </div>
              </li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-r-lg h-full py-7 px-8 flex justify-center items-center flex-col">
          <ReactQRCode
            value={`www.mysaas.com/${userData?.siteSlug}`}
            size={230}
          />
        </div>
      </div>
    </div>
  );
};

export default QRCode;
