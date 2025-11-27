import ManualPaymentMethods from "@/components/cards/manual-payment-methods";
import PaymentProviders from "@/components/forms/settings/payment-settings/payment-providers";
import { getAllManualPaymentMethods } from "@/lib/api/manual-payment-methods";
import { currentUser } from "@/lib/api/users";

const SettingsPayment = async () => {
  const user = await currentUser();
  const manualPaymentMethods = await getAllManualPaymentMethods({ limit: 999 });

  return (
    <div>
      <div>
        <div className="mb-9 space-y-1.5">
          <h3 className="font-medium">Payment Providers</h3>
          <p className="text-black/50 text-sm font-medium">
            Manage payment providers to accept payments from your customers.
          </p>
        </div>

        <PaymentProviders settingsData={user.siteSettings[0]} />
      </div>

      {/* Manual Payment Methods */}
      <div className="mt-8 pt-8 border-t">
        <div className="mb-9 space-y-1.5">
          <h3 className="font-medium">Manual Payment Methods</h3>
          <p className="text-black/50 text-sm font-medium">
            Enables offline payments like bank transfer, upi, or other custom
            methods.
          </p>
        </div>

        <ManualPaymentMethods data={manualPaymentMethods.records} />
      </div>
    </div>
  );
};

export default SettingsPayment;
