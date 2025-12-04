"use client";

import { useEffect, useState } from "react";
import { getPlans } from "@/lib/api/plans";

export default function UpgradePage() {
  const [plans, setPlans] = useState([]);
  const [duration, setDuration] = useState("yearly");

useEffect(() => {
  getPlans().then((res: any) => {
    console.log("PLANS RES:", res);
    if (res.success) setPlans(res.data);
  });
}, []);


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-5">
      <h1 className="text-4xl font-bold text-center mb-3">
        Upgrade Your Plan
      </h1>
      <p className="text-center text-gray-600 mb-10">
        Choose the perfect plan to unlock more powerful features.
      </p>

      {/* Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white border rounded-full p-1 flex gap-2 shadow-sm">
          <button
            onClick={() => setDuration("monthly")}
            className={`px-5 py-2 rounded-full text-sm transition ${
              duration === "monthly"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setDuration("yearly")}
            className={`px-5 py-2 rounded-full text-sm transition ${
              duration === "yearly"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {plans.map((p: any, i: number) => {
const features = Array.isArray(p.feature_lists) ? p.feature_lists : [];

          return (
            <div
              key={i}
              className={`relative p-6 rounded-2xl shadow-lg border backdrop-blur-xl transition hover:scale-[1.02] hover:shadow-xl ${
                p.is_trial ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {p.is_trial && (
                <span className="absolute top-3 right-3 bg-white/30 px-3 py-1 text-xs rounded-full">
                  Recommended
                </span>
              )}

              <h2 className="text-xl font-semibold mb-1">{p.name}</h2>

              <div className="mt-5 mb-3">
                <div className="text-gray-400 line-through text-sm">
                  ₹{p.previous_amount}
                </div>

                <div className="text-4xl font-bold">
                  ₹
                  {duration === "yearly"
                    ? p.amount
                    : Math.round(p.amount / 12)}
                </div>

                <div className="text-sm mt-1 opacity-80">
                  {duration === "yearly" ? "per year" : "per month"} ·{" "}
                  {p.duration} days
                </div>
              </div>

              <div className="mt-6 mb-6 text-sm space-y-2 h-64 overflow-y-auto pr-2">
                {features.map((f: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full mt-3 py-2 rounded-lg font-medium transition ${
                  p.is_trial
                    ? "bg-white text-blue-700 hover:bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Choose Plan
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
