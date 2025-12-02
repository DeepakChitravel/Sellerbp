"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateSiteSettings } from "@/lib/api/site-settings";
import { handleToast } from "@/lib/utils";
import { InputField, siteSettings } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

interface Form {
  [key: string]: InputField & {
    starts: {
      value: string;
      setValue?: (value: string) => void;
    };
    ends: {
      value: string;
      setValue?: (value: string) => void;
    };
  };
}

interface Props {
  settingsData: siteSettings;
}

function AvailableDays({ settingsData }: Props) {
  const [isLoading, setIsLoading] = useState(false);

const [sunday, setSunday] = useState<boolean>(settingsData?.sunday ?? false);
const [sundayStarts, setSundayStarts] = useState<string>(settingsData?.sundayStarts ?? "");
const [sundayEnds, setSundayEnds] = useState<string>(settingsData?.sundayEnds ?? "");

const [monday, setMonday] = useState<boolean>(settingsData?.monday ?? false);
const [mondayStarts, setMondayStarts] = useState<string>(settingsData?.mondayStarts ?? "");
const [mondayEnds, setMondayEnds] = useState<string>(settingsData?.mondayEnds ?? "");

const [tuesday, setTuesday] = useState<boolean>(settingsData?.tuesday ?? false);
const [tuesdayStarts, setTuesdayStarts] = useState<string>(settingsData?.tuesdayStarts ?? "");
const [tuesdayEnds, setTuesdayEnds] = useState<string>(settingsData?.tuesdayEnds ?? "");

const [wednesday, setWednesday] = useState<boolean>(settingsData?.wednesday ?? false);
const [wednesdayStarts, setWednesdayStarts] = useState<string>(settingsData?.wednesdayStarts ?? "");
const [wednesdayEnds, setWednesdayEnds] = useState<string>(settingsData?.wednesdayEnds ?? "");

const [thursday, setThursday] = useState<boolean>(settingsData?.thursday ?? false);
const [thursdayStarts, setThursdayStarts] = useState<string>(settingsData?.thursdayStarts ?? "");
const [thursdayEnds, setThursdayEnds] = useState<string>(settingsData?.thursdayEnds ?? "");

const [friday, setFriday] = useState<boolean>(settingsData?.friday ?? false);
const [fridayStarts, setFridayStarts] = useState<string>(settingsData?.fridayStarts ?? "");
const [fridayEnds, setFridayEnds] = useState<string>(settingsData?.fridayEnds ?? "");

const [saturday, setSaturday] = useState<boolean>(settingsData?.saturday ?? false);
const [saturdayStarts, setSaturdayStarts] = useState<string>(settingsData?.saturdayStarts ?? "");
const [saturdayEnds, setSaturdayEnds] = useState<string>(settingsData?.saturdayEnds ?? "");


  const inputFields: Form = {
    sunday: {
      type: "switch",
      starts: {
        value: sundayStarts,
        setValue: setSundayStarts,
      },
      ends: {
        value: sundayEnds,
        setValue: setSundayEnds,
      },
      value: sunday,
      setValue: setSunday,
      label: "Sunday",
      containerClassName: "max-w-[260px] col-span-2",
    },
    monday: {
      type: "switch",
      starts: {
        value: mondayStarts,
        setValue: setMondayStarts,
      },
      ends: {
        value: mondayEnds,
        setValue: setMondayEnds,
      },
      value: monday,
      setValue: setMonday,
      label: "Monday",
    },
    tuesday: {
      type: "switch",
      starts: {
        value: tuesdayStarts,
        setValue: setTuesdayStarts,
      },
      ends: {
        value: tuesdayEnds,
        setValue: setTuesdayEnds,
      },
      value: tuesday,
      setValue: setTuesday,
      label: "Tuesday",
    },
    wednesday: {
      type: "switch",
      starts: {
        value: wednesdayStarts,
        setValue: setWednesdayStarts,
      },
      ends: {
        value: wednesdayEnds,
        setValue: setWednesdayEnds,
      },
      value: wednesday,
      setValue: setWednesday,
      label: "Wednesday",
    },
    thursday: {
      type: "switch",
      starts: {
        value: thursdayStarts,
        setValue: setThursdayStarts,
      },
      ends: {
        value: thursdayEnds,
        setValue: setThursdayEnds,
      },
      value: thursday,
      setValue: setThursday,
      label: "Thursday",
    },
    friday: {
      type: "switch",
      starts: {
        value: fridayStarts,
        setValue: setFridayStarts,
      },
      ends: {
        value: fridayEnds,
        setValue: setFridayEnds,
      },
      value: friday,
      setValue: setFriday,
      label: "Friday",
    },
    saturday: {
      type: "switch",
      starts: {
        value: saturdayStarts,
        setValue: setSaturdayStarts,
      },
      ends: {
        value: saturdayEnds,
        setValue: setSaturdayEnds,
      },
      value: saturday,
      setValue: setSaturday,
      label: "Saturday",
    },
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const data = {
        sunday,
        sundayStarts,
        sundayEnds,
        monday,
        mondayStarts,
        mondayEnds,
        tuesday,
        tuesdayStarts,
        tuesdayEnds,
        wednesday,
        wednesdayStarts,
        wednesdayEnds,
        thursday,
        thursdayStarts,
        thursdayEnds,
        friday,
        fridayStarts,
        fridayEnds,
        saturday,
        saturdayStarts,
        saturdayEnds,
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
      <div className="grid md:gap-2 gap-4">
        {Object.keys(inputFields).map((input, index) => {
          const field = inputFields[input];

          return (
            <div
              key={index}
              className="flex md:items-center justify-between flex-col md:flex-row md:gap-2 gap-4"
            >
              <div className="flex items-center justify-between md:max-w-[260px]">
                <Label className="mobile_l:w-[120px] w-[100px]">
                  {field.label}
                </Label>
                <div className="flex items-center gap-5">
                  <Switch
                    value={field.value as string}
                    onCheckedChange={(value) => {
                      field.setValue && field.setValue(value);
                    }}
                    checked={field.value as boolean}
                  />
                  <span className="text-sm font-medium leading-none text-black/50 mobile_l:block hidden w-[50px] text-right">
                    {field.value ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="flex items-center sm:flex-row flex-col gap-3">
                <Input
                  type="time"
                  className="text-sm md:w-[135px] w-full"
                  value={field.starts.value}
                  onChange={(e) => {
                    field.starts.setValue &&
                      field.starts.setValue(e.target.value);
                  }}
                />{" "}
                <span className="md:block hidden">-</span>{" "}
                <Input
                  type="time"
                  className="text-sm md:w-[135px] w-full"
                  value={field.ends.value}
                  onChange={(e) => {
                    field.ends.setValue && field.ends.setValue(e.target.value);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end mt-6">
        <Button onClick={handleSave} disabled={isLoading} isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </>
  );
}

export default AvailableDays;
