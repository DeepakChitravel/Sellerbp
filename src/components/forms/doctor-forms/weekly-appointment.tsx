"use client";

import { useState, useEffect } from "react";
import { Trash2, Calendar } from "lucide-react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type SlotType = {
  from: string;
  to: string;
  breakFrom: string;
  breakTo: string;
  token: string;
  fromPeriod: "AM" | "PM";
  toPeriod: "AM" | "PM";
  breakFromPeriod: "AM" | "PM";
  breakToPeriod: "AM" | "PM";
};

type DayScheduleType = {
  enabled: boolean;
  slots: SlotType[];
};

type ScheduleType = {
  [key: string]: DayScheduleType;
};

type Props = {
  value: any;
  onChange: (val: any) => void;
  onValidationChange?: (hasErrors: boolean) => void;
};

// Convert 12-hour time to 24-hour format
const convertTo24Hour = (time: string, period: "AM" | "PM"): string => {
  if (!time) return "";
  
  const [hoursStr, minutes] = time.split(":");
  let hours = parseInt(hoursStr);
  
  if (period === "AM") {
    if (hours === 12) hours = 0; // 12 AM = 00
  } else { // PM
    if (hours !== 12) hours += 12; // 1 PM = 13, 12 PM = 12
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

// Convert 24-hour time to 12-hour with period
const convertTo12Hour = (time24: string): { time: string, period: "AM" | "PM" } => {
  if (!time24 || time24.trim() === "") {
    return { time: "", period: "AM" };
  }
  
  const cleanTime = time24.trim();
  
  // Check if it's already in 12-hour format with AM/PM
  if (cleanTime.toUpperCase().includes("AM") || cleanTime.toUpperCase().includes("PM")) {
    const timePart = cleanTime.replace(/ AM| PM|am|pm/i, "").trim();
    const period = cleanTime.toUpperCase().includes("PM") ? "PM" : "AM" as "AM" | "PM";
    return { time: timePart, period };
  }
  
  // Check if it's in valid HH:MM format
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(cleanTime)) {
    return { time: "", period: "AM" };
  }
  
  const [hoursStr, minutes] = cleanTime.split(":");
  let hours = parseInt(hoursStr);
  let period: "AM" | "PM" = "AM";
  
  if (hours >= 12) {
    period = "PM";
    if (hours > 12) hours -= 12;
  }
  if (hours === 0) hours = 12;
  
  return { 
    time: `${hours.toString().padStart(2, '0')}:${minutes}`, 
    period 
  };
};

// Convert schedule for database (12-hour → 24-hour)
const formatScheduleForDB = (schedule: ScheduleType): any => {
  const formattedSchedule: any = {};
  
  Object.keys(schedule).forEach(day => {
    const dayData = schedule[day];
    
    formattedSchedule[day] = {
      enabled: dayData.enabled,
      slots: dayData.slots.map(slot => ({
        from: slot.from && slot.fromPeriod ? convertTo24Hour(slot.from, slot.fromPeriod) : "",
        to: slot.to && slot.toPeriod ? convertTo24Hour(slot.to, slot.toPeriod) : "",
        breakFrom: slot.breakFrom && slot.breakFromPeriod ? convertTo24Hour(slot.breakFrom, slot.breakFromPeriod) : "",
        breakTo: slot.breakTo && slot.breakToPeriod ? convertTo24Hour(slot.breakTo, slot.breakToPeriod) : "",
        token: slot.token || "0"
      }))
    };
  });
  
  return formattedSchedule;
};

export default function WeeklyAppointment({
  value,
  onChange,
  onValidationChange,
}: Props) {
  // Initialize schedule with default values
  const initializeSchedule = (): ScheduleType => {
    const initialSchedule: ScheduleType = {};
    days.forEach(day => {
      initialSchedule[day] = {
        enabled: false,
        slots: []
      };
    });
    return initialSchedule;
  };

  // Parse incoming value (from DB 24-hour format) to UI format (12-hour with AM/PM)
  const parseValue = (val: any): ScheduleType => {
    if (!val) return initializeSchedule();
    
    try {
      const parsed = typeof val === "string" ? JSON.parse(val) : val;
      const schedule: ScheduleType = initializeSchedule();
      
      Object.keys(parsed).forEach((day) => {
        if (days.includes(day) && parsed[day]) {
          schedule[day] = {
            enabled: !!parsed[day].enabled,
            slots: (parsed[day].slots || []).map((slot: any) => {
              const from = convertTo12Hour(slot.from || "");
              const to = convertTo12Hour(slot.to || "");
              const breakFrom = convertTo12Hour(slot.breakFrom || "");
              const breakTo = convertTo12Hour(slot.breakTo || "");
              
              return {
                from: from.time,
                to: to.time,
                breakFrom: breakFrom.time,
                breakTo: breakTo.time,
                token: slot.token || "",
                fromPeriod: from.period,
                toPeriod: to.period,
                breakFromPeriod: breakFrom.period,
                breakToPeriod: breakTo.period
              };
            })
          };
        }
      });
      
      return schedule;
    } catch (error) {
      console.error("Error parsing schedule:", error);
      return initializeSchedule();
    }
  };

  const [schedule, setSchedule] = useState<ScheduleType>(() => parseValue(value));
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  /* -------------------------------
     VALIDATION LOGIC
  -------------------------------- */
  const validateSchedule = (data: ScheduleType) => {
    let hasErrors = false;

    Object.keys(data).forEach((day) => {
      if (!data[day]?.enabled) return;

      // Must have slots
      if (!data[day].slots || data[day].slots.length === 0) {
        hasErrors = true;
        return;
      }

      data[day].slots.forEach((slot: SlotType) => {
        if (!slot.from || !slot.to) hasErrors = true;
        if (!slot.token || Number(slot.token) < 1) hasErrors = true;
      });
    });

    return hasErrors;
  };

  /* Notify parent on every change */
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validateSchedule(schedule));
    }
  }, [schedule]);

  /* -------------------------------
     ACTIONS
  -------------------------------- */
  const toggleDay = (day: string) => {
    const enabled = !schedule[day]?.enabled;

    const updated = {
      ...schedule,
      [day]: {
        enabled,
        slots: enabled
          ? [{
              from: "",
              to: "",
              breakFrom: "",
              breakTo: "",
              token: "",
              fromPeriod: "AM",
              toPeriod: "AM",
              breakFromPeriod: "AM",
              breakToPeriod: "AM"
            }]
          : [],
      },
    };

    setSchedule(updated);
    // Send 24-hour format to parent
    onChange(formatScheduleForDB(updated));
  };

  const updateSlot = (
    day: string,
    index: number,
    key: keyof SlotType,
    val: string
  ) => {
    const updated = { ...schedule };
    
    if (key === "token") {
      updated[day].slots[index][key] = val;
    } else {
      updated[day].slots[index][key] = val as any;
    }
    
    setSchedule(updated);
    // Send 24-hour format to parent
    onChange(formatScheduleForDB(updated));
  };

  const addSlot = (day: string) => {
    const updated = { ...schedule };
    updated[day].slots.push({
      from: "",
      to: "",
      breakFrom: "",
      breakTo: "",
      token: "",
      fromPeriod: "AM",
      toPeriod: "AM",
      breakFromPeriod: "AM",
      breakToPeriod: "AM"
    });
    setSchedule(updated);
    // Send 24-hour format to parent
    onChange(formatScheduleForDB(updated));
  };

  const removeSlot = (day: string, index: number) => {
    const updated = { ...schedule };
    updated[day].slots.splice(index, 1);
    setSchedule(updated);
    // Send 24-hour format to parent
    onChange(formatScheduleForDB(updated));
  };

  const hasEnabledDays = Object.keys(schedule).some(
    (day) => schedule[day]?.enabled
  );

  /* -------------------------------
     UI
  -------------------------------- */
  return (
    <>
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 space-y-6 mt-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-lg text-gray-800">
            Weekly Appointment Slots
          </h2>
        </div>

        {/* DAYS */}
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Select days for appointments
          </p>
          <div className="flex gap-2 flex-wrap">
            {days.map((day) => (
              <button
                key={day}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
                  schedule[day]?.enabled
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
                onClick={() => toggleDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY STATE */}
        {!hasEnabledDays && (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              Select a day to configure slots
            </p>
          </div>
        )}

        {/* SLOTS */}
        {Object.keys(schedule).map(
          (day) =>
            schedule[day]?.enabled && (
              <div
                key={day}
                className="border border-gray-200 rounded-lg p-5 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{day} Slots</h3>
                  <button
                    onClick={() => addSlot(day)}
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    + Add Slot
                  </button>
                </div>

                {schedule[day].slots.map((slot: SlotType, i: number) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-8 gap-4 bg-gray-50 p-4 rounded-lg"
                  >
                    {/* Start Time with AM/PM */}
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Start Time *</label>
                      <div className="flex gap-1">
                        <input
                          type="time"
                          value={slot.from}
                          onChange={(e) =>
                            updateSlot(day, i, "from", e.target.value)
                          }
                          className="border p-2 rounded flex-1"
                          required
                        />
                        <select
                          value={slot.fromPeriod}
                          onChange={(e) =>
                            updateSlot(day, i, "fromPeriod", e.target.value)
                          }
                          className="border p-2 rounded w-16"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>

                    {/* End Time with AM/PM */}
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">End Time *</label>
                      <div className="flex gap-1">
                        <input
                          type="time"
                          value={slot.to}
                          onChange={(e) =>
                            updateSlot(day, i, "to", e.target.value)
                          }
                          className="border p-2 rounded flex-1"
                          required
                        />
                        <select
                          value={slot.toPeriod}
                          onChange={(e) =>
                            updateSlot(day, i, "toPeriod", e.target.value)
                          }
                          className="border p-2 rounded w-16"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>

                    {/* Token */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Token Limit *</label>
                      <input
                        type="number"
                        min="1"
                        value={slot.token}
                        onChange={(e) =>
                          updateSlot(day, i, "token", e.target.value)
                        }
                        className="border p-2 rounded w-full"
                        placeholder="Tokens"
                        required
                      />
                    </div>

                    {/* Break Start Time with AM/PM */}
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Break Start</label>
                      <div className="flex gap-1">
                        <input
                          type="time"
                          value={slot.breakFrom}
                          onChange={(e) =>
                            updateSlot(day, i, "breakFrom", e.target.value)
                          }
                          className="border p-2 rounded flex-1"
                          placeholder="HH:MM"
                        />
                        <select
                          value={slot.breakFromPeriod}
                          onChange={(e) =>
                            updateSlot(day, i, "breakFromPeriod", e.target.value)
                          }
                          className="border p-2 rounded w-16"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>

                    {/* Break End Time with AM/PM */}
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Break End</label>
                      <div className="flex gap-1">
                        <input
                          type="time"
                          value={slot.breakTo}
                          onChange={(e) =>
                            updateSlot(day, i, "breakTo", e.target.value)
                          }
                          className="border p-2 rounded flex-1"
                          placeholder="HH:MM"
                        />
                        <select
                          value={slot.breakToPeriod}
                          onChange={(e) =>
                            updateSlot(day, i, "breakToPeriod", e.target.value)
                          }
                          className="border p-2 rounded w-16"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>

                    {/* Delete Button */}
                    {schedule[day].slots.length > 1 && (
                      <div className="flex items-end">
                        <button
                          className="text-red-600 text-sm flex items-center gap-1 hover:text-red-800"
                          onClick={() =>
                            setConfirmDelete({ day, index: i })
                          }
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
        )}
      </div>

      {/* CONFIRM DELETE */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <p className="font-medium mb-4">Delete this time slot?</p>
            <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  removeSlot(confirmDelete.day, confirmDelete.index);
                  setConfirmDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}