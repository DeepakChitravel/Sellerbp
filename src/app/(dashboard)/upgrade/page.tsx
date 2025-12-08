import { getPlans } from "@/lib/api/plans";
import UpgradePlans from "@/components/upgrade/Plans";

export default async function UpgradePage() {
  const response = await getPlans();
  const plans = response?.success ? response.data : [];

  return (
    <div>
      <div className="mb-9 space-y-1.5">
        <h3 className="font-medium">Upgrade Your Plan</h3>
        <p className="text-black/50 text-sm font-medium">
          Choose the perfect subscription plan.
        </p>
      </div>

      {/* Pass plans to client component */}
      <UpgradePlans initialPlans={plans} />
    </div>
  );
}
