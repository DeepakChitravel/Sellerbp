"use client";
import { useState, useEffect, useRef } from "react";
import { Whatsapp } from "iconsax-react";
import { Globe, Mail, MapPin, PhoneCall, User, QrCode, Download, Copy, Building } from "lucide-react";
import ReactQRCode from "react-qr-code";
import { getQRPreviewData } from "@/lib/api/qr-preview";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";

const QRCode = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [qrData, setQrData] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    siteSlug: ""
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // Load QR data
  useEffect(() => {
    loadQRData();
  }, []);

  const loadQRData = async () => {
    setIsLoading(true);
    try {
      const response = await getQRPreviewData();
      
      if (response?.success && response.data) {
        setQrData(response.data);
      }
    } catch (error) {
      console.error("Failed to load QR data:", error);
      toast.error("Failed to load QR code data");
    }
    setIsLoading(false);
  };

  const qrValue = `https://mysaas.com/${qrData.siteSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrValue)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const handleDownloadVisitingCard = async () => {
    if (!cardRef.current) return;

    try {
      // Show loading
      toast.loading("Generating visiting card...");

      // Add download styles
      const originalStyles = {
        width: cardRef.current.style.width,
        height: cardRef.current.style.height,
        transform: cardRef.current.style.transform,
        boxShadow: cardRef.current.style.boxShadow,
      };

      // Set card to exact visiting card dimensions (3.5 x 2 inches)
      cardRef.current.style.width = "840px"; // 3.5 inches at 240 DPI
      cardRef.current.style.height = "480px"; // 2 inches at 240 DPI
      cardRef.current.style.transform = "scale(1)";
      cardRef.current.style.boxShadow = "none";

      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      // Reset styles
      cardRef.current.style.width = originalStyles.width;
      cardRef.current.style.height = originalStyles.height;
      cardRef.current.style.transform = originalStyles.transform;
      cardRef.current.style.boxShadow = originalStyles.boxShadow;

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `visiting-card-${qrData.siteSlug || "business"}.png`;
      link.href = image;
      link.click();

      toast.dismiss();
      toast.success("Visiting card downloaded!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to generate visiting card");
      console.error("Download error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Building className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-lg text-gray-800">Digital Visiting Card</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Download your professional visiting card with QR code
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 shadow-lg">
            {/* Visiting Card Preview */}
            <div 
              ref={cardRef}
              className="bg-white rounded-xl shadow-2xl p-6 mx-auto transform scale-90 origin-center visiting-card"
              style={{
                width: '350px',
                height: '200px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0'
              }}
            >
              <div className="flex flex-col h-full">
                {/* Top Section - Name & Title (Centered) */}
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {qrData.name || "Your Name"}
                  </h2>
                  <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mt-1">
                    CEO & FOUNDER
                  </p>
                </div>

                <div className="flex flex-1 gap-6">
                  {/* Left Side - Contact Info */}
                  <div className="flex-1 flex flex-col justify-center space-y-2">
                    {/* Phone */}
                    {qrData.phone && (
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                        <span className="text-sm text-gray-800 font-medium">{qrData.phone}</span>
                      </div>
                    )}

                    {/* Email - Fixed to prevent truncation */}
                    {qrData.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                        <span className="text-sm text-gray-800 font-medium break-all">{qrData.email}</span>
                      </div>
                    )}

                    {/* Address - Added from your data */}
                    {qrData.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-800 font-medium">{qrData.address}</span>
                      </div>
                    )}

                    {/* Website */}
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                      <span className="text-sm text-blue-600 font-semibold">
                        mysaas.com/{qrData.siteSlug}
                      </span>
                    </div>
                  </div>

                  {/* Right Side - QR Code */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-2">
                      <div className="p-2 bg-white rounded border border-gray-200">
                        <ReactQRCode
                          value={qrValue}
                          size={70}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="H"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scan to Connect - Fixed position at bottom center */}
                <div className="text-center mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 font-medium">
                    Scan to Connect
                  </p>
                </div>
              </div>
            </div>

            {/* Card Preview Label */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-300">Visiting Card Preview</p>
              <p className="text-xs text-gray-400">Standard size: 3.5" × 2"</p>
            </div>
          </div>

          {/* Download Options */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Download className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-blue-800">Download Options</h4>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={handleDownloadVisitingCard}
                className="w-full bg-blue-600 hover:bg-blue-700 h-10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Visiting Card (PNG)
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="flex-1 border-blue-200 hover:bg-blue-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const svg = document.querySelector(".visiting-card .react-qr-code") as SVGSVGElement;
                    if (svg) {
                      const svgData = new XMLSerializer().serializeToString(svg);
                      const link = document.createElement("a");
                      link.download = `qr-${qrData.siteSlug}.svg`;
                      link.href = "data:image/svg+xml;base64," + btoa(svgData);
                      link.click();
                      toast.success("QR Code downloaded as SVG");
                    }
                  }}
                  className="flex-1 border-gray-200 hover:bg-gray-50"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Only
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg">
          <div className="mb-8">
            <div className="text-center mb-6">
              <h4 className="text-white text-2xl font-bold mb-2">
                {qrData.name || "Your Name"}
              </h4>
              <div className="bg-blue-600 text-white px-4 py-1 rounded-full inline-block">
                <span className="text-sm font-semibold">CEO & FOUNDER</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Phone */}
            {qrData.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PhoneCall size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs font-medium">Phone</p>
                  <p className="text-white font-medium">{qrData.phone}</p>
                </div>
              </div>
            )}

            {/* WhatsApp */}
            {qrData.whatsapp && (
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                <div className="bg-green-600 text-white w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Whatsapp size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs font-medium">WhatsApp</p>
                  <p className="text-white font-medium">{qrData.whatsapp}</p>
                </div>
              </div>
            )}

            {/* Email */}
            {qrData.email && (
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                <div className="bg-red-600 text-white w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs font-medium">Email</p>
                  <p className="text-white font-medium break-all">{qrData.email}</p>
                </div>
              </div>
            )}

            {/* Website */}
            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
              <div className="bg-purple-600 text-white w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe size={20} />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs font-medium">Website</p>
                <p className="text-white font-medium">mysaas.com/{qrData.siteSlug}</p>
              </div>
            </div>

            {/* Address */}
            {qrData.address && (
              <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                <div className="bg-orange-600 text-white w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs font-medium">Address</p>
                  <p className="text-white font-medium">{qrData.address}</p>
                </div>
              </div>
            )}

            {/* Scan to Connect */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex flex-col items-center justify-center">
                <div className="p-3 bg-white rounded-lg mb-2">
                  <ReactQRCode
                    value={qrValue}
                    size={80}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                  />
                </div>
                <p className="text-gray-300 text-sm font-medium">Scan to Connect</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Information */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded">
              <Building className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Card Size</p>
              <p className="text-xs text-blue-600">3.5" × 2" (Standard)</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded">
              <QrCode className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">QR Code</p>
              <p className="text-xs text-green-600">High-quality scan</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded">
              <Download className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-800">Format</p>
              <p className="text-xs text-purple-600">PNG (Print ready)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Printing Instructions */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">Printing Instructions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="font-medium mb-1">For Professional Printing:</p>
            <ul className="space-y-1">
              <li>• Use matte or gloss card stock</li>
              <li>• Ensure bleed area is printed</li>
              <li>• Cut along crop marks</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">For Home Printing:</p>
            <ul className="space-y-1">
              <li>• Use high-quality photo paper</li>
              <li>• Select "borderless" printing</li>
              <li>• Set print quality to "best"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCode;