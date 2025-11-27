"use client";
import { Plus } from "lucide-react";
import ManualPaymentMethodForm from "../forms/settings/payment-settings/manual-payment-method-form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { manualPaymentMethod } from "@/types";
import ManualPaymentMethodCard from "@/components/cards/manual-payment-methods/manual-payment-method-card";
import { getAllManualPaymentMethods } from "@/lib/api/manual-payment-methods";

interface Props {
  data: manualPaymentMethod[];
}

const ManualPaymentMethods = ({ data }: Props) => {
  const [reload, setReload] = useState<number>();
  const [manualPaymentMethodData, setManualPaymentMethodData] =
    useState<manualPaymentMethod[]>(data);

  useEffect(() => {
    async function getManualPaymentMethods() {
      const result = await getAllManualPaymentMethods({ limit: 999 });
      setManualPaymentMethodData(result.records);
    }
    getManualPaymentMethods();
  }, [reload]);

  return (
    <div>
      <div className="grid gap-6">
        {manualPaymentMethodData.map((item, index) => (
          <ManualPaymentMethodCard
            key={index}
            data={item}
            setReload={setReload}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center">
        <ManualPaymentMethodForm setReload={setReload}>
          <Button variant="outline" className="gap-2">
            <Plus size={18} /> Add Manual Payment Method
          </Button>
        </ManualPaymentMethodForm>
      </div>
    </div>
  );
};

export default ManualPaymentMethods;
