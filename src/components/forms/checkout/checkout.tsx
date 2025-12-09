"use client";

import { useState } from "react";
import { validateDiscount } from "@/lib/api/plans";
import { getRazorpayCredentials } from "@/lib/api/razorpay";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout({ plan, gst, user }) {
  const formatCurrency = (num) => Math.round(num || 0).toLocaleString("en-IN");

  // State for discount
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState({ amount: 0, type: null, applied: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  // State for GSTIN
  const [showGstinField, setShowGstinField] = useState(false);
  const [gstinNumber, setGstinNumber] = useState("");
  const [gstinError, setGstinError] = useState("");

  // State for billing info
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    phone: "",
    email: "",
    pin_code: "",
    address_1: "",
    address_2: "",
    state: "",
    city: "",
    country: "India"
  });

  // Get GST percentage from API response
  const gstPercentage = gst?.gst_percentage || 18;

  // Check if GST is included in the plan price
  const isGstInclusive = plan?.is_price_inclusive || (gst?.gst_tax_type === 'inclusive');

  // Get payment gateway status from plan
  const paymentGateways = plan?.payment_gateways || {
    razorpay: false,
    phonepe: false,
    payu: false
  };

  // Get the actual amount from the plan (base price)
  const planAmount = plan?.amount || 0;

  // Get the display price (which might already include GST)
  const displayPrice = plan?.display_price || 0;

  let subTotal, gstAmount, finalTotal;

  if (isGstInclusive) {
    // If GST is already included in the price
    subTotal = planAmount;
    gstAmount = 0;
    finalTotal = displayPrice;
  } else {
    // If GST is exclusive
    subTotal = planAmount;
    gstAmount = Math.round((subTotal * gstPercentage) / 100);
    finalTotal = subTotal + gstAmount;
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (discount.applied && discount.type) {
    if (discount.type === 'percentage') {
      discountAmount = Math.round((subTotal * discount.amount) / 100);
    } else if (discount.type === 'fixed') {
      discountAmount = discount.amount;
    }
  }

  // Apply discount to final total
  const discountedTotal = finalTotal - discountAmount;

  // Handle discount code redemption
  const handleRedeemDiscount = async () => {
    if (!discountCode.trim()) {
      setError("Please enter a discount code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await validateDiscount(discountCode, plan?.id);

      if (result.success) {
        setDiscount({
          amount: result.discount.amount,
          type: result.discount.type,
          applied: true
        });
        setError("");
        toast.success("Discount applied successfully!");
      } else {
        setError(result.message || "Invalid discount code");
        setDiscount({ amount: 0, type: null, applied: false });
        toast.error(result.message || "Invalid discount code");
      }
    } catch (err) {
      setError("Error applying discount code");
      setDiscount({ amount: 0, type: null, applied: false });
      toast.error("Error applying discount code");
    } finally {
      setLoading(false);
    }
  };

  // Validate GSTIN format
  const validateGSTIN = (gstin) => {
    if (!gstin) return true;

    // Basic GSTIN validation
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (gstin.length !== 15) {
      setGstinError("GSTIN must be exactly 15 characters");
      return false;
    }

    if (!gstinRegex.test(gstin)) {
      setGstinError("Invalid GSTIN");
      return false;
    }

    setGstinError("");
    return true;
  };

  // Handle GSTIN input change with validation
  const handleGstinChange = (value) => {
    setGstinNumber(value);
    
    if (value.length === 15) {
      validateGSTIN(value);
    }
  };

  // Handle billing info change
  const handleBillingInfoChange = (field, value) => {
    setBillingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate all required billing fields
  const validateBillingInfo = () => {
    const requiredFields = ['name', 'phone', 'pin_code', 'address_1', 'state', 'city'];
    
    for (const field of requiredFields) {
      if (!billingInfo[field]?.trim()) {
        toast.error(`Please fill in ${field.replace('_', ' ')}`);
        return false;
      }
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(billingInfo.phone)) {
      toast.error("Please enter a valid 10-digit Indian phone number");
      return false;
    }

    // Validate pincode
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(billingInfo.pin_code)) {
      toast.error("Please enter a valid 6-digit PIN code");
      return false;
    }

    return true;
  };

  // Handle Razorpay Payment
  const handleRazorpayPayment = async () => {
    // Validate billing info
    if (!validateBillingInfo()) {
      return;
    }

    setProcessingPayment(true);

    try {
      // Get Razorpay credentials
      const credentials = await getRazorpayCredentials();
      
      if (!credentials.razorpay_key_id) {
        toast.error("Razorpay credentials not configured");
        return;
      }

      // Create order on your server
      const orderResponse = await fetch(
        "http://localhost/managerbp/public/seller/payment/create-razorpay-order.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: discountedTotal,
            currency: "INR",
            plan_id: plan.id,
            user_id: user?.id || 1 // Replace with actual user ID
          })
        }
      );

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        toast.error("Failed to create payment order");
        return;
      }

      const order = orderData.order;

      // Razorpay options
      const options = {
        key: credentials.razorpay_key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Book Pannu",
        description: `Payment for ${plan.name}`,
        order_id: order.id,
        handler: async function (response) {
          // Verify payment on your server
          const verificationResponse = await fetch(
            "http://localhost/managerbp/public/seller/payment/verify-razorpay-payment.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                billing_data: {
                  ...billingInfo,
                  user_id: user?.id || 1,
                  gstin: gstinNumber
                },
                plan_data: {
                  plan_id: plan.id,
                  amount: discountedTotal,
                  gst_amount: gstAmount,
                  gst_type: isGstInclusive ? 'inclusive' : 'exclusive',
                  gst_percentage: gstPercentage,
                  discount: discountAmount,
                  currency: "INR"
                }
              })
            }
          );

          const verificationData = await verificationResponse.json();

          if (verificationData.success) {
            toast.success(`Payment successful! Invoice: ${verificationData.invoice_number}`);
            // Redirect to success page or update UI
            window.location.href = `/payment-success?invoice=${verificationData.invoice_number}`;
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: billingInfo.name,
          email: billingInfo.email || user?.email || "",
          contact: billingInfo.phone
        },
        notes: {
          plan: plan.name,
          user_id: user?.id || 1
        },
        theme: {
          color: "#5f57ff"
        },
        modal: {
          ondismiss: function() {
            toast.info("Payment cancelled");
            setProcessingPayment(false);
          }
        }
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment processing failed");
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT FORM */}
        <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Billing Information</h2>

          <div className="space-y-4">
            <Input 
              label="Name or Company Name *" 
              value={billingInfo.name}
              onChange={(e) => handleBillingInfoChange('name', e.target.value)}
            />
            <Input 
              label="Mobile Number *" 
              value={billingInfo.phone}
              onChange={(e) => handleBillingInfoChange('phone', e.target.value)}
              type="tel"
            />
            <Input 
              label="Email Address" 
              value={billingInfo.email}
              onChange={(e) => handleBillingInfoChange('email', e.target.value)}
              type="email"
            />
            <Input 
              label="Zip/Postal Code *" 
              value={billingInfo.pin_code}
              onChange={(e) => handleBillingInfoChange('pin_code', e.target.value)}
            />
            <Input 
              label="Address Line 1 *" 
              value={billingInfo.address_1}
              onChange={(e) => handleBillingInfoChange('address_1', e.target.value)}
            />
            <Input 
              label="Address Line 2" 
              value={billingInfo.address_2}
              onChange={(e) => handleBillingInfoChange('address_2', e.target.value)}
            />
            <Input 
              label="State *" 
              value={billingInfo.state}
              onChange={(e) => handleBillingInfoChange('state', e.target.value)}
            />
            <Input 
              label="City *" 
              value={billingInfo.city}
              onChange={(e) => handleBillingInfoChange('city', e.target.value)}
            />
            <Input 
              label="Country" 
              value={billingInfo.country}
              onChange={(e) => handleBillingInfoChange('country', e.target.value)}
              disabled
            />
          </div>

          {/* GSTIN Section */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="showGstin"
                checked={showGstinField}
                onChange={(e) => setShowGstinField(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
              />
              <label
                htmlFor="showGstin"
                className="text-sm text-gray-600 cursor-pointer select-none"
              >
                Display my GSTIN number on invoice
              </label>
            </div>

            {/* GSTIN Input Field */}
            {showGstinField && (
              <div className="pt-3 border-t">
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-2 text-gray-700">
                    GSTIN Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter 15-digit GSTIN"
                      className={`border rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${gstinError ? 'border-red-500' : 'border-gray-300'
                        }`}
                      value={gstinNumber}
                      onChange={(e) => handleGstinChange(e.target.value)}
                      maxLength={15}
                    />
                  </div>

                  {/* GSTIN Error Message */}
                  {gstinError && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {gstinError}
                      </p>
                    </div>
                  )}

                  {/* GSTIN Success Message */}
                  {gstinNumber.length === 15 && !gstinError && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-green-600 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Valid GSTIN
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="space-y-6">
          {/* DISCOUNT SECTION */}
          <div className="bg-white p-6 shadow-md rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Discount</h2>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter discount code"
                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleRedeemDiscount();
                  }
                }}
              />
              <button
                className="bg-blue-600 text-white px-4 rounded-md disabled:bg-gray-400 min-w-[80px] hover:bg-blue-700 transition-colors"
                onClick={handleRedeemDiscount}
                disabled={loading || !discountCode.trim()}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Apply"}
              </button>
            </div>

            {/* Error message only */}
            {error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* SUMMARY SECTION */}
          <div className="bg-white p-6 shadow-md rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>

            {/* Summary details */}
            <Row label="Sub Total" value={`₹${formatCurrency(subTotal)}`} />

            {/* Discount row */}
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Discount</span>
              <span className={discountAmount > 0 ? "text-green-600 font-medium" : "text-gray-600"}>
                {discountAmount > 0 ? `-₹${formatCurrency(discountAmount)}` : `₹0`}
              </span>
            </div>

            {/* GST Info - Shows inclusive/exclusive */}
            <div className="flex justify-between items-center py-2">
              <div>
                <span className="text-gray-600">GST ({gstPercentage}% {isGstInclusive ? "inclusive" : "exclusive"})</span>
              </div>
              <div className="text-right">
                <span className="text-gray-800">₹{formatCurrency(gstAmount)}</span>
                {isGstInclusive && gstAmount === 0 && (
                  <div className="text-xs text-gray-500">Included in price</div>
                )}
              </div>
            </div>

            {/* Separator line */}
            <div className="border-t my-3 border-gray-200"></div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-800 font-semibold text-lg">Total</span>
              <span className="font-bold text-xl text-blue-700">₹{formatCurrency(discountedTotal)}</span>
            </div>
          </div>

          {/* PAYMENT SECTION */}
          <div className="bg-white p-6 shadow-md rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>
            
            <div className="space-y-3">
              {/* Razorpay Button */}
              {paymentGateways.razorpay && (
                <button
                  onClick={handleRazorpayPayment}
                  disabled={processingPayment}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processingPayment ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Pay with Razorpay"
                  )}
                </button>
              )}

              {/* PhonePe Button */}
              {paymentGateways.phonepe && (
                <button
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
                >
                  Pay with PhonePe
                </button>
              )}

              {/* PayU Button */}
              {paymentGateways.payu && (
                <button
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
                >
                  Pay with PayU
                </button>
              )}

              {/* No payment methods available */}
              {!paymentGateways.razorpay && !paymentGateways.phonepe && !paymentGateways.payu && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-yellow-700 font-medium">No payment methods available for this plan</span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment security note */}
            {(paymentGateways.razorpay || paymentGateways.phonepe || paymentGateways.payu) && (
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secure payment • SSL encrypted</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  You'll be redirected to secure payment gateway
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* UI Helpers */
function Input({ label, value, onChange, type = "text", disabled = false }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-2 text-gray-700">{label}</label>
      <input
        type={type}
        className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between py-2">
      <span className="text-gray-600">{label}</span>
      <span className={bold ? "font-bold text-lg" : ""}>{value}</span>
    </div>
  );
}