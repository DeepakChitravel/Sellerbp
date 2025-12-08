"use client";

export default function Checkout({ plan, gst }) {
  const formatCurrency = (num) =>
    Math.round(num || 0).toLocaleString("en-IN");

  const gstAmount =
    gst?.gst_tax_type === "exclusive"
      ? Math.round((plan.display_price * gst.gst_percentage) / 100)
      : 0;

  const finalTotal =
    gst?.gst_tax_type === "exclusive"
      ? plan.display_price + gstAmount
      : plan.display_price;

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      {/* --- REMOVE MAIN HEADER --- */}
      {/* No title, no plan summary, straight to checkout fields */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT FORM */}
        <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Billing Information</h2>

          <div className="space-y-4">
            <Input label="Name or Company Name *" />
            <Input label="Mobile Number *" />
            <Input label="Email Address" />
            <Input label="Zip/Postal Code *" />
            <Input label="Address Line 1 *" />
            <Input label="Address Line 2" />
            <Input label="State *" />
            <Input label="City *" />
            <Input label="Country" />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-sm text-gray-600">
              Display my GSTIN number on invoice
            </span>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="space-y-6">
          <div className="bg-white p-6 shadow-md rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Discount</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Discount Code"
                className="border rounded-md px-3 py-2 w-full"
              />
              <button className="bg-blue-600 text-white px-4 rounded-md">
                Redeem
              </button>
            </div>
          </div>

          <div className="bg-white p-6 shadow-md rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>

            <Row label="Sub Total" value={`₹${formatCurrency(plan.display_price)}`} />
            <Row label="Discount" value="0" />
            <Row
              label={`GST Amount (${gst?.gst_percentage}% exclusive tax)`}
              value={`₹${formatCurrency(gstAmount)}`}
            />
            <Row label="Total" value={`₹${formatCurrency(finalTotal)}`} bold />
          </div>

          <div className="bg-white p-6 shadow-md rounded-xl">
            <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700">
              Pay with Razorpay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* UI Helpers */
function Input({ label }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input className="border rounded-md px-3 py-2" />
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-gray-600">{label}</span>
      <span className={bold ? "font-bold" : ""}>{value}</span>
    </div>
  );
}
