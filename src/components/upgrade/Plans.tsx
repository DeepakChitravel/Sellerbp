"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UpgradePlans({ initialPlans }) {
  const router = useRouter();

  const [plans, setPlans] = useState(initialPlans || []);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [duration, setDuration] = useState("yearly");

  useEffect(() => {
    if (!initialPlans) return;

    setPlans(initialPlans);
    filterPlansByDuration(initialPlans, "yearly");
  }, [initialPlans]);

  const getPlanType = (durationDays: number) => {
    const isMonthly = durationDays % 30 === 0 && durationDays % 365 !== 0;
    const isYearly = durationDays % 365 === 0;

    if (isMonthly) return "monthly";
    if (isYearly) return "yearly";
    return "other";
  };

  const filterPlansByDuration = (allPlans, selectedDuration: string) => {
    if (!allPlans || !Array.isArray(allPlans)) return;

    const filtered = allPlans.filter(
      (plan) => getPlanType(plan.duration) === selectedDuration
    );

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

  const formatCurrency = (amount: number) => {
    return Math.round(amount).toLocaleString("en-IN");
  };

  const calculateDiscountPercentage = (
    currentPrice: number,
    previousPrice?: number
  ) => {
    if (!previousPrice || previousPrice <= currentPrice) return 0;
    return Math.round(((previousPrice - currentPrice) / previousPrice) * 100);
  };

  const calculateSavingsAmount = (
    currentPrice: number,
    previousPrice?: number
  ) => {
    if (!previousPrice || previousPrice <= currentPrice) return 0;
    return previousPrice - currentPrice;
  };

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

      {/* No Plans */}
      {filteredPlans.length === 0 && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">
              No {duration} plans available
            </h3>
            <p className="text-gray-600">
              We don't have any {duration} subscription plans right now.
            </p>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {filteredPlans.map((p, i) => {
          const features = Array.isArray(p.feature_lists)
            ? p.feature_lists
            : [];
          const planType = getPlanType(p.duration);
          const formattedDuration = formatDuration(p.duration);

          const discountPercentage = calculateDiscountPercentage(
            p.display_price,
            p.previous_display_price
          );
          const savingsAmount = calculateSavingsAmount(
            p.display_price,
            p.previous_display_price
          );
          const shouldShowDiscount = discountPercentage > 0;

          return (
            <div
              key={i}
              className={`relative p-8 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                p.is_trial
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-500"
                  : planType === "monthly"
                  ? "bg-white border-blue-100"
                  : "bg-white border-green-100"
              }`}
            >
              {/* Header */}
              <div className="text-left mb-6">
                <div className="mb-4 flex justify-start">
                  <span
                    className={`inline-block px-4 py-1.5 text-xs font-semibold rounded-full ${
                      planType === "monthly"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-green-100 text-green-800 border border-green-200"
                    }`}
                  >
                    {planType === "monthly" ? "Monthly" : "Yearly"}
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-2">{p.name}</h2>

                {shouldShowDiscount && (
                  <div className="mb-3 flex items-center gap-2">
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {discountPercentage}% OFF
                    </span>
                    <span className="text-sm text-gray-600">
                      Save ₹{formatCurrency(savingsAmount)}
                    </span>
                  </div>
                )}

                {/* Prices */}
                <div className="text-left mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    {shouldShowDiscount && p.previous_display_price && (
                      <span className="text-gray-400 text-lg line-through">
                        ₹{formatCurrency(p.previous_display_price)}
                      </span>
                    )}
                    <span
                      className={`text-4xl font-bold ${
                        p.is_trial ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ₹{formatCurrency(p.display_price)}
                    </span>
                    <span
                      className={`text-lg ${
                        p.is_trial ? "text-blue-100" : "text-gray-600"
                      }`}
                    >
                      /{formattedDuration}
                    </span>
                  </div>

                  {p.description && (
                    <p
                      className={`text-sm ${
                        p.is_trial ? "text-blue-100" : "text-gray-600"
                      } mb-4`}
                    >
                      {p.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="border-t pt-6 mb-8">
                <h4
                  className={`text-sm font-semibold mb-4 uppercase tracking-wider ${
                    p.is_trial ? "text-white" : "text-gray-700"
                  }`}
                >
                  What's included:
                </h4>

                <div className="space-y-3">
                  {features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-3">
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
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => router.push(`/plan?plan_id=${p.id}`)}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                  p.is_trial
                    ? "bg-white text-blue-700 hover:bg-gray-50"
                    : planType === "monthly"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {p.is_trial
                  ? "Start Free Trial"
                  : `Choose ${
                      planType === "monthly" ? "Monthly" : "Yearly"
                    } Plan`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
