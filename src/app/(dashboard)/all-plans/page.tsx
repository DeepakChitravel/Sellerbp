

// In your page component
import { getPlans } from "@/lib/api/plans";
import UpgradePlans from "@/components/upgrade/Plans";

export default async function PlansPage() {
  const plansData = await getPlans();
  
  return (
    <UpgradePlans 
      initialPlans={plansData.data} 
      initialCurrencySettings={plansData.currency_settings}
    />
  );
}