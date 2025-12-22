"use client";

import { useState } from "react";
import { Trash2, Calendar } from "lucide-react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeeklyAppointment({ value, onChange }: any) {
  const [schedule, setSchedule] = useState(value || {});
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

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

  const updateSlot = (day: string, index: number, key: string, val: string) => {
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

  // Check if any day is enabled
  const hasEnabledDays = Object.keys(schedule).some(
    (day) => schedule[day]?.enabled
  );

  return (
    <>
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 space-y-6 mt-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-lg text-gray-800">
            Weekly Appointment Slots
          </h2>
        </div>

        {/* Days selection with better styling */}
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Select days for appointments
          </p>
          <div className="flex gap-2 flex-wrap">
            {days.map((day) => (
              <button
                key={day}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${
                  schedule[day]?.enabled
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => toggleDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state message */}
        {!hasEnabledDays && (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-medium text-gray-700 mb-1">
              No days selected
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Click on the day buttons above to start setting up your appointment slots for each day of the week.
            </p>
          </div>
        )}

        {/* Slot rows - improved styling */}
        {Object.keys(schedule).map(
          (day) =>
            schedule[day]?.enabled && (
              <div
                key={day}
                className="border border-gray-200 rounded-lg bg-white p-5 space-y-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">
                    {day} <span className="font-normal text-gray-600">Slots</span>
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {schedule[day].slots.length} slot{schedule[day].slots.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {schedule[day].slots?.map((slot: any, i: number) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {/* Time Slot */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          Start Time
                        </label>
                        <input
                          type="time"
                          className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          value={slot.from}
                          onChange={(e) =>
                            updateSlot(day, i, "from", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          End Time
                        </label>
                        <input
                          type="time"
                          className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          value={slot.to}
                          onChange={(e) =>
                            updateSlot(day, i, "to", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          Token Limit
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          value={slot.token}
                          onChange={(e) =>
                            updateSlot(day, i, "token", e.target.value)
                          }
                          placeholder="e.g., 10"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          Break Start
                        </label>
                        <input
                          type="time"
                          className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          value={slot.breakFrom}
                          onChange={(e) =>
                            updateSlot(day, i, "breakFrom", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          Break End
                        </label>
                        <input
                          type="time"
                          className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          value={slot.breakTo}
                          onChange={(e) =>
                            updateSlot(day, i, "breakTo", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Delete button - only show if more than one slot */}
                    {schedule[day].slots.length > 1 && (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => setConfirmDelete({ day, index: i })}
                          className="text-red-600 hover:text-red-800 flex items-center gap-2 text-sm font-medium px-3 py-1 hover:bg-red-50 rounded-md transition"
                        >
                          <Trash2 size={14} /> Delete Slot
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition flex items-center gap-2"
                  onClick={() => addSlot(day)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Another Slot
                </button>
              </div>
            )
        )}
      </div>

      {/* Delete confirmation modal with better styling */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Delete Slot
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-gray-700 text-sm pl-12">
              Are you sure you want to delete this time slot?
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium text-sm"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition font-medium text-sm"
                onClick={() => {
                  removeSlot(confirmDelete.day, confirmDelete.index);
                  setConfirmDelete(null);
                }}
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