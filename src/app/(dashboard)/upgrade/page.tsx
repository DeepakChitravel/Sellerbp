"use client";

import { useEffect, useState } from "react";
import { getPlans } from "@/lib/api/plans";

interface Plan {
  id: number;
  name: string;
  amount: number;
  previous_amount: number;
  duration: number;
  description: string;
  feature_lists: string[];
  is_trial: boolean;
}

export default function UpgradePage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [duration, setDuration] = useState("yearly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlans().then((res: any) => {
      if (res.success) {
        setPlans(res.data);
        filterPlansByDuration(res.data, "yearly");
      }
      setLoading(false);
    });
  }, []);

  const getPlanType = (durationDays: number) => {
    const isMonthly = durationDays % 30 === 0 && durationDays % 365 !== 0;
    const isYearly = durationDays % 365 === 0;

    if (isMonthly) return "monthly";
    if (isYearly) return "yearly";
    return "other";
  };

  const filterPlansByDuration = (allPlans: Plan[], selectedDuration: string) => {
    const filtered = allPlans.filter((plan: Plan) => {
      const planType = getPlanType(plan.duration);
      return planType === selectedDuration;
    });
    setFilteredPlans(filtered);
  };

  const handleDurationChange = (selectedDuration: string) => {
    setDuration(selectedDuration);
    filterPlansByDuration(plans, selectedDuration);
  };

  const formatDuration = (days: number) => {
    if (days % 365 === 0) {
      const years = days / 365;
      return years === 1 ? "1 Year" : `${years} Years`;
    } else if (days % 30 === 0) {
      const months = days / 30;
      return months === 1 ? "1 Month" : `${months} Months`;
    }
    return `${days} Days`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-5">
      <h1 className="text-4xl font-bold text-center mb-3">Upgrade Your Plan</h1>
      <p className="text-center text-gray-600 mb-10">
        Choose the perfect plan to unlock more powerful features.
      </p>

      {/* Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white border rounded-full p-1 flex gap-2 shadow-sm">
          <button
            onClick={() => handleDurationChange("monthly")}
            className={`px-5 py-2 rounded-full text-sm transition ${
              duration === "monthly"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Monthly Plans
          </button>

          <button
            onClick={() => handleDurationChange("yearly")}
            className={`px-5 py-2 rounded-full text-sm transition ${
              duration === "yearly"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Yearly Plans
          </button>
        </div>
      </div>

      {/* No Plans Message */}
      {filteredPlans.length === 0 && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">
              No {duration} plans available
            </h3>
            <p className="text-gray-600">
              We don't have any {duration} subscription plans at the moment.
              Please check back later or contact support.
            </p>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {filteredPlans.map((p: Plan) => {
          const features = Array.isArray(p.feature_lists) ? p.feature_lists : [];
          const planType = getPlanType(p.duration);
          const formattedDuration = formatDuration(p.duration);

          const hasDiscount =
            p.previous_amount &&
            p.previous_amount > 0 &&
            p.previous_amount > p.amount;

          return (
            <div
<<<<<<< HEAD
              key={p.id}
              className={`relative p-8 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                p.is_trial
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-500"
                  : planType === "monthly"
                  ? "bg-white border-blue-100"
                  : "bg-white border-green-100"
              }`}
            >
              {/* Recommended Badge */}
              {p.is_trial && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white text-blue-700 px-4 py-1.5 text-xs font-semibold rounded-full shadow-lg">
                    Recommended
                  </span>
                </div>
              )}

=======
              key={i}
              className={`relative p-8 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                p.is_trial
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-500"
                  : planType === 'monthly'
                    ? "bg-white border-blue-100"
                    : "bg-white border-green-100"
              }`}
            >
              {/* Plan Header - Align badge to left */}
>>>>>>> 5f013bb046c28a5d5f40e8c60155ba0fc2c3b20e
              <div className="text-left mb-6">
                <div className="mb-4 flex justify-start">
<<<<<<< HEAD
                  <span
                    className={`inline-block px-4 py-1.5 text-xs font-semibold rounded-full ${
                      planType === "monthly"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-green-100 text-green-800 border border-green-200"
                    }`}
                  >
                    {planType === "monthly" ? "Monthly" : "Yearly"}
=======
                  <span className={`inline-block px-4 py-1.5 text-xs font-semibold rounded-full ${
                    planType === 'monthly'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {planType === 'monthly' ? 'Monthly' : 'Yearly'}
>>>>>>> 5f013bb046c28a5d5f40e8c60155ba0fc2c3b20e
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-2">{p.name}</h2>

                {/* Price */}
                <div className="text-left mb-4">
                  <div className="flex items-baseline gap-1 mb-1">
<<<<<<< HEAD
                    <span
                      className={`text-4xl font-bold ${
                        p.is_trial ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ₹{p.amount}
                    </span>
                    <span
                      className={`text-lg ${
                        p.is_trial ? "text-blue-100" : "text-gray-600"
                      }`}
                    >
=======
                    <span className={`text-4xl font-bold ${
                      p.is_trial ? 'text-white' : 'text-gray-900'
                    }`}>
                      ₹{p.amount}
                    </span>
                    <span className={`text-lg ${
                      p.is_trial ? 'text-blue-100' : 'text-gray-600'
                    }`}>
>>>>>>> 5f013bb046c28a5d5f40e8c60155ba0fc2c3b20e
                      /{formattedDuration}
                    </span>
                  </div>

<<<<<<< HEAD
                  {/* Discount */}
                  {hasDiscount && (
                    <div
                      className={`text-sm mb-2 ${
                        p.is_trial ? "text-blue-200" : "text-gray-500"
                      }`}
                    >
                      <span className="line-through mr-2">
                        ₹{p.previous_amount}
                      </span>
=======
                  {/* Original Price & Save Badge */}
                  {shouldShowDiscount && (
                    <div className={`text-sm mb-2 ${
                      p.is_trial ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      <span className="line-through mr-2">₹{p.previous_amount}</span>
>>>>>>> 5f013bb046c28a5d5f40e8c60155ba0fc2c3b20e
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Save{" "}
                        {Math.round(
                          (1 - p.amount / p.previous_amount) * 100
                        )}
                        %
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {p.description && (
<<<<<<< HEAD
                  <p
                    className={`text-sm ${
                      p.is_trial ? "text-blue-100" : "text-gray-600"
                    } mb-4`}
                  >
=======
                  <p className={`text-sm ${
                    p.is_trial ? 'text-blue-100' : 'text-gray-600'
                  } mb-4`}>
>>>>>>> 5f013bb046c28a5d5f40e8c60155ba0fc2c3b20e
                    {p.description}
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="border-t pt-6 mb-8">
<<<<<<< HEAD
                <h4
                  className={`text-sm font-semibold mb-4 uppercase tracking-wider ${
                    p.is_trial ? "text-white" : "text-gray-700"
                  }`}
                >
=======
                <h4 className={`text-sm font-semibold mb-4 uppercase tracking-wider ${
                  p.is_trial ? 'text-white' : 'text-gray-700'
                }`}>
>>>>>>> 5f013bb046c28a5d5f40e8c60155ba0fc2c3b20e
                  What's included:
                </h4>
                <div className="space-y-3">
                  {features.map((f: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
<<<<<<< HEAD
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          p.is_trial
                            ? "bg-blue-500"
                            : planType === "monthly"
                            ? "bg-blue-100"
                            : "bg-green-100"
                        }`}
                      >
                        <span
                          className={`text-xs ${
                            p.is_trial
                              ? "text-white"
                              : planType === "monthly"
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        >
                          ✓
                        </span>
                      </div>
                      <span
                        className={`text-sm ${
                          p.is_trial ? "text-blue-100" : "text-gray-600"
                        }`}
                      >
=======
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        p.is_trial ? 'bg-blue-500' : planType === 'monthly' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        <span className={`text-xs ${
                          p.is_trial ? 'text-white' : planType === 'monthly' ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          ✓
                        </span>
                      </div>
                      <span className={`text-sm ${
                        p.is_trial ? 'text-blue-100' : 'text-gray-600'
                      }`}>
>>>>>>> 5f013bb046c28a5d5f40e8c60155ba0fc2c3b20e
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Button */}
              <button
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                  p.is_trial
                    ? "bg-white text-blue-700 hover:bg-gray-50"
<<<<<<< HEAD
                    : planType === "monthly"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-green-600 text-white hover:bg-green-700"
=======
                    : planType === 'monthly'
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-green-600 text-white hover:bg-green-700"
>>>>>>> 5f013bb046c28a5d5f40e8c60155ba0fc2c3b20e
                }`}
              >
                Choose {planType === "monthly" ? "Monthly" : "Yearly"} Plan
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
