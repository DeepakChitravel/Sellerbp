"use client";

import { useState, useEffect } from "react";
import { Trash2, Calendar } from "lucide-react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  value: any;
  onChange: (val: any) => void;
  onValidationChange?: (hasErrors: boolean) => void;
};

export default function WeeklyAppointment({
  value,
  onChange,
  onValidationChange,
}: Props) {
  const [schedule, setSchedule] = useState(value || {});
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  /* -------------------------------
     VALIDATION LOGIC
  -------------------------------- */
  const validateSchedule = (data: any) => {
    let hasErrors = false;

    Object.keys(data).forEach((day) => {
      if (!data[day]?.enabled) return;

      // Must have slots
      if (!data[day].slots || data[day].slots.length === 0) {
        hasErrors = true;
        return;
      }

      data[day].slots.forEach((slot: any) => {
        if (!slot.from || !slot.to) hasErrors = true;
        if (!slot.token || Number(slot.token) < 1) hasErrors = true;

        // Break validation
        if (
          (slot.breakFrom && !slot.breakTo) ||
          (!slot.breakFrom && slot.breakTo)
        ) {
          hasErrors = true;
        }
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
          ? [{ from: "", to: "", breakFrom: "", breakTo: "", token: "" }]
          : [],
      },
    };

    setSchedule(updated);
    onChange(updated);
  };

  const updateSlot = (
    day: string,
    index: number,
    key: string,
    val: string
  ) => {
    const updated = { ...schedule };
    updated[day].slots[index][key] = val;
    setSchedule(updated);
    onChange(updated);
  };

  const addSlot = (day: string) => {
    const updated = { ...schedule };
    updated[day].slots.push({
      from: "",
      to: "",
      breakFrom: "",
      breakTo: "",
      token: "",
    });
    setSchedule(updated);
    onChange(updated);
  };

  const removeSlot = (day: string, index: number) => {
    const updated = { ...schedule };
    updated[day].slots.splice(index, 1);
    setSchedule(updated);
    onChange(updated);
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
                <h3 className="font-semibold">{day} Slots</h3>

                {schedule[day].slots.map((slot: any, i: number) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg"
                  >
                    <input
                      type="time"
                      value={slot.from}
                      onChange={(e) =>
                        updateSlot(day, i, "from", e.target.value)
                      }
                      className="border p-2 rounded"
                    />

                    <input
                      type="time"
                      value={slot.to}
                      onChange={(e) =>
                        updateSlot(day, i, "to", e.target.value)
                      }
                      className="border p-2 rounded"
                    />

                    <input
                      type="number"
                      min="1"
                      value={slot.token}
                      onChange={(e) =>
                        updateSlot(day, i, "token", e.target.value)
                      }
                      className="border p-2 rounded"
                      placeholder="Token"
                    />

                    <input
                      type="time"
                      value={slot.breakFrom}
                      onChange={(e) =>
                        updateSlot(day, i, "breakFrom", e.target.value)
                      }
                      className="border p-2 rounded"
                    />

                    <input
                      type="time"
                      value={slot.breakTo}
                      onChange={(e) =>
                        updateSlot(day, i, "breakTo", e.target.value)
                      }
                      className="border p-2 rounded"
                    />

                    {schedule[day].slots.length > 1 && (
                      <button
                        className="text-red-600 text-sm flex items-center gap-1"
                        onClick={() =>
                          setConfirmDelete({ day, index: i })
                        }
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => addSlot(day)}
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded"
                >
                  + Add Slot
                </button>
              </div>
            )
        )}
      </div>

      {/* CONFIRM DELETE */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl">
            <p>Delete this slot?</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  removeSlot(confirmDelete.day, confirmDelete.index);
                  setConfirmDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
