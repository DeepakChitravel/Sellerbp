"use client";
import { Trash2, Calendar, Clock, Users, Coffee, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type SlotType = {
    from: string;
    to: string;
    breakFrom: string;
    breakTo: string;
    token: number;
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
    department: any;
    onSave?: (schedule: any) => void;
    onValidationChange?: (hasErrors: boolean) => void;
    isSaving?: boolean;
};

const formatMinutesToHours = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} min`;
};

// Convert 12-hour time to 24-hour for calculations
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
    
    // Clean the time string
    const cleanTime = time24.trim();
    
    // Check if it's already in 12-hour format with AM/PM
    if (cleanTime.toUpperCase().includes("AM") || cleanTime.toUpperCase().includes("PM")) {
        // Extract time and period
        const timePart = cleanTime.replace(/ AM| PM|am|pm/i, "").trim();
        const period = cleanTime.toUpperCase().includes("PM") ? "PM" : "AM" as "AM" | "PM";
        return { time: timePart, period };
    }
    
    // Check if it's in valid HH:MM format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(cleanTime)) {
        console.warn("Invalid time format for conversion:", cleanTime);
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

const validateSlot = (slot: SlotType): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!slot.from?.trim()) {
        errors.push("Start time is required");
    }

    if (!slot.to?.trim()) {
        errors.push("End time is required");
    }

    // Add 12-hour format validation for each time field
    if (slot.from) {
        const [hoursStr] = slot.from.split(':');
        const hours = parseInt(hoursStr);
        if (isNaN(hours) || hours < 1 || hours > 12) {
            errors.push("Start time must be in 12-hour format (01:00 to 12:59)");
        }
    }

    if (slot.to) {
        const [hoursStr] = slot.to.split(':');
        const hours = parseInt(hoursStr);
        if (isNaN(hours) || hours < 1 || hours > 12) {
            errors.push("End time must be in 12-hour format (01:00 to 12:59)");
        }
    }

    if (slot.breakFrom) {
        const [hoursStr] = slot.breakFrom.split(':');
        const hours = parseInt(hoursStr);
        if (isNaN(hours) || hours < 1 || hours > 12) {
            errors.push("Break start time must be in 12-hour format (01:00 to 12:59)");
        }
    }

    if (slot.breakTo) {
        const [hoursStr] = slot.breakTo.split(':');
        const hours = parseInt(hoursStr);
        if (isNaN(hours) || hours < 1 || hours > 12) {
            errors.push("Break end time must be in 12-hour format (01:00 to 12:59)");
        }
    }

    if (slot.from && slot.to && slot.fromPeriod && slot.toPeriod) {
        const from24 = convertTo24Hour(slot.from, slot.fromPeriod);
        const to24 = convertTo24Hour(slot.to, slot.toPeriod);
        
        const fromTime = new Date(`2000/01/01 ${from24}`);
        const toTime = new Date(`2000/01/01 ${to24}`);

        if (fromTime >= toTime) {
            errors.push("End time must be after start time");
        }
    }

    if (!slot.token || slot.token < 1) {
        errors.push("Token limit must be at least 1");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

const calculateBreakMinutes = (breakFrom: string, breakFromPeriod: "AM" | "PM", breakTo: string, breakToPeriod: "AM" | "PM") => {
    if (!breakFrom || !breakTo || !breakFromPeriod || !breakToPeriod) return 0;

    const breakFrom24 = convertTo24Hour(breakFrom, breakFromPeriod);
    const breakTo24 = convertTo24Hour(breakTo, breakToPeriod);
    
    const [fromHour, fromMin] = breakFrom24.split(":").map(Number);
    const [toHour, toMin] = breakTo24.split(":").map(Number);

    return (toHour * 60 + toMin) - (fromHour * 60 + fromMin);
};

const initializeScheduleWithDefaults = (): ScheduleType => {
    const initialSchedule: ScheduleType = {};
    days.forEach(day => {
        initialSchedule[day] = {
            enabled: false,
            slots: []
        };
    });
    return initialSchedule;
};

const parseScheduleFromDatabase = (appointmentSettings: any): ScheduleType => {
    if (!appointmentSettings) {
        console.log("No appointment settings found");
        return initializeScheduleWithDefaults();
    }

    try {
        const settings = typeof appointmentSettings === "string" 
            ? JSON.parse(appointmentSettings) 
            : appointmentSettings;

        console.log("Parsing settings:", settings);

        const parsedSchedule: ScheduleType = initializeScheduleWithDefaults();

        Object.keys(settings).forEach((day) => {
            if (days.includes(day) && settings[day]) {
                console.log(`Parsing day ${day}:`, settings[day]);
                
                parsedSchedule[day] = {
                    enabled: !!settings[day].enabled,
                    slots: (settings[day].slots || []).map((slot: any, index: number) => {
                        console.log(`Parsing slot ${index} for ${day}:`, slot);
                        
                        const from = convertTo12Hour(slot.from || "");
                        const to = convertTo12Hour(slot.to || "");
                        const breakFrom = convertTo12Hour(slot.breakFrom || "");
                        const breakTo = convertTo12Hour(slot.breakTo || "");
                        
                        console.log(`Converted slot ${index}:`, {
                            from24: slot.from,
                            from12: from,
                            to24: slot.to,
                            to12: to
                        });
                        
                        return {
                            from: from.time,
                            to: to.time,
                            breakFrom: breakFrom.time,
                            breakTo: breakTo.time,
                            token: Number(slot.token) || 0,
                            fromPeriod: from.period,
                            toPeriod: to.period,
                            breakFromPeriod: breakFrom.period,
                            breakToPeriod: breakTo.period
                        };
                    }),
                };
            }
        });

        console.log("Final parsed schedule:", parsedSchedule);
        return parsedSchedule;
    } catch (error) {
        console.error("Error parsing appointment settings:", error);
        console.error("Raw appointment settings:", appointmentSettings);
        return initializeScheduleWithDefaults();
    }
};

const calculateHours = (from: string, fromPeriod: "AM" | "PM", to: string, toPeriod: "AM" | "PM") => {
    if (!from || !to || !fromPeriod || !toPeriod) return "0.0";
    
    const from24 = convertTo24Hour(from, fromPeriod);
    const to24 = convertTo24Hour(to, toPeriod);
    
    const [fromHour, fromMin] = from24.split(':').map(Number);
    const [toHour, toMin] = to24.split(':').map(Number);
    const totalMinutes = (toHour * 60 + toMin) - (fromHour * 60 + fromMin);
    return (totalMinutes / 60).toFixed(1);
};

// Function to format schedule for API (convert to 24-hour format)
const formatScheduleForApi = (schedule: ScheduleType): any => {
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
                token: slot.token
            }))
        };
    });
    
    return formattedSchedule;
};

const OtherSchedule = ({ department, onSave, onValidationChange, isSaving = false }: Props) => {
    const [schedule, setSchedule] = useState<ScheduleType>(initializeScheduleWithDefaults());
    const [confirmDelete, setConfirmDelete] = useState<{ day: string; index: number } | null>(null);
    const [touchedSlots, setTouchedSlots] = useState<Set<string>>(new Set());
    const [hasValidationErrors, setHasValidationErrors] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!department) return;

        setLoading(true);
        console.log("Raw appointment settings from API:", department.appointmentSettings);
        
        const parsedSchedule = parseScheduleFromDatabase(department.appointmentSettings);
        console.log("Parsed schedule:", parsedSchedule);
        
        setSchedule(parsedSchedule);
        setTouchedSlots(new Set());
        setHasValidationErrors(false);
        
        // Send formatted schedule to parent
        if (onSave) {
            const formatted = formatScheduleForApi(parsedSchedule);
            console.log("Formatted for API:", formatted);
            onSave(formatted);
        }
        setLoading(false);
    }, [department]);

    useEffect(() => {
        let hasErrors = false;

        Object.keys(schedule).forEach(day => {
            if (schedule[day].enabled) {
                schedule[day].slots.forEach((slot) => {
                    const validation = validateSlot(slot);
                    if (!validation.isValid) {
                        hasErrors = true;
                    }
                });
            }
        });

        setHasValidationErrors(hasErrors);
        if (onValidationChange) {
            onValidationChange(hasErrors);
        }
    }, [schedule, onValidationChange]);

    const markSlotAsTouched = (day: string, index: number) => {
        setTouchedSlots(prev => new Set(prev).add(`${day}-${index}`));
    };

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
                        token: 0,
                        fromPeriod: "AM",
                        toPeriod: "AM",
                        breakFromPeriod: "AM",
                        breakToPeriod: "AM"
                    }]
                    : [],
            },
        };
        setSchedule(updated);

        if (onSave) {
            onSave(formatScheduleForApi(updated));
        }
    };

    const updateSlot = (day: string, index: number, key: keyof SlotType, value: any) => {
        const updated = { ...schedule };
        
        if (!updated[day].enabled) return;

        // Add validation for time fields to only accept 1-12 hours
        if (key === 'from' || key === 'to' || key === 'breakFrom' || key === 'breakTo') {
            if (value) {
                // Check if time is valid (1-12 hours)
                const [hoursStr] = value.split(':');
                const hours = parseInt(hoursStr);
                if (hoursStr && (isNaN(hours) || hours < 1 || hours > 12)) {
                    // Don't update if invalid
                    return;
                }
            }
        }

        if (key === "token") {
            const numVal = parseInt(value);
            updated[day].slots[index][key] = isNaN(numVal) ? 0 : Math.max(0, numVal);
        } else {
            updated[day].slots[index][key] = value;
        }

        setSchedule(updated);

        if (onSave) {
            onSave(formatScheduleForApi(updated));
        }

        if (value !== "") {
            markSlotAsTouched(day, index);
        }
    };

    const addSlot = (day: string) => {
        const updated = { ...schedule };

        const newSlot: SlotType = {
            from: "",
            to: "",
            breakFrom: "",
            breakTo: "",
            token: 0,
            fromPeriod: "AM",
            toPeriod: "AM",
            breakFromPeriod: "AM",
            breakToPeriod: "AM"
        };

        updated[day].slots.push(newSlot);
        setSchedule(updated);

        if (onSave) {
            onSave(formatScheduleForApi(updated));
        }
    };

    const removeSlot = (day: string, index: number) => {
        const updated = { ...schedule };
        updated[day].slots.splice(index, 1);
        setSchedule(updated);

        if (onSave) {
            onSave(formatScheduleForApi(updated));
        }

        const slotKey = `${day}-${index}`;
        setTouchedSlots(prev => {
            const newSet = new Set(prev);
            newSet.delete(slotKey);
            return newSet;
        });
    };

    const handleSaveClick = () => {
        const newTouchedSlots = new Set(touchedSlots);
        Object.keys(schedule).forEach(day => {
            if (schedule[day].enabled) {
                schedule[day].slots.forEach((_, index) => {
                    newTouchedSlots.add(`${day}-${index}`);
                });
            }
        });
        setTouchedSlots(newTouchedSlots);

        let hasErrors = false;
        let errorMessages: string[] = [];

        Object.keys(schedule).forEach(day => {
            if (schedule[day].enabled) {
                if (schedule[day].slots.length === 0) {
                    hasErrors = true;
                    errorMessages.push(`${day}: At least one time slot is required`);
                }

                schedule[day].slots.forEach((slot, index) => {
                    const validation = validateSlot(slot);
                    if (!validation.isValid) {
                        hasErrors = true;
                        validation.errors.forEach(error => {
                            errorMessages.push(`${day} - Slot ${index + 1}: ${error}`);
                        });
                    }
                });
            }
        });

        const hasEnabledDays = Object.keys(schedule).some(
            (day) => schedule[day]?.enabled
        );

        if (!hasEnabledDays) {
            toast.error("Please select at least one working day", { duration: 4000 });
            return;
        }

        if (hasErrors) {
            const firstError = errorMessages[0];
            const remainingCount = errorMessages.length - 1;

            if (remainingCount > 0) {
                toast.error(
                    <div>
                        <div className="font-semibold">{firstError}</div>
                        <div className="text-sm mt-1">+{remainingCount} more error{remainingCount > 1 ? 's' : ''}</div>
                    </div>,
                    { duration: 5000 }
                );
            } else {
                toast.error(firstError, { duration: 4000 });
            }
            return;
        }

        if (onSave) {
            const formattedSchedule = formatScheduleForApi(schedule);
            console.log("Saving formatted schedule:", formattedSchedule);
            onSave(formattedSchedule);
            toast.success("Schedule saved successfully!", { duration: 3000 });
        }
    };

    const hasEnabledDays = Object.keys(schedule).some(
        (day) => schedule[day]?.enabled
    );

    const getSlotValidation = (day: string, index: number) => {
        if (!touchedSlots.has(`${day}-${index}`)) {
            return { isValid: true, errors: [] };
        }
        return validateSlot(schedule[day].slots[index]);
    };

    if (loading) {
        return (
            <div className="p-4 md:p-6 rounded-xl bg-white shadow-sm border border-gray-200">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading schedule data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="p-4 md:p-6 rounded-xl bg-white shadow-sm border border-gray-200">
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                                    Weekly Appointment Schedule
                                </h2>
                                <p className="text-gray-500 text-xs md:text-sm">
                                    Configure weekly timings, doctor availability, and appointment slots
                                </p>
                                {department?.appointmentSettings && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span className="text-xs text-green-600">Saved schedule loaded</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleSaveClick}
                            disabled={true}
                            className="px-4 py-2.5 bg-gray-400 text-white rounded-lg text-sm font-medium cursor-not-allowed flex items-center gap-2"
                        >
                            <CheckCircle2 size={16} />
                            Use Main Save Button Below
                        </button>
                    </div>
                </div>

                <div className="mb-6 md:mb-8">
                    <h3 className="text-xs md:text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
                        Select Working Days
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                        {days.map((day) => (
                            <button
                                key={day}
                                onClick={() => toggleDay(day)}
                                className={`px-2 md:px-3 py-2.5 md:py-3 rounded-lg border text-xs md:text-sm font-medium transition-all duration-200 ${schedule[day]?.enabled
                                        ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500/20"
                                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300"
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                {!hasEnabledDays ? (
                    <div className="text-center py-8 md:py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <Calendar className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                        <h3 className="font-medium text-gray-700 mb-1 md:mb-2">No days selected</h3>
                        <p className="text-gray-500 text-xs md:text-sm max-w-md mx-auto px-4">
                            Select days above to start configuring appointment slots.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 md:space-y-6">
                        {Object.keys(schedule).map(
                            (day) =>
                                schedule[day]?.enabled && (
                                    <div
                                        key={day}
                                        className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
                                    >
                                        <div className="bg-gradient-to-r from-gray-50 to-white px-4 md:px-5 py-3 md:py-4 border-b border-gray-200">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-blue-700 font-bold text-base md:text-lg">
                                                            {day.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800 text-base md:text-lg">{day}day</h3>
                                                        <p className="text-gray-500 text-xs md:text-sm">
                                                            {schedule[day].slots.length} slot{schedule[day].slots.length !== 1 ? "s" : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => addSlot(day)}
                                                    className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs md:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 md:gap-2 w-full sm:w-auto justify-center shadow-sm hover:shadow"
                                                >
                                                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Add Slot
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-3 md:p-4 lg:p-6 space-y-3 md:space-y-4">
                                            {schedule[day].slots?.map((slot: SlotType, i: number) => {
                                                const workingHours = calculateHours(slot.from, slot.fromPeriod, slot.to, slot.toPeriod);
                                                const validation = getSlotValidation(day, i);

                                                return (
                                                    <div
                                                        key={i}
                                                        className={`border rounded-xl p-3 md:p-4 bg-white transition-all duration-200 ${validation.isValid
                                                                ? "border-gray-200 hover:border-gray-300"
                                                                : "border-red-200 bg-red-50/30"
                                                            }`}
                                                    >
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-3 mb-3 md:mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`p-1.5 md:p-2 rounded-lg ${validation.isValid ? "bg-gray-100" : "bg-red-100"
                                                                    }`}>
                                                                    <Clock className={`w-3.5 h-3.5 md:w-4 md:h-4 ${validation.isValid ? "text-gray-600" : "text-red-600"
                                                                        }`} />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`text-sm font-semibold ${validation.isValid ? "text-gray-800" : "text-red-700"
                                                                            }`}>
                                                                            Slot {i + 1}
                                                                        </span>
                                                                        {!validation.isValid && (
                                                                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {schedule[day].slots.length > 1 && (
                                                                <button
                                                                    onClick={() => setConfirmDelete({ day, index: i })}
                                                                    className="text-red-600 hover:text-red-800 text-xs md:text-sm flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors w-full sm:w-auto justify-center sm:justify-start"
                                                                >
                                                                    <Trash2 size={12} className="md:w-3.5 md:h-3.5" />
                                                                    Remove Slot
                                                                </button>
                                                            )}
                                                        </div>

                                                        {!validation.isValid && (
                                                            <div className="mb-3 md:mb-4 p-2.5 bg-red-50 border border-red-100 rounded-lg">
                                                                <ul className="space-y-1">
                                                                    {validation.errors.map((error, idx) => (
                                                                        <li key={idx} className="text-xs text-red-600 flex items-center gap-1.5">
                                                                            <AlertCircle className="w-3 h-3" />
                                                                            {error}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        <div className="space-y-4 md:space-y-6">
                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                                                                <div className="space-y-1.5">
                                                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                                                                        <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-500" />
                                                                        Working Hours *
                                                                    </label>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex-1 flex gap-2">
                                                                            <input
                                                                                type="time"
                                                                                className={`flex-1 border rounded-lg p-2 md:p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition ${validation.errors.some(e => e.includes("Start time") || e.includes("End time") || e.includes("End time must be") || e.includes("12-hour format"))
                                                                                        ? "border-red-300 bg-red-50/50"
                                                                                        : "border-gray-300"
                                                                                    }`}
                                                                                value={slot.from}
                                                                                onChange={(e) => updateSlot(day, i, "from", e.target.value)}
                                                                                onBlur={() => markSlotAsTouched(day, i)}
                                                                                required
                                                                            />
                                                                            <select
                                                                                className="w-20 border border-gray-300 rounded-lg p-2 md:p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                                                                                value={slot.fromPeriod}
                                                                                onChange={(e) => updateSlot(day, i, "fromPeriod", e.target.value)}
                                                                                onBlur={() => markSlotAsTouched(day, i)}
                                                                            >
                                                                                <option value="AM">AM</option>
                                                                                <option value="PM">PM</option>
                                                                            </select>
                                                                        </div>
                                                                        <span className="text-gray-400 text-sm">to</span>
                                                                        <div className="flex-1 flex gap-2">
                                                                            <input
                                                                                type="time"
                                                                                className={`flex-1 border rounded-lg p-2 md:p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition ${validation.errors.some(e => e.includes("Start time") || e.includes("End time") || e.includes("End time must be") || e.includes("12-hour format"))
                                                                                        ? "border-red-300 bg-red-50/50"
                                                                                        : "border-gray-300"
                                                                                    }`}
                                                                                value={slot.to}
                                                                                onChange={(e) => updateSlot(day, i, "to", e.target.value)}
                                                                                onBlur={() => markSlotAsTouched(day, i)}
                                                                                required
                                                                            />
                                                                            <select
                                                                                className="w-20 border border-gray-300 rounded-lg p-2 md:p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                                                                                value={slot.toPeriod}
                                                                                onChange={(e) => updateSlot(day, i, "toPeriod", e.target.value)}
                                                                                onBlur={() => markSlotAsTouched(day, i)}
                                                                            >
                                                                                <option value="AM">AM</option>
                                                                                <option value="PM">PM</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-xs text-gray-500 italic">
                                                                        Required field (must be in 12-hour format: 01:00 to 12:59)
                                                                    </p>
                                                                </div>

                                                                <div className="space-y-1.5">
                                                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                                                                        <Coffee className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-500" />
                                                                        Break Time
                                                                    </label>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex-1 flex gap-2">
                                                                            <input
                                                                                type="time"
                                                                                className={`flex-1 border rounded-lg p-2 md:p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition ${validation.errors.some(e => e.includes("Break") || e.includes("12-hour format"))
                                                                                        ? "border-red-300 bg-red-50/50"
                                                                                        : "border-gray-300"
                                                                                    }`}
                                                                                value={slot.breakFrom}
                                                                                onChange={(e) => updateSlot(day, i, "breakFrom", e.target.value)}
                                                                                onBlur={() => markSlotAsTouched(day, i)}
                                                                                placeholder="HH:MM"
                                                                            />
                                                                            <select
                                                                                className="w-20 border border-gray-300 rounded-lg p-2 md:p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                                                                                value={slot.breakFromPeriod}
                                                                                onChange={(e) => updateSlot(day, i, "breakFromPeriod", e.target.value)}
                                                                                onBlur={() => markSlotAsTouched(day, i)}
                                                                            >
                                                                                <option value="AM">AM</option>
                                                                                <option value="PM">PM</option>
                                                                            </select>
                                                                        </div>
                                                                        <span className="text-gray-400 text-sm">to</span>
                                                                        <div className="flex-1 flex gap-2">
                                                                            <input
                                                                                type="time"
                                                                                className={`flex-1 border rounded-lg p-2 md:p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition ${validation.errors.some(e => e.includes("Break") || e.includes("12-hour format"))
                                                                                        ? "border-red-300 bg-red-50/50"
                                                                                        : "border-gray-300"
                                                                                    }`}
                                                                                value={slot.breakTo}
                                                                                onChange={(e) => updateSlot(day, i, "breakTo", e.target.value)}
                                                                                onBlur={() => markSlotAsTouched(day, i)}
                                                                                placeholder="HH:MM"
                                                                            />
                                                                            <select
                                                                                className="w-20 border border-gray-300 rounded-lg p-2 md:p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                                                                                value={slot.breakToPeriod}
                                                                                onChange={(e) => updateSlot(day, i, "breakToPeriod", e.target.value)}
                                                                                onBlur={() => markSlotAsTouched(day, i)}
                                                                            >
                                                                                <option value="AM">AM</option>
                                                                                <option value="PM">PM</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-xs text-gray-500 italic">
                                                                        Leave both empty if no break needed (must be in 12-hour format: 01:00 to 12:59)
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                                                                <div className="space-y-1.5">
                                                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                                                                        <Users className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-500" />
                                                                        Token Limit *
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        className={`w-full border rounded-lg p-2 md:p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition ${validation.errors.some(e => e.includes("Token"))
                                                                                ? "border-red-300 bg-red-50/50"
                                                                                : "border-gray-300"
                                                                            }`}
                                                                        value={slot.token || ""}
                                                                        onChange={(e) => updateSlot(day, i, "token", e.target.value)}
                                                                        onBlur={() => markSlotAsTouched(day, i)}
                                                                        placeholder="Enter number"
                                                                        required
                                                                    />
                                                                    <p className="text-xs text-gray-500 italic">
                                                                        Required field (minimum 1)
                                                                    </p>
                                                                </div>

                                                                <div className="space-y-1.5">
                                                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                                        Session Summary
                                                                    </label>
                                                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4 space-y-1.5 md:space-y-2">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-gray-600 text-xs md:text-sm">Working Duration:</span>
                                                                            <span className={`font-semibold text-sm md:text-base ${slot.from && slot.to ? "text-gray-800" : "text-gray-400"
                                                                                }`}>
                                                                                {slot.from && slot.to ? `${workingHours} hours` : "Not set"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-gray-600 text-xs md:text-sm">
                                                                                Break Duration:
                                                                            </span>
                                                                            <span
                                                                                className={`font-semibold text-sm md:text-base ${
                                                                                    slot.breakFrom && slot.breakTo
                                                                                        ? "text-gray-800"
                                                                                        : "text-gray-400"
                                                                                }`}
                                                                            >
                                                                                {slot.breakFrom && slot.breakTo
                                                                                    ? formatMinutesToHours(
                                                                                        calculateBreakMinutes(slot.breakFrom, slot.breakFromPeriod, slot.breakTo, slot.breakToPeriod)
                                                                                    )
                                                                                    : "No break"}
                                                                            </span>
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

            {confirmDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-5 md:p-6">
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

                        <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4">
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