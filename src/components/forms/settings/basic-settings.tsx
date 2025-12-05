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

  // Initialize state for BASIC FIELDS ONLY
  const [logo, setLogo] = useState<string>(settings?.logo || "");
  const [favicon, setFavicon] = useState<string>(settings?.favicon || "");
  const [email, setEmail] = useState<string>(settings?.email || "");
  const [phone, setPhone] = useState<string>(settings?.phone || "");
  const [whatsapp, setWhatsapp] = useState<string>(settings?.whatsapp || "");
  const [currency, setCurrency] = useState<string>(settings?.currency || "INR");
  const [country, setCountry] = useState<string>(settings?.country || "");
  const [state, setStateValue] = useState<string>(settings?.state || "");
  const [address, setAddress] = useState<string>(settings?.address || "");

  // Fetch settings if not provided
  useEffect(() => {
    if (!initialData) {
      fetchSettings();
    }
  }, []);

  const fetchSettings = async () => {
    setFetching(true);
    try {
      const response = await getBasicSettings();
      if (response.success && response.data) {
        setSettings(response.data);
        // Update all state values
        setLogo(response.data.logo || "");
        setFavicon(response.data.favicon || "");
        setEmail(response.data.email || "");
        setPhone(response.data.phone || "");
        setWhatsapp(response.data.whatsapp || "");
        setCurrency(response.data.currency || "INR");
        setCountry(response.data.country || "");
        setStateValue(response.data.state || "");
        setAddress(response.data.address || "");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setFetching(false);
    }
  };

  // Load currencies
  useEffect(() => {
    const Currencies: Option[] = [];
    CURRENCIES.forEach((currencyItem) => {
      Currencies.push({
        value: currencyItem.code,
        label: `${currencyItem.name} (${getSymbolFromCurrency(currencyItem.code)})`,
      });
    });
    setCurrencies(Currencies);
  }, []);

  // Load states when country changes
  useEffect(() => {
    async function getStates() {
      if (country) {
        try {
          const statesData = await statesByCountry(country);
          const statesArray: Option[] = statesData.map((item: { [key: string]: string }) => ({
            value: item.iso2,
            label: item.name,
          }));
          setStates(statesArray);
        } catch (error) {
          console.error("Error fetching states:", error);
          setStates([]);
        }
      } else {
        setStates([]);
      }
    }
    getStates();
  }, [country]);

  const inputFields: Form = {
    logo: {
      type: "file",
      value: logo,
      setValue: setLogo,
      label: "Logo",
      placeholder: "Upload logo image",
      containerClassName: "md:col-span-6",
    },
    favicon: {
      type: "file",
      value: favicon,
      setValue: setFavicon,
      label: "Favicon",
      placeholder: "Upload favicon image",
      containerClassName: "md:col-span-6",
    },
    phone: {
      type: "text",
      value: phone,
      setValue: setPhone,
      label: "Mobile Number",
      placeholder: "Enter mobile number",
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
            onClick={() => {
              setWhatsapp(phone);
            }}
            className="text-primary underline text-sm"
          >
            Same as Mobile Number
          </button>
        </div>
      ),
      placeholder: "Enter WhatsApp number",
      containerClassName: "md:col-span-6",
    },
    email: {
      type: "email",
      value: email,
      setValue: setEmail,
      label: "Email Address",
      placeholder: "Enter email address",
      containerClassName: "md:col-span-6",
    },
    currency: {
      type: "select",
      value: currency,
      setValue: setCurrency,
      label: "Currency",
      options: currencies,
      placeholder: "Select currency",
      containerClassName: "md:col-span-6",
    },
    country: {
      type: "select",
      value: country,
      setValue: setCountry,
      label: "Country",
      options: COUNTRIES,
      placeholder: "Select country",
      containerClassName: "md:col-span-6",
    },
    state: {
      type: "select",
      value: state,
      setValue: setStateValue,
      label: "State",
      options: states,
      placeholder: "Select state",
      containerClassName: "md:col-span-6",
    },
    address: {
      type: "textarea",
      value: address,
      setValue: setAddress,
      label: "Address",
      placeholder: "Enter your address",
    },
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const data = {
        logo: logo || null,
        favicon: favicon || null,
        email: email || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        currency: currency || "INR",
        country: country || null,
        state: state || null,
        address: address || null,
      };

      const response = await updateBasicSettings(data);

      handleToast(response);
      
      // Refresh settings after successful update
      if (response.success) {
        await fetchSettings();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <FormInputs inputFields={inputFields} />

      <div className="flex items-center justify-end mt-6">
        <Button onClick={handleSave} disabled={isLoading} isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default BasicSettings;