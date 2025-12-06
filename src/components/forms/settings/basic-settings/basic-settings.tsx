"use client";

import FormInputs from "@/components/form-inputs";
import { Button } from "@/components/ui/button";
import { COUNTRIES, CURRENCIES } from "@/constants";
import { statesByCountry } from "@/lib/api/csc";
import { getBasicSettings, updateBasicSettings } from "@/lib/api/basic-settings";
import { handleToast } from "@/lib/utils";
import { InputField, Option } from "@/types";
import getSymbolFromCurrency from "currency-symbol-map";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import LogoUpload from "./LogoUpload";
import FaviconUpload from "./FaviconUpload";

interface Props {
  initialData?: any;
}

interface Form {
  [key: string]: InputField;
}

const BasicSettings = ({ initialData }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(!initialData);
  const [currencies, setCurrencies] = useState<Option[]>([]);
  const [states, setStates] = useState<Option[]>([]);
  const [settings, setSettings] = useState<any>(initialData || null);

  const [userId, setUserId] = useState<string | null>(null);

  // BASIC FIELDS
  const [logo, setLogo] = useState<string>(settings?.logo || "");
  const [favicon, setFavicon] = useState<string>(settings?.favicon || "");
  const [email, setEmail] = useState<string>(settings?.email || "");
  const [phone, setPhone] = useState<string>(settings?.phone || "");
  const [whatsapp, setWhatsapp] = useState<string>(settings?.whatsapp || "");
  const [currency, setCurrency] = useState<string>(settings?.currency || "INR");
  const [country, setCountry] = useState<string>(settings?.country || "");
  const [state, setStateValue] = useState<string>(settings?.state || "");
  const [address, setAddress] = useState<string>(settings?.address || "");

  // Fetch settings from server
  useEffect(() => {
    if (!initialData) {
      fetchSettings();
    }
  }, []);

  const fetchSettings = async () => {
    setFetching(true);
    try {
      const response = await getBasicSettings();

      console.log("FULL API RESPONSE:", response);
      console.log("response.data:", response.data);
      console.log("response.data.user_id:", response.data?.user_id);
      console.log("response.data.data:", response.data?.data);
      console.log("response.data.data.user_id:", response.data?.data?.user_id);

      if (response.success && response.data) {
        const d = response.data;
        setUserId(d.user_id);
        setLogo(d.logo || "");
        setFavicon(d.favicon || "");
        setEmail(d.email || "");
        setPhone(d.phone || "");
        setWhatsapp(d.whatsapp || "");
        setCurrency(d.currency || "INR");
        setCountry(d.country || "");
        setStateValue(d.state || "");
        setAddress(d.address || "");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setFetching(false);
    }
  };

  // Load currency options
  useEffect(() => {
    const list: Option[] = CURRENCIES.map((c) => ({
      value: c.code,
      label: `${c.name} (${getSymbolFromCurrency(c.code)})`,
    }));
    setCurrencies(list);
  }, []);

  // Load states when country changes
  useEffect(() => {
    async function loadStates() {
      if (!country) return setStates([]);
      try {
        const list = await statesByCountry(country);
        setStates(
          list.map((item: any) => ({
            value: item.iso2,
            label: item.name,
          }))
        );
      } catch (error) {
        console.error("Failed loading states:", error);
      }
    }
    loadStates();
  }, [country]);

  // Form Inputs (non-file fields)
  const inputFields: Form = {
    phone: {
      type: "text",
      value: phone,
      setValue: setPhone,
      label: "Mobile Number",
      containerClassName: "md:col-span-6",
    },
    whatsapp: {
      type: "text",
      value: whatsapp,
      setValue: setWhatsapp,
      label: (
        <div className="flex items-center justify-between">
          <span>WhatsApp Number</span>
          <button
            type="button"
            onClick={() => setWhatsapp(phone)}
            className="text-primary underline text-sm hover:text-primary-dark transition-colors"
          >
            Same as Mobile Number
          </button>
        </div>
      ),
      containerClassName: "md:col-span-6",
    },
    email: {
      type: "email",
      value: email,
      setValue: setEmail,
      label: "Email Address",
      containerClassName: "md:col-span-6",
    },
    currency: {
      type: "select",
      value: currency,
      setValue: setCurrency,
      label: "Currency",
      options: currencies,
      containerClassName: "md:col-span-6",
    },
    country: {
      type: "select",
      value: country,
      setValue: setCountry,
      label: "Country",
      options: COUNTRIES,
      containerClassName: "md:col-span-6",
    },
    state: {
      type: "select",
      value: state,
      setValue: setStateValue,
      label: "State",
      options: states,
      containerClassName: "md:col-span-6",
    },
    address: {
      type: "textarea",
      value: address,
      setValue: setAddress,
      label: "Address",
    },
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = {
        user_id: userId,
        logo,
        favicon,
        email,
        phone,
        whatsapp,
        currency,
        country,
        state,
        address,
      };
      const res = await updateBasicSettings(payload);
      handleToast(res);
      if (res.success) fetchSettings();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching || !userId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Brand Identity Section - Moved to Top */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Brand Identity</h3>
          <p className="text-gray-600 text-sm mt-1">Make your brand shine with a beautiful logo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userId && (
            <>
              <LogoUpload value={logo} setValue={setLogo} userId={userId} />
              <FaviconUpload value={favicon} setValue={setFavicon} userId={userId} />
              
            </>
          )}
        </div>
        
      </div>

      {/* Normal Input Fields */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
          <p className="text-gray-600 text-sm mt-1">Update your business contact details</p>
        </div>
        <FormInputs inputFields={inputFields} />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isLoading} 
          isLoading={isLoading}
          className="px-8 py-2.5 text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default BasicSettings;