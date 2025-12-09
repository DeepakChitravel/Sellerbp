"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function EventLocation() {
  const { register, setValue, watch } = useFormContext();

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  /* Load states when country changes */
  useEffect(() => {
    if (!selectedCountry) return;
    const stateList = State.getStatesOfCountry(selectedCountry);
    setStates(stateList);
    setValue("state", ""); // reset state
    setValue("city", "");  // reset city
    setCities([]);
  }, [selectedCountry]);

  /* Load cities when state changes */
  useEffect(() => {
    if (!selectedState) return;
    const cityList = City.getCitiesOfState(selectedCountry, selectedState);
    setCities(cityList);
    setValue("city", ""); // reset city
  }, [selectedState]);

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold mb-3">Event Location</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* COUNTRY SELECT */}
        <div>
          <label className="text-sm font-medium">Country</label>
          <Select
            onValueChange={(value) => setValue("country", value)}
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

        {/* STATE SELECT */}
        <div>
          <label className="text-sm font-medium">State</label>
          <Select
            onValueChange={(value) => setValue("state", value)}
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
                <SelectItem value="none" disabled>No states found</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* CITY SELECT */}
        <div>
          <label className="text-sm font-medium">City</label>
          <Select
            onValueChange={(value) => setValue("city", value)}
            value={watch("city") || ""}
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
                <SelectItem value="none" disabled>No cities found</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  );
}
