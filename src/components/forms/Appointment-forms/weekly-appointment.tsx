"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

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

  return (
    <>
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 space-y-6 mt-6">

        <h2 className="font-semibold text-lg">Weekly Appointment Slots</h2>

        {/* days row */}
        <div className="flex gap-3 flex-wrap">
          {days.map((day) => (
            <button
              key={day}
              className={`px-3 py-2 rounded-full border text-sm ${
                schedule[day]?.enabled
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => toggleDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        {/* slot rows */}
        {Object.keys(schedule).map(
          (day) =>
            schedule[day]?.enabled && (
              <div
                key={day}
                className="border rounded-md bg-gray-50 p-4 space-y-5"
              >
                <h3 className="font-semibold mb-1">{day} Slots</h3>

                {schedule[day].slots?.map((slot: any, i: number) => (
                  <div
                    key={i}
                    className="border-b border-gray-200 pb-4 space-y-2"
                  >
                    <div className="grid grid-cols-5 gap-3 items-end">

                      <div>
                        <label className="text-sm">Start</label>
                        <input
                          type="time"
                          className="border p-1 w-full"
                          value={slot.from}
                          onChange={(e) =>
                            updateSlot(day, i, "from", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm">End</label>
                        <input
                          type="time"
                          className="border p-1 w-full"
                          value={slot.to}
                          onChange={(e) =>
                            updateSlot(day, i, "to", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm">Tokens</label>
                        <input
                          type="number"
                          className="border p-1 w-full"
                          value={slot.token}
                          onChange={(e) =>
                            updateSlot(day, i, "token", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm">Break Start</label>
                        <input
                          type="time"
                          className="border p-1 w-full"
                          value={slot.breakFrom}
                          onChange={(e) =>
                            updateSlot(day, i, "breakFrom", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm">Break End</label>
                        <input
                          type="time"
                          className="border p-1 w-full"
                          value={slot.breakTo}
                          onChange={(e) =>
                            updateSlot(day, i, "breakTo", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* delete icon row */}
                    {schedule[day].slots.length > 1 && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => setConfirmDelete({ day, index: i })}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                        >
                          <Trash2 size={16} /> Delete Slot
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  onClick={() => addSlot(day)}
                >
                  + Add Slot
                </button>
              </div>
            )
        )}
      </div>

      {/* delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 space-y-4">
            <h3 className="text-lg font-semibold">
              Confirm Slot Delete
            </h3>
            <p className="text-gray-600 text-sm">
              Are you sure you want to delete this slot?
            </p>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => {
                  removeSlot(confirmDelete.day, confirmDelete.index);
                  setConfirmDelete(null);
                }}
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
