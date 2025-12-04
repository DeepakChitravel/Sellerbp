// components/settings/TaxSettings.tsx - CLEAN VERSION
"use client";
import FormInputs from "@/components/form-inputs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GST_TYPES, GST_PERCENTAGES } from "@/constants";
import { getTaxSettings, updateTaxSettings } from "@/lib/api/tax-settings";
import { handleToast, validateGSTIN } from "@/lib/utils";
import { InputField } from "@/types";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface TaxSettingsData {
  gstNumber?: string | null;
  gstType?: string | null;
  taxPercent?: number | null;
}

interface Props {
  initialData?: TaxSettingsData;
}

interface Form {
  [key: string]: InputField;
}

const TaxSettings = ({ initialData }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGSTDisplayed, setIsGSTDisplayed] = useState<boolean>(false);
  const [settings, setSettings] = useState<TaxSettingsData>({
    gstNumber: "",
    gstType: GST_TYPES[0]?.value || "",
    taxPercent: null
  });

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await getTaxSettings();
      
      if (response?.success && response.data) {
        const data = response.data;
        
        // Set form data from database
        setSettings({
          gstNumber: data.gst_number || "",
          gstType: data.gst_type || GST_TYPES[0]?.value || "",
          taxPercent: data.tax_percent !== null ? data.tax_percent : null
        });
        
        // Switch should be ON if any field has value in DB
        const hasAnyValue = 
          (data.gst_number && data.gst_number.trim() !== "") ||
          (data.gst_type && data.gst_type.trim() !== "") ||
          data.tax_percent !== null;
        
        setIsGSTDisplayed(hasAnyValue);
      }
    } catch (error) {
      console.error("Failed to load tax settings:", error);
      toast.error("Failed to load tax settings");
    }
    setIsLoading(false);
  };

  const inputFields: Form = {
    gstType: {
      type: "select",
      value: settings.gstType || "",
      setValue: (value) => setSettings(prev => ({ ...prev, gstType: value })),
      label: "GST Type",
      options: GST_TYPES,
      required: true,
      containerClassName: "md:col-span-6",
    },
    gstNumber: {
      type: "text",
      value: settings.gstNumber || "",
      setValue: (value) => setSettings(prev => ({ ...prev, gstNumber: value })),
      label: "GST Number",
      placeholder: "Enter GST number",
      required: true,
      containerClassName: "md:col-span-6",
    },
    taxPercent: {
      type: "select",
      value: settings.taxPercent?.toString() || "",
      setValue: (value) => setSettings(prev => ({ 
        ...prev, 
        taxPercent: value !== "" ? parseFloat(value) : null 
      })),
      label: "Tax Percentage",
      placeholder: "Select tax percentage",
      options: GST_PERCENTAGES,
      required: true,
      containerClassName: "md:col-span-6",
    },
  };

  const handleSave = async () => {
    // Validation
    if (!settings.gstNumber?.trim()) {
      toast.error("GST Number is required");
      return;
    }
    if (!settings.gstType?.trim()) {
      toast.error("GST Type is required");
      return;
    }
    if (settings.taxPercent === null || settings.taxPercent === undefined) {
      toast.error("Tax Percentage is required");
      return;
    }
    if (settings.gstNumber && !validateGSTIN(settings.gstNumber)) {
      toast.error("Invalid GST number format");
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateTaxSettings({
        gstNumber: settings.gstNumber.trim(),
        gstType: settings.gstType.trim(),
        taxPercent: settings.taxPercent
      });

      if (response.success) {
        toast.success("Tax settings saved successfully");
        setIsGSTDisplayed(true);
        await loadSettings();
      } else {
        toast.error(response.message || "Failed to save tax settings");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    }
    setIsSaving(false);
  };

  const handleSwitch = async () => {
    const newState = !isGSTDisplayed;
    
    if (newState === false) {
      // Turning OFF - Clear data from DB
      try {
        const response = await updateTaxSettings({
          gstNumber: null,
          gstType: null,
          taxPercent: null
        });
        
        if (response.success) {
          setSettings({
            gstNumber: "",
            gstType: GST_TYPES[0]?.value || "",
            taxPercent: null
          });
          setIsGSTDisplayed(false);
          toast.success("Tax settings cleared");
        }
      } catch (error) {
        toast.error("Failed to clear tax settings");
      }
    } else {
      // Turning ON - Just show form, don't touch DB
      setIsGSTDisplayed(true);
    }
  };

  const isSaveDisabled = 
    isSaving || 
    !settings.gstNumber?.trim() || 
    !settings.gstType?.trim() || 
    settings.taxPercent === null;

  if (isLoading) {
    return <div className="p-4 text-center">Loading tax settings...</div>;
  }

  return (
    <div className="bg-white rounded-xl p-5 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-medium text-lg">Tax Settings</h3>
          <p className="text-black/50 text-sm mt-1">
            Configure GST and tax percentage for your business
          </p>
        </div>
        
        <Switch
          checked={isGSTDisplayed}
          onCheckedChange={handleSwitch}
        />
      </div>

      {isGSTDisplayed && (
        <>
          <FormInputs inputFields={inputFields} />

          <div className="flex items-center justify-end mt-6">
            <Button
              onClick={handleSave}
              disabled={isSaveDisabled}
              isLoading={isSaving}
            >
              Save Tax Settings
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaxSettings;