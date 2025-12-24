"use client";

import { InputField, DepartmentTypeFormProps } from "@/types";
import FormInputs from "@/components/form-inputs";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Form {
  [key: string]: InputField;
}

interface TypeField {
  id: number;
  index: number;
  nameKey: string;
  amountKey: string;
}

const DepartmentInformation = ({
  name,
  slug,
  typeMainName,
  typeMainAmount,
  type1Name,
  type1Amount,
  type2Name,
  type2Amount,
  type3Name,
  type3Amount,
  type4Name,
  type4Amount,
  type5Name,
  type5Amount,
  type6Name,
  type6Amount,
  type7Name,
  type7Amount,
  type8Name,
  type8Amount,
  type9Name,
  type9Amount,
  type10Name,
  type10Amount,
  type11Name,
  type11Amount,
  type12Name,
  type12Amount,
  type13Name,
  type13Amount,
  type14Name,
  type14Amount,
  type15Name,
  type15Amount,
  type16Name,
  type16Amount,
  type17Name,
  type17Amount,
  type18Name,
  type18Amount,
  type19Name,
  type19Amount,
  type20Name,
  type20Amount,
  type21Name,
  type21Amount,
  type22Name,
  type22Amount,
  type23Name,
  type23Amount,
  type24Name,
  type24Amount,
  type25Name,
  type25Amount
}: DepartmentTypeFormProps) => {

  const [activeTypeFields, setActiveTypeFields] = useState<TypeField[]>([
    { id: 0, index: 0, nameKey: "typeMainName", amountKey: "typeMainAmount" }
  ]);

  // Initialize additional type fields that have data
// Initialize additional type fields that have data
useEffect(() => {
  const typeProps = [
    { valueName: type1Name?.value, valueAmount: type1Amount?.value, index: 1 },
    { valueName: type2Name?.value, valueAmount: type2Amount?.value, index: 2 },
    { valueName: type3Name?.value, valueAmount: type3Amount?.value, index: 3 },
    { valueName: type4Name?.value, valueAmount: type4Amount?.value, index: 4 },
    { valueName: type5Name?.value, valueAmount: type5Amount?.value, index: 5 },
    { valueName: type6Name?.value, valueAmount: type6Amount?.value, index: 6 },
    { valueName: type7Name?.value, valueAmount: type7Amount?.value, index: 7 },
    { valueName: type8Name?.value, valueAmount: type8Amount?.value, index: 8 },
    { valueName: type9Name?.value, valueAmount: type9Amount?.value, index: 9 },
    { valueName: type10Name?.value, valueAmount: type10Amount?.value, index: 10 },
    { valueName: type11Name?.value, valueAmount: type11Amount?.value, index: 11 },
    { valueName: type12Name?.value, valueAmount: type12Amount?.value, index: 12 },
    { valueName: type13Name?.value, valueAmount: type13Amount?.value, index: 13 },
    { valueName: type14Name?.value, valueAmount: type14Amount?.value, index: 14 },
    { valueName: type15Name?.value, valueAmount: type15Amount?.value, index: 15 },
    { valueName: type16Name?.value, valueAmount: type16Amount?.value, index: 16 },
    { valueName: type17Name?.value, valueAmount: type17Amount?.value, index: 17 },
    { valueName: type18Name?.value, valueAmount: type18Amount?.value, index: 18 },
    { valueName: type19Name?.value, valueAmount: type19Amount?.value, index: 19 },
    { valueName: type20Name?.value, valueAmount: type20Amount?.value, index: 20 },
    { valueName: type21Name?.value, valueAmount: type21Amount?.value, index: 21 },
    { valueName: type22Name?.value, valueAmount: type22Amount?.value, index: 22 },
    { valueName: type23Name?.value, valueAmount: type23Amount?.value, index: 23 },
    { valueName: type24Name?.value, valueAmount: type24Amount?.value, index: 24 },
    { valueName: type25Name?.value, valueAmount: type25Amount?.value, index: 25 },
  ];

  const fieldsWithData: TypeField[] = [];

  typeProps.forEach((prop) => {
    if (prop.valueName || prop.valueAmount) {
      fieldsWithData.push({
        id: prop.index,
        index: prop.index,
        nameKey: `type${prop.index}Name`,
        amountKey: `type${prop.index}Amount`,
      });
    }
  });

  setActiveTypeFields((prev) => {
    const existing = prev.map((f) => f.index);
    const newOnes = fieldsWithData.filter((f) => !existing.includes(f.index));
    return [...prev, ...newOnes].sort((a, b) => a.index - b.index);
  });
}, [type1Name, type2Name, type3Name, type4Name, type5Name]);


  const addTypeField = () => {
    const usedIndices = activeTypeFields.map(f => f.index);
    let nextIndex = 1;

    while (usedIndices.includes(nextIndex) && nextIndex <= 25) {
      nextIndex++;
    }

    if (nextIndex > 25) {
      alert("Maximum additional type fields reached (25)");
      return;
    }

    const newField: TypeField = {
      id: nextIndex,
      index: nextIndex,
      nameKey: `type${nextIndex}Name`,
      amountKey: `type${nextIndex}Amount`
    };

    setActiveTypeFields(prev => [...prev, newField].sort((a, b) => a.index - b.index));
  };

  const removeTypeField = (index: number) => {
    if (index === 0) {
      // Clear main type values but don't remove
      typeMainName?.setValue("");
      typeMainAmount?.setValue("");
      return;
    }

    setActiveTypeFields(prev => prev.filter(field => field.index !== index));
    
    // Clear values for the removed field
    const setters: any = {
      1: { name: type1Name?.setValue, amount: type1Amount?.setValue },
      2: { name: type2Name?.setValue, amount: type2Amount?.setValue },
      3: { name: type3Name?.setValue, amount: type3Amount?.setValue },
      4: { name: type4Name?.setValue, amount: type4Amount?.setValue },
      5: { name: type5Name?.setValue, amount: type5Amount?.setValue },
      6: { name: type6Name?.setValue, amount: type6Amount?.setValue },
      7: { name: type7Name?.setValue, amount: type7Amount?.setValue },
      8: { name: type8Name?.setValue, amount: type8Amount?.setValue },
      9: { name: type9Name?.setValue, amount: type9Amount?.setValue },
      10: { name: type10Name?.setValue, amount: type10Amount?.setValue },
      11: { name: type11Name?.setValue, amount: type11Amount?.setValue },
      12: { name: type12Name?.setValue, amount: type12Amount?.setValue },
      13: { name: type13Name?.setValue, amount: type13Amount?.setValue },
      14: { name: type14Name?.setValue, amount: type14Amount?.setValue },
      15: { name: type15Name?.setValue, amount: type15Amount?.setValue },
      16: { name: type16Name?.setValue, amount: type16Amount?.setValue },
      17: { name: type17Name?.setValue, amount: type17Amount?.setValue },
      18: { name: type18Name?.setValue, amount: type18Amount?.setValue },
      19: { name: type19Name?.setValue, amount: type19Amount?.setValue },
      20: { name: type20Name?.setValue, amount: type20Amount?.setValue },
      21: { name: type21Name?.setValue, amount: type21Amount?.setValue },
      22: { name: type22Name?.setValue, amount: type22Amount?.setValue },
      23: { name: type23Name?.setValue, amount: type23Amount?.setValue },
      24: { name: type24Name?.setValue, amount: type24Amount?.setValue },
      25: { name: type25Name?.setValue, amount: type25Amount?.setValue }
    };

    if (setters[index]) {
      setters[index].name?.("");
      setters[index].amount?.("");
    }
  };

  // Helper to get field value and setter
  const getFieldProps = (index: number, fieldType: 'name' | 'amount') => {
    let prop;

    if (index === 0) {
      prop = fieldType === "name" ? typeMainName : typeMainAmount;
    } else {
      const props: any = {
        1: { name: type1Name, amount: type1Amount },
        2: { name: type2Name, amount: type2Amount },
        3: { name: type3Name, amount: type3Amount },
        4: { name: type4Name, amount: type4Amount },
        5: { name: type5Name, amount: type5Amount },
        6: { name: type6Name, amount: type6Amount },
        7: { name: type7Name, amount: type7Amount },
        8: { name: type8Name, amount: type8Amount },
        9: { name: type9Name, amount: type9Amount },
        10: { name: type10Name, amount: type10Amount },
        11: { name: type11Name, amount: type11Amount },
        12: { name: type12Name, amount: type12Amount },
        13: { name: type13Name, amount: type13Amount },
        14: { name: type14Name, amount: type14Amount },
        15: { name: type15Name, amount: type15Amount },
        16: { name: type16Name, amount: type16Amount },
        17: { name: type17Name, amount: type17Amount },
        18: { name: type18Name, amount: type18Amount },
        19: { name: type19Name, amount: type19Amount },
        20: { name: type20Name, amount: type20Amount },
        21: { name: type21Name, amount: type21Amount },
        22: { name: type22Name, amount: type22Amount },
        23: { name: type23Name, amount: type23Amount },
        24: { name: type24Name, amount: type24Amount },
        25: { name: type25Name, amount: type25Amount },
      };

      prop = props[index]?.[fieldType];
    }

    return {
      value: prop?.value ?? "",
      setValue: (v: string) => {
        if (prop?.setValue) {
          prop.setValue(v);
        }
      }
    };
  };

  const inputFields: Form = {
    name: {
      type: "text",
      value: name?.value || "",
      setValue: name?.setValue || (() => { }),
      placeholder: "Enter department name",
      label: "Department Name",
      required: true,
    },
    slug: {
      type: "text",
      value: slug?.value || "",
      setValue: slug?.setValue || (() => { }),
      placeholder: "Enter department slug",
      label: "Department Slug (optional)",
    },
  };

  return (
    <div className="bg-white rounded-xl p-5">
      <div className="mb-9 space-y-1.5">
        <h3 className="font-medium">Department Information</h3>
        <p className="text-black/50 text-sm font-medium">
          Easily input essential details like name, type and slug to showcase your department.
        </p>
      </div>

      <FormInputs inputFields={inputFields} />

      {/* Type Configuration Section */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Type Configuration</h4>
          <span className="text-sm text-gray-500">
            {activeTypeFields.filter(f => f.index > 0).length}/25 additional types
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Configure types with names and amounts. <strong>Main type is required.</strong> Add up to 25 additional types.
        </p>

        <div className="space-y-6">
          {/* All Type Fields */}
          {activeTypeFields.map((field) => {
            const nameProps = getFieldProps(field.index, 'name');
            const amountProps = getFieldProps(field.index, 'amount');

            return (
              <div
                key={field.id}
                className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg relative border ${field.index === 0
                    ? 'bg-blue-50 border-blue-100'
                    : 'bg-gray-50 border-gray-200'
                  }`}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.index === 0 ? "Main Type Name" : `Type ${field.index} Name`}
                    {field.index === 0 && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type="text"
                    value={nameProps.value}
                    onChange={(e) => nameProps.setValue?.(e.target.value)}
                    placeholder={field.index === 0 ? "Enter main type name (required)" : `Enter type ${field.index} name`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={field.index === 0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.index === 0 ? "Main Type Amount" : `Type ${field.index} Amount`}
                    {field.index === 0 && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={amountProps.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        amountProps.setValue(value);
                      }}
                      placeholder={field.index === 0 ? "Enter amount (required)" : "Enter amount"}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={field.index === 0}
                    />
                    {field.index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeTypeField(field.index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors flex items-center justify-center"
                        title="Remove type"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Type Button */}
          {activeTypeFields.filter(f => f.index > 0).length < 25 && (
            <button
              type="button"
              onClick={addTypeField}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-colors w-full bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
            >
              <Plus size={20} />
              Add Additional Type Field
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentInformation;