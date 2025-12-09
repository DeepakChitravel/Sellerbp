"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EventLocation() {
  const { register, setValue, watch } = useFormContext();

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const selectedCity = watch("city");
  const address = watch("address") || "";
  const pincode = watch("pincode") || "";
  const mapLink = watch("map_link");

  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  /* ----------------------------------
      Load States when Country changes
  ----------------------------------- */
  useEffect(() => {
    if (!selectedCountry) return;

    const stateList = State.getStatesOfCountry(selectedCountry);
    setStates(stateList);

    setValue("state", "", { shouldValidate: false });
    setValue("city", "", { shouldValidate: false });
    setCities([]);
  }, [selectedCountry]);

  /* ----------------------------------
      Load Cities when State changes
  ----------------------------------- */
  useEffect(() => {
    if (!selectedState) return;

    const cityList = City.getCitiesOfState(selectedCountry, selectedState);
    setCities(cityList);

    setValue("city", "", { shouldValidate: false });
  }, [selectedState]);

  /* -------------------------------------------
         AUTO-GENERATE GOOGLE MAP URL
  -------------------------------------------- */
  useEffect(() => {
    if (!address && !selectedCity && !pincode) {
      setValue("map_link", "", { shouldValidate: false });
      return;
    }

    const query = encodeURIComponent(
      `${address} ${selectedCity || ""} ${pincode || ""}`
    );

    const autoMap = `https://www.google.com/maps?q=${query}&output=embed`;

    setValue("map_link", autoMap, { shouldValidate: false });
  }, [address, selectedCity, pincode]);

  const embedUrl = mapLink;

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold mb-3">Event Location</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* COUNTRY */}
        <div>
          <label className="text-sm font-medium">Country</label>
          <Select
            onValueChange={(value) =>
              setValue("country", value, { shouldValidate: false })
            }
            value={selectedCountry || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {Country.getAllCountries().map((c) => (
                <SelectItem key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* STATE */}
        <div>
          <label className="text-sm font-medium">State</label>
          <Select
            onValueChange={(value) =>
              setValue("state", value, { shouldValidate: false })
            }
            value={selectedState || ""}
            disabled={!selectedCountry}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {states.length > 0 ? (
                states.map((s) => (
                  <SelectItem key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No states found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* CITY */}
        <div>
          <label className="text-sm font-medium">City</label>
          <Select
            onValueChange={(value) =>
              setValue("city", value, { shouldValidate: false })
            }
            value={selectedCity || ""}
            disabled={!selectedState}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              {cities.length > 0 ? (
                cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No cities found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* PINCODE + ADDRESS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <div>
          <label className="text-sm font-medium">Pincode</label>
          <Input {...register("pincode")} placeholder="Enter pincode" type="text" />
        </div>

        <div>
          <label className="text-sm font-medium">Full Address</label>
          <Textarea
            {...register("address")}
            rows={3}
            placeholder="Street address, landmark, area"
          />
        </div>
      </div>

      {/* MAP PREVIEW */}
      {embedUrl && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Map Preview</h3>
          <iframe
            src={embedUrl}
            className="w-full h-64 rounded-xl border"
            loading="lazy"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
