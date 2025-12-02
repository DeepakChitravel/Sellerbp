"use client";
import PaymentMethodCard from "@/components/cards/payment-method-card";
import { InputField, siteSettings } from "@/types";
import React, { useState } from "react";

interface Props {
  settingsData: siteSettings;
}

interface Form {
  [key: string]: InputField;
}

const PaymentProviders = ({ settingsData }: Props) => {
  const [cashInHand, setCashInHand] = useState<boolean>(
    settingsData?.cashInHand
  );
  const [razorpayKeyId, setRazorpayKeyId] = useState<string>(
    settingsData?.razorpayKeyId
  );

  const [phonepeSaltKey, setPhonepeSaltKey] = useState<string>(
    settingsData?.phonepeSaltKey
  );
  const [phonepeSaltIndex, setPhonepeSaltIndex] = useState<string>(
    settingsData?.phonepeSaltIndex
  );
  const [phonepeMerchantId, setPhonepeMerchantId] = useState<string>(
    settingsData?.phonepeMerchantId
  );

  const [payuApiKey, setPayuApiKey] = useState<string>(
    settingsData?.payuApiKey
  );
  const [payuSalt, setPayuSalt] = useState<string>(settingsData?.payuSalt);

  // Input fields
  const razorpayInputFields: Form = {
    razorpayKeyId: {
      type: "text",
      value: razorpayKeyId,
      setValue: setRazorpayKeyId,
      label: "Key ID",
      placeholder: "Enter Key ID",
    },
  };

  const phonepeInputFields: Form = {
    phonepeSaltKey: {
      type: "text",
      value: phonepeSaltKey,
      setValue: setPhonepeSaltKey,
      label: "Salt Key",
      placeholder: "Enter Salt Key",
    },
    phonepeSaltIndex: {
      type: "text",
      value: phonepeSaltIndex,
      setValue: setPhonepeSaltIndex,
      label: "Salt Index",
      placeholder: "Enter Salt Index",
    },
    phonepeMerchantId: {
      type: "text",
      value: phonepeMerchantId,
      setValue: setPhonepeMerchantId,
      label: "Merchant ID",
      placeholder: "Enter Merchant ID",
    },
  };

  const payuInputFields: Form = {
    payuApiKey: {
      type: "text",
      value: payuApiKey,
      setValue: setPayuApiKey,
      label: "API Key",
      placeholder: "Enter API Key",
    },
    payuSalt: {
      type: "text",
      value: payuSalt,
      setValue: setPayuSalt,
      label: "Salt",
      placeholder: "Enter Salt",
    },
  };

  return (
    <>
      <div className="grid gap-6">
        <PaymentMethodCard
          name="cashInHand"
          value={{ value: cashInHand, setValue: setCashInHand }}
          method={{
            name: "Cash In Hand",
            icon: "cash.png",
          }}
        />

        <PaymentMethodCard
          method={{
            name: "Razorpay",
            icon: "razorpay.png",
          }}
          inputFields={razorpayInputFields}
        />

        <PaymentMethodCard
          method={{
            name: "Phonepe",
            icon: "phonepe.png",
          }}
          inputFields={phonepeInputFields}
        />

        <PaymentMethodCard
          method={{
            name: "Payu",
            icon: "payu.png",
          }}
          inputFields={payuInputFields}
        />
      </div>
    </>
  );
};

export default PaymentProviders;
