"use client";

import { useState, useEffect } from "react";
import { Trash2, Calendar, Clock, Users, Coffee, Save } from "lucide-react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
    department: any;
    onSave?: (schedule: any) => void;
    isSaving?: boolean;
};

const OtherSchedule = ({ department, onSave, isSaving = false }: Props) => {
    const [schedule, setSchedule] = useState<any>({});
    const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
    const [localIsSaving, setLocalIsSaving] = useState(false);

    // Initialize schedule from department data
    useEffect(() => {
        if (department?.appointment_settings) {
            try {
                // If it's a string, parse it, otherwise use as-is
                const settings = typeof department.appointment_settings === 'string' 
                    ? JSON.parse(department.appointment_settings)
                    : department.appointment_settings;
                setSchedule(settings);
            } catch (error) {
                console.error("Error parsing appointment settings:", error);
                // Initialize empty schedule if parsing fails
                initializeEmptySchedule();
            }
        } else {
            initializeEmptySchedule();
        }
    }, [department]);

    const initializeEmptySchedule = () => {
        const initialSchedule: any = {};
        days.forEach(day => {
            initialSchedule[day] = {
                enabled: false,
                slots: []
            };
        });
        setSchedule(initialSchedule);
    };

    const toggleDay = (day: string) => {
        const enabled = !schedule[day]?.enabled;
        const updated = {
            ...schedule,
            [day]: {
                enabled,
                slots: enabled
                    ? [{ from: "09:00", to: "17:00", breakFrom: "13:00", breakTo: "14:00", token: 10 }]
                    : [],
            },
        };
        setSchedule(updated);
    };

    const updateSlot = (day: string, index: number, key: string, val: string) => {
        const updated = { ...schedule };
        if (key === "token") {
            updated[day].slots[index][key] = parseInt(val) || 10;
        } else {
            updated[day].slots[index][key] = val;
        }
        setSchedule(updated);
    };

    const addSlot = (day: string) => {
        const updated = { ...schedule };
        updated[day].slots.push({
            from: "09:00",
            to: "17:00",
            breakFrom: "13:00",
            breakTo: "14:00",
            token: 10,
        });
        setSchedule(updated);
    };

    const removeSlot = (day: string, index: number) => {
        const updated = { ...schedule };
        updated[day].slots.splice(index, 1);
        setSchedule(updated);
    };

    const handleSave = () => {
        if (onSave) {
            setLocalIsSaving(true);
            onSave(schedule);
            setTimeout(() => setLocalIsSaving(false), 1000);
        }
    };

    const hasEnabledDays = Object.keys(schedule).some(
        (day) => schedule[day]?.enabled
    );

    // Calculate hours dynamically
    const calculateHours = (from: string, to: string) => {
        const [fromHour, fromMin] = from.split(':').map(Number);
        const [toHour, toMin] = to.split(':').map(Number);
        const totalMinutes = (toHour * 60 + toMin) - (fromHour * 60 + fromMin);
        return (totalMinutes / 60).toFixed(1);
    };

    const calculateBreakHours = (breakFrom: string, breakTo: string) => {
        const [fromHour, fromMin] = breakFrom.split(':').map(Number);
        const [toHour, toMin] = breakTo.split(':').map(Number);
        const totalMinutes = (toHour * 60 + toMin) - (fromHour * 60 + fromMin);
        return (totalMinutes / 60).toFixed(1);
    };

    return (
        <>
            <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-200">
                {/* Header with Save Button */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Weekly Appointment Schedule
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    Configure weekly timings, doctor availability, and appointment slots
                                </p>
                            </div>
                        </div>
                        
                        {onSave && (
                            <button
                                onClick={handleSave}
                                disabled={isSaving || localIsSaving}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 justify-center"
                            >
                                <Save className="w-4 h-4" />
                                {(isSaving || localIsSaving) ? 'Saving...' : 'Save Schedule'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Days Selection */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
                        Select Working Days
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                        {days.map((day) => (
                            <button
                                key={day}
                                onClick={() => toggleDay(day)}
                                className={`px-3 py-3 rounded-lg border text-sm font-medium transition-all ${schedule[day]?.enabled
                                        ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Empty State */}
                {!hasEnabledDays ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="font-medium text-gray-700 mb-2">No days selected</h3>
                        <p className="text-gray-500 text-sm max-w-md mx-auto px-4">
                            Select days above to start configuring appointment slots.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Enabled Days */}
                        {Object.keys(schedule).map(
                            (day) =>
                                schedule[day]?.enabled && (
                                    <div
                                        key={day}
                                        className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                                    >
                                        {/* Day Header */}
                                        <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-200">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-blue-700 font-bold text-lg">
                                                            {day.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800 text-lg">{day}day</h3>
                                                        <p className="text-gray-500 text-sm">
                                                            {schedule[day].slots.length} slot{schedule[day].slots.length !== 1 ? "s" : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => addSlot(day)}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 w-full sm:w-auto justify-center"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Add Slot
                                                </button>
                                            </div>
                                        </div>

                                        {/* Slots Container */}
                                        <div className="p-4 sm:p-6 space-y-4">
                                            {schedule[day].slots?.map((slot: any, i: number) => {
                                                const workingHours = calculateHours(slot.from, slot.to);
                                                const breakHours = calculateBreakHours(slot.breakFrom, slot.breakTo);
                                                const availableHours = (parseFloat(workingHours) - parseFloat(breakHours)).toFixed(1);

                                                return (
                                                    <div
                                                        key={i}
                                                        className="border border-gray-200 rounded-xl p-4 sm:p-5 bg-white"
                                                    >
                                                        {/* Slot Header */}
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                                                            <div className="flex items-center gap-2">
                                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                                    <Clock className="w-4 h-4 text-gray-600" />
                                                                </div>
                                                                <div>
                                                                    <span className="text-sm font-semibold text-gray-800">
                                                                        Slot {i + 1}
                                                                    </span>
                                                                    <p className="text-xs text-gray-500">Time slot configuration</p>
                                                                </div>
                                                            </div>

                                                            {schedule[day].slots.length > 1 && (
                                                                <button
                                                                    onClick={() => setConfirmDelete({ day, index: i })}
                                                                    className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors w-full sm:w-auto justify-center sm:justify-start"
                                                                >
                                                                    <Trash2 size={14} />
                                                                    Remove Slot
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Inputs Grid */}
                                                        <div className="space-y-6">
                                                            {/* Working Hours & Break Time Row */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {/* Working Hours */}
                                                                <div className="space-y-2">
                                                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                                                                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                                                                        Working Hours
                                                                    </label>
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            type="time"
                                                                            className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                                            value={slot.from}
                                                                            onChange={(e) => updateSlot(day, i, "from", e.target.value)}
                                                                        />
                                                                        <span className="text-gray-400 text-sm">to</span>
                                                                        <input
                                                                            type="time"
                                                                            className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                                            value={slot.to}
                                                                            onChange={(e) => updateSlot(day, i, "to", e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Break Time */}
                                                                <div className="space-y-2">
                                                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                                                                        <Coffee className="w-3.5 h-3.5 text-gray-500" />
                                                                        Break Time
                                                                    </label>
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            type="time"
                                                                            className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                                            value={slot.breakFrom}
                                                                            onChange={(e) => updateSlot(day, i, "breakFrom", e.target.value)}
                                                                        />
                                                                        <span className="text-gray-400 text-sm">to</span>
                                                                        <input
                                                                            type="time"
                                                                            className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                                            value={slot.breakTo}
                                                                            onChange={(e) => updateSlot(day, i, "breakTo", e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Token Limit & Summary Row */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {/* Token Limit */}
                                                                <div className="space-y-2">
                                                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                                                                        <Users className="w-3.5 h-3.5 text-gray-500" />
                                                                        Token Limit
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                                        value={slot.token}
                                                                        onChange={(e) => updateSlot(day, i, "token", e.target.value)}
                                                                        placeholder="Enter token limit"
                                                                    />
                                                                </div>

                                                                {/* Session Summary */}
                                                                <div className="space-y-2">
                                                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                                        Session Summary
                                                                    </label>
                                                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-gray-600 text-sm">Working Duration:</span>
                                                                            <span className="font-semibold text-gray-800">{workingHours} hours</span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-gray-600 text-sm">Break Duration:</span>
                                                                            <span className="font-semibold text-gray-800">{breakHours} hour{breakHours !== "1.0" ? 's' : ''}</span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                                            <span className="text-gray-600 text-sm">Available Hours:</span>
                                                                            <span className="font-semibold text-blue-600">{availableHours} hours</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 text-lg">
                                    Delete Time Slot
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    Are you sure you want to remove this time slot? This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                            <button
                                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm flex-1 sm:flex-none"
                                onClick={() => setConfirmDelete(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium text-sm flex-1 sm:flex-none"
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
};

export default OtherSchedule;