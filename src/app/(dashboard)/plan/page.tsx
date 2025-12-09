//import Checkout from "./Checkout";
import Checkout from "@/components/forms/checkout/checkout";
import { getPlans } from "@/lib/api/plans";


export default async function PlanPage({ searchParams }) {
  const planId = searchParams?.plan_id;

  if (!planId) {
    return <div className="p-10 text-center text-red-600">Missing plan_id</div>;
  }

  // Get all plans
  const response = await getPlans();
  const plans = response?.success ? response.data : [];

  // Find selected plan
  const selectedPlan = plans.find((p) => Number(p.id) === Number(planId));

  if (!selectedPlan) {
    return <div className="p-10 text-center text-red-600">Plan not found</div>;
  }

  // DIRECTLY render Checkout (no plan details)
  return <Checkout plan={selectedPlan} gst={response.gst_settings} />;
}
