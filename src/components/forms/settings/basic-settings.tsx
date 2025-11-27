"use client";
import FormInputs from "@/components/form-inputs";
import { Button } from "@/components/ui/button";
import { COUNTRIES, CURRENCIES } from "@/constants";
import { statesByCountry } from "@/lib/api/csc";
import { updateSiteSettings } from "@/lib/api/site-settings";
import { handleToast } from "@/lib/utils";
import { InputField, Option, siteSettings } from "@/types";
import getSymbolFromCurrency from "currency-symbol-map";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  settingsData: siteSettings;
}

interface Form {
  [key: string]: InputField;
}

const BasicSettings = ({ settingsData }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currencies, setCurrencies] = useState<Option[]>([]);
  const [states, setStates] = useState<Option[]>([]);

  const [logo, setLogo] = useState<string>(settingsData?.logo);
  const [favicon, setFavicon] = useState<string>(settingsData?.favicon);
  const [email, setEmail] = useState<string>(settingsData?.email);
  const [phone, setPhone] = useState<string>(settingsData?.phone);
  const [whatsapp, setWhatsapp] = useState<string>(settingsData?.whatsapp);
  const [currency, setCurrency] = useState<string>(settingsData?.currency);
  const [country, setCountry] = useState<string>(settingsData?.country);
  const [state, setState] = useState<string>(settingsData?.state);
  const [address, setAddress] = useState<string>(settingsData?.address);

  useEffect(() => {
    let Currencies: Option[] = [];
    CURRENCIES.map((currency) => {
      Currencies.push({
        value: currency.code,
        label: `${currency.name} (${getSymbolFromCurrency(currency.code)})`,
      });
    });

    setCurrencies(Currencies);
  }, []);

  useEffect(() => {
    async function getStates() {
      try {
        const states = await statesByCountry(country);

        let statesArray: Option[] = [];
        states.map((item: { [key: string]: string }) => {
          statesArray.push({
            value: item.iso2,
            label: item.name,
          });
        });
        setStates(statesArray);
      } catch (error) {
        console.log(error);
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
      containerClassName: "md:col-span-6",
    },
    favicon: {
      type: "file",
      value: favicon,
      setValue: setFavicon,
      label: "Favicon",
      containerClassName: "md:col-span-6",
    },
    phone: {
      type: "phone",
      value: phone,
      setValue: setPhone,
      label: "Mobile Number",
      placeholder: "Mobile Number",
      containerClassName: "md:col-span-6",
    },
    whatsapp: {
      type: "phone",
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
            className="text-primary underline"
          >
            Same as Mobile Number
          </button>
        </div>
      ),
      placeholder: "WhatsApp Number",
      containerClassName: "md:col-span-6",
    },
    email: {
      type: "email",
      value: email,
      setValue: setEmail,
      label: "Email Address",
      placeholder: "Email Address",
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
      setValue: setState,
      label: "State",
      options: states,
      containerClassName: "md:col-span-6",
    },
    address: {
      type: "textarea",
      value: address,
      setValue: setAddress,
      label: "Address",
      placeholder: "Address",
    },
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const data = {
        logo: logo,
        favicon: favicon,
        email: email,
        phone: phone,
        whatsapp: whatsapp,
        currency: currency,
        country: country,
        state: state,
        address: address,
      };

      const response = await updateSiteSettings(data);

      handleToast(response);
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <FormInputs inputFields={inputFields} />

      <div className="flex items-center justify-end mt-6">
        <Button onClick={handleSave} disabled={isLoading} isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default BasicSettings;
