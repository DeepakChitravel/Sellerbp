"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Download, Home, Mail, Printer } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface PaymentDetails {
  invoice: {
    invoice_number: string;
    date: string;
    due_date: string;
    status: string;
  };
  company: {
    name: string;
    address: string;
    gst_number?: string;
    logo?: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    pin_code: string;
    country: string;
    gst_number?: string;
  };
  plan: {
    name: string;
    duration: number;
    plan_id: number;
  };
  payment: {
    method: string;
    payment_id: string;
    currency: string;
    currency_symbol: string;
    amount: number;
    gst_amount: number;
    gst_type: string;
    gst_percentage: number;
    discount: number;
    total: number;
  };
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const invoiceNumber = searchParams.get("invoice");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (invoiceNumber) {
      fetchPaymentDetails(invoiceNumber);
    }
  }, [invoiceNumber]);

  const fetchPaymentDetails = async (invoice: string) => {
    try {
      const response = await fetch(
        `http://localhost/managerbp/public/seller/payment/get-payment-details.php?invoice=${invoice}`
      );
      const data = await response.json();
      
      if (data.success) {
        setPaymentDetails(data.data);
      } else {
        toast.error(data.message || "Failed to fetch payment details");
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      toast.error("Error fetching payment details");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!invoiceNumber) return;
    
    try {
      const response = await fetch(
        `http://localhost/managerbp/public/seller/payment/generate-invoice-pdf.php?invoice=${invoiceNumber}`
      );
      
      if (response.ok) {
        // Create blob and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success("Invoice downloaded successfully!");
      } else {
        toast.error("Failed to download invoice");
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Error downloading invoice");
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleEmailInvoice = async () => {
    if (!invoiceNumber || !paymentDetails) return;
    
    try {
      const response = await fetch(
        "http://localhost/managerbp/public/seller/payment/email-invoice.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoice_number: invoiceNumber,
            email: paymentDetails.customer.email
          })
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error sending email");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Dynamic currency formatting
  const formatCurrency = (amount: number) => {
    const currencySymbol = paymentDetails?.payment?.currency_symbol || '₹';
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
    
    return `${currencySymbol}${formattedAmount}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Details Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to retrieve payment details for invoice #{invoiceNumber}</p>
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home size={20} />
            Back to Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 print:bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12 print:hidden">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Successful!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your subscription. Your payment has been processed successfully.
          </p>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 print:shadow-none print:border-none">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Invoice #{paymentDetails.invoice.invoice_number}</h2>
              <p className="text-gray-600 mt-2">
                {formatDate(paymentDetails.invoice.date)}
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0 print:hidden">
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={18} />
                Download PDF
              </button>
              <button
                onClick={handlePrintInvoice}
                className="flex items-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer size={18} />
                Print
              </button>
              <button
                onClick={handleEmailInvoice}
                className="flex items-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail size={18} />
                Email
              </button>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="border-t border-b border-gray-200 py-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Billed To</h3>
                <div className="text-gray-600">
                  <p className="font-medium">{paymentDetails.customer.name}</p>
                  <p>{paymentDetails.customer.email}</p>
                  <p>{paymentDetails.customer.phone}</p>
                  <p className="mt-2">{paymentDetails.customer.address_1}</p>
                  {paymentDetails.customer.address_2 && (
                    <p>{paymentDetails.customer.address_2}</p>
                  )}
                  <p>{paymentDetails.customer.city}, {paymentDetails.customer.state}</p>
                  <p>{paymentDetails.customer.pin_code}, {paymentDetails.customer.country}</p>
                  {/* Show GSTIN only if provided */}
                  {paymentDetails.customer.gst_number ? (
                    <p className="mt-2 font-medium">
                      GSTIN: {paymentDetails.customer.gst_number}
                    </p>
                  ) : (
                    <p className="mt-2 text-gray-500 italic">
                      GSTIN: Not provided
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium">{paymentDetails.payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment ID:</span>
                    <span className="font-medium">{paymentDetails.payment.payment_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium">{paymentDetails.plan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-green-600">{paymentDetails.invoice.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currency:</span>
                    <span className="font-medium">{paymentDetails.payment.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="py-6">
            <h3 className="font-semibold text-gray-900 mb-4">Amount Summary</h3>
            <div className="space-y-3">
              {paymentDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{item.description}</span>
                  <span>{formatCurrency(item.total)}</span>
                </div>
              ))}
              
              <div className="pt-3 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(paymentDetails.payment.amount)}</span>
                </div>
                
                {paymentDetails.payment.discount > 0 && (
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-{formatCurrency(paymentDetails.payment.discount)}</span>
                  </div>
                )}
                
                {paymentDetails.payment.gst_amount > 0 && (
                  <div className="flex justify-between mt-2">
                    <div>
                      <span className="text-gray-600">GST ({paymentDetails.payment.gst_percentage}% </span>
                      <span className="text-gray-600">{paymentDetails.payment.gst_type})</span>
                    </div>
                    <span>{formatCurrency(paymentDetails.payment.gst_amount)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-700">
                      {formatCurrency(paymentDetails.payment.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Company Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
            <p className="font-medium">{paymentDetails.company.name}</p>
            <p className="mt-1">{paymentDetails.company.address}</p>
            {paymentDetails.company.gst_number && (
              <p className="mt-1">GSTIN: {paymentDetails.company.gst_number}</p>
            )}
            <p className="mt-4">This is a computer-generated invoice. No signature required.</p>
          </div>
        </div>

        {/* Next Steps - Hidden in print */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-8 print:hidden">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">What happens next?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-blue-900 mb-2">Account Activation</h4>
              <p className="text-blue-800 text-sm">
                Your subscription will be activated within 5 minutes
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-blue-900 mb-2">Email Confirmation</h4>
              <p className="text-blue-800 text-sm">
                You'll receive a confirmation email with all details
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-blue-900 mb-2">Start Using</h4>
              <p className="text-blue-800 text-sm">
                Log in to your dashboard to access all features
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Hidden in print */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            <Home size={20} className="mr-2" />
            Go to Dashboard
          </Link>
          <Link
            href="/plans"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all"
          >
            View Other Plans
          </Link>
        </div>

        {/* Support Info - Hidden in print */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200 print:hidden">
          <p className="text-gray-600 mb-2">
            Need help? Contact our support team
          </p>
          <p className="text-blue-600 font-medium">
            support@bookpannu.com • +91 9876543210
          </p>
        </div>
      </div>
    </div>
  );
}