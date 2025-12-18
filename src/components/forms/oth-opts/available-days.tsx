"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getBusinessHours, updateBusinessHours } from "@/lib/api/available-days";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, CheckCircle, XCircle, Calendar, Zap, Settings, Save, Check } from "lucide-react";

interface Props {
  user_id?: number;
}

interface DaySchedule {
  enabled: boolean;
  startTime: string; // Format: "HH:MM" 24-hour
  endTime: string;   // Format: "HH:MM" 24-hour
}

interface BusinessHoursData {
  [key: string]: DaySchedule;
}

function AvailableDays({ user_id }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [businessHours, setBusinessHours] = useState<BusinessHoursData>({
    sunday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    monday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    tuesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    wednesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    thursday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    friday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    saturday: { enabled: false, startTime: "09:00", endTime: "17:00" },
  });

  // Refs to track if user is typing
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Refs for Apply to All inputs
  const applyStartRef = useRef<HTMLInputElement>(null);
  const applyEndRef = useRef<HTMLInputElement>(null);
  // Refs for type inputs
  const typeInputRefs = useRef<{
    [dayKey: string]: {
      start: HTMLInputElement | null;
      end: HTMLInputElement | null;
    }
  }>({});

  // Days configuration
  const days = [
    { key: 'sunday', label: 'Sunday' },
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
  ];

  // Convert 24-hour time to 12-hour with AM/PM
  const formatTimeToAMPM = (time24: string): string => {
    if (!time24 || time24 === '') return "";

    try {
      const [hours, minutes] = time24.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return time24;

      const period = hours >= 12 ? 'PM' : 'AM';
      let hours12 = hours % 12;
      if (hours12 === 0) hours12 = 12;

      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      return time24;
    }
  };

  // Time options for dropdown (in 30-minute intervals)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const time12 = formatTimeToAMPM(time24);
        options.push({ value: time24, label: time12 });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Smart auto-formatting function for AM/PM input
  const formatTimeInput = (input: string): string | null => {
    if (!input) return null;

    // Remove all non-alphanumeric characters except colon
    let cleanInput = input.replace(/[^a-zA-Z0-9:]/g, '').toUpperCase();

    // Extract numbers
    const numbers = cleanInput.replace(/[^0-9]/g, '');

    if (numbers.length === 0) return null;

    // Extract AM/PM
    const hasAM = cleanInput.includes('AM') || cleanInput.includes('A');
    const hasPM = cleanInput.includes('PM') || cleanInput.includes('P');

    let period = '';
    if (hasAM) period = 'AM';
    else if (hasPM) period = 'PM';

    // Parse hour and minute
    let hour = 0;
    let minute = 0;

    if (numbers.length <= 2) {
      // Just hour (e.g., "8" or "12")
      hour = parseInt(numbers);
    } else if (numbers.length === 3) {
      // Hour and minute without leading zero (e.g., "830" = 8:30)
      hour = parseInt(numbers.substring(0, 1));
      minute = parseInt(numbers.substring(1, 3));
    } else {
      // Hour and minute with leading zero (e.g., "0830" = 08:30)
      hour = parseInt(numbers.substring(0, 2));
      minute = parseInt(numbers.substring(2, 4));
    }

    // Validate hour (1-12 or 0-23)
    if (hour < 0 || hour > 23) return null;

    // Validate minute (0-59)
    if (minute < 0 || minute > 59) return null;

    // If hour is 0 and period is AM, convert to 12 AM
    if (hour === 0 && period === 'AM') hour = 12;

    // If hour is > 12 and no period specified, assume 24-hour format
    if (hour > 12 && !period) {
      // Convert 24-hour to 12-hour with PM
      if (hour > 12) {
        hour -= 12;
        period = 'PM';
      }
    } else if (hour <= 12 && !period) {
      // Default to AM if no period specified for 12-hour times
      period = 'AM';
    }

    // Format with leading zeros
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');

    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  // Convert formatted AM/PM to 24-hour format
  const convertAMPMto24Hour = (time12: string): string | null => {
    if (!time12 || time12 === '') return null;

    const formatted = formatTimeInput(time12);
    if (!formatted) return null;

    const [timePart, period] = formatted.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await getBusinessHours();

      if (response?.success && response.data) {
        const data = response.data;

        const newBusinessHours: BusinessHoursData = {
          sunday: {
            enabled: data.sunday === 1,
            startTime: data.sunday_starts || "09:00",
            endTime: data.sunday_ends || "17:00"
          },
          monday: {
            enabled: data.monday === 1,
            startTime: data.monday_starts || "09:00",
            endTime: data.monday_ends || "17:00"
          },
          tuesday: {
            enabled: data.tuesday === 1,
            startTime: data.tuesday_starts || "09:00",
            endTime: data.tuesday_ends || "17:00"
          },
          wednesday: {
            enabled: data.wednesday === 1,
            startTime: data.wednesday_starts || "09:00",
            endTime: data.wednesday_ends || "17:00"
          },
          thursday: {
            enabled: data.thursday === 1,
            startTime: data.thursday_starts || "09:00",
            endTime: data.thursday_ends || "17:00"
          },
          friday: {
            enabled: data.friday === 1,
            startTime: data.friday_starts || "09:00",
            endTime: data.friday_ends || "17:00"
          },
          saturday: {
            enabled: data.saturday === 1,
            startTime: data.saturday_starts || "09:00",
            endTime: data.saturday_ends || "17:00"
          },
        };

        setBusinessHours(newBusinessHours);
      }
    } catch (error) {
      console.error("Failed to load business hours:", error);
      toast.error("Failed to load business hours");
    }
    setIsLoading(false);
  };

  const handleTimeChange = (dayKey: string, field: 'startTime' | 'endTime', value: string) => {
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Format the input
    const convertedTime = convertAMPMto24Hour(value);

    if (convertedTime) {
      setBusinessHours(prev => ({
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          [field]: convertedTime
        }
      }));

      // Update Apply to All inputs if this is a valid time
      if (applyStartRef.current && field === 'startTime') {
        applyStartRef.current.value = formatTimeToAMPM(convertedTime);
      }
      if (applyEndRef.current && field === 'endTime') {
        applyEndRef.current.value = formatTimeToAMPM(convertedTime);
      }

      toast.success(`Time updated to ${formatTimeToAMPM(convertedTime)}`);
    } else if (value) {
      toast.error(`Invalid time format: "${value}". Use formats like "8:00 AM" or "08:00"`);
    }
  };

  const handleTimeSelectChange = (dayKey: string, field: 'startTime' | 'endTime', value: string) => {
    // Direct update for dropdown selection
    setBusinessHours(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value
      }
    }));

    // Update Apply to All inputs
    if (applyStartRef.current && field === 'startTime') {
      applyStartRef.current.value = formatTimeToAMPM(value);
    }
    if (applyEndRef.current && field === 'endTime') {
      applyEndRef.current.value = formatTimeToAMPM(value);
    }
  };

  const handleToggleDay = (dayKey: string, enabled: boolean) => {
    setBusinessHours(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        enabled,
        // Clear times when disabled
        startTime: enabled ? prev[dayKey].startTime : "09:00",
        endTime: enabled ? prev[dayKey].endTime : "17:00"
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await updateBusinessHours({
        sunday: businessHours.sunday.enabled ? 1 : 0,
        sunday_starts: businessHours.sunday.enabled ? businessHours.sunday.startTime : null,
        sunday_ends: businessHours.sunday.enabled ? businessHours.sunday.endTime : null,
        monday: businessHours.monday.enabled ? 1 : 0,
        monday_starts: businessHours.monday.enabled ? businessHours.monday.startTime : null,
        monday_ends: businessHours.monday.enabled ? businessHours.monday.endTime : null,
        tuesday: businessHours.tuesday.enabled ? 1 : 0,
        tuesday_starts: businessHours.tuesday.enabled ? businessHours.tuesday.startTime : null,
        tuesday_ends: businessHours.tuesday.enabled ? businessHours.tuesday.endTime : null,
        wednesday: businessHours.wednesday.enabled ? 1 : 0,
        wednesday_starts: businessHours.wednesday.enabled ? businessHours.wednesday.startTime : null,
        wednesday_ends: businessHours.wednesday.enabled ? businessHours.wednesday.endTime : null,
        thursday: businessHours.thursday.enabled ? 1 : 0,
        thursday_starts: businessHours.thursday.enabled ? businessHours.thursday.startTime : null,
        thursday_ends: businessHours.thursday.enabled ? businessHours.thursday.endTime : null,
        friday: businessHours.friday.enabled ? 1 : 0,
        friday_starts: businessHours.friday.enabled ? businessHours.friday.startTime : null,
        friday_ends: businessHours.friday.enabled ? businessHours.friday.endTime : null,
        saturday: businessHours.saturday.enabled ? 1 : 0,
        saturday_starts: businessHours.saturday.enabled ? businessHours.saturday.startTime : null,
        saturday_ends: businessHours.saturday.enabled ? businessHours.saturday.endTime : null,
      });

      if (response.success) {
        toast.success("Business hours saved successfully");
      } else {
        toast.error(response.message || "Failed to save business hours");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    }
    setIsSaving(false);
  };

  const handleSetAllDays = (enabled: boolean) => {
    const updatedHours = { ...businessHours };
    days.forEach(day => {
      updatedHours[day.key] = {
        ...updatedHours[day.key],
        enabled,
        // Reset times to defaults when enabling
        startTime: enabled ? "09:00" : updatedHours[day.key].startTime,
        endTime: enabled ? "17:00" : updatedHours[day.key].endTime
      };
    });
    setBusinessHours(updatedHours);
  };

  const handleSetAllTimes = () => {
    const startValue = applyStartRef.current?.value || "";
    const endValue = applyEndRef.current?.value || "";

    if (!startValue || !endValue) {
      toast.error("Please enter both start and end times");
      return;
    }

    // Validate inputs before applying
    const formattedStart = convertAMPMto24Hour(startValue);
    const formattedEnd = convertAMPMto24Hour(endValue);

    if (!formattedStart || !formattedEnd) {
      toast.error("Invalid time format. Use formats like '8:00 AM' or '08:00'");
      return;
    }

    const updatedHours = { ...businessHours };
    let appliedCount = 0;

    days.forEach(day => {
      if (updatedHours[day.key].enabled) {
        updatedHours[day.key] = {
          ...updatedHours[day.key],
          startTime: formattedStart,
          endTime: formattedEnd
        };
        appliedCount++;
      }
    });

    setBusinessHours(updatedHours);

    if (appliedCount > 0) {
      toast.success(`Time set to ${formatTimeToAMPM(formattedStart)} - ${formatTimeToAMPM(formattedEnd)} for ${appliedCount} open days`);
    } else {
      toast.info("No days are currently enabled. Enable days first or use 'Enable All Days'");
    }
  };

  // Handle Enter key press in type inputs - FIXED TYPE ERROR
  const handleTypeInputKeyPress = (e: React.KeyboardEvent, dayKey: string, field: 'startTime' | 'endTime') => {
    if (e.key === 'Enter') {
      const input = field === 'startTime'
        ? typeInputRefs.current[dayKey]?.start
        : typeInputRefs.current[dayKey]?.end;
      if (input && input.value) {
        handleTimeChange(dayKey, field, input.value);
        input.value = "";
      }
    }
  };

  // Handle OK button click for type inputs - FIXED TYPE ERROR
  const handleTypeInputOkClick = (dayKey: string, field: 'startTime' | 'endTime') => {
    const input = field === 'startTime'
      ? typeInputRefs.current[dayKey]?.start
      : typeInputRefs.current[dayKey]?.end;
    if (input && input.value) {
      handleTimeChange(dayKey, field, input.value);
      input.value = "";
    }
  };

  // Predefined time shortcuts
  const timeShortcuts = [
    { label: "9 AM - 5 PM", start: "9:00 AM", end: "5:00 PM" },
    { label: "8 AM - 6 PM", start: "8:00 AM", end: "6:00 PM" },
    { label: "10 AM - 7 PM", start: "10:00 AM", end: "7:00 PM" },
    { label: "8:30 AM - 5:30 PM", start: "8:30 AM", end: "5:30 PM" },
  ];

  // Get current first open day's time for Apply to All suggestion
  const getSuggestedTimes = () => {
    const openDay = days.find(day => businessHours[day.key].enabled);
    if (openDay) {
      const schedule = businessHours[openDay.key];
      return {
        start: formatTimeToAMPM(schedule.startTime),
        end: formatTimeToAMPM(schedule.endTime)
      };
    }
    return { start: "09:00 AM", end: "05:00 PM" };
  };

  const suggestedTimes = getSuggestedTimes();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-5">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-lg text-gray-800">Available Days</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Set your weekly operating hours. Disabled days will not store time data.
        </p>
      </div>

      {/* Bulk Actions */}
      <div className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-blue-600" />
          <h4 className="font-medium text-gray-800">Quick Actions</h4>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSetAllDays(true)}
              className="h-9 border-green-200 bg-green-50 hover:bg-green-100 text-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Enable All Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSetAllDays(false)}
              className="h-9 border-red-200 bg-red-50 hover:bg-red-100 text-red-700"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Disable All Days
            </Button>
          </div>

          <div className="mb-4">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Quick Time Presets:</Label>
            <div className="flex flex-wrap gap-2">
              {timeShortcuts.map((shortcut, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (applyStartRef.current) applyStartRef.current.value = shortcut.start;
                    if (applyEndRef.current) applyEndRef.current.value = shortcut.end;
                    handleSetAllTimes();
                  }}
                  className="h-8 text-xs border-gray-300 bg-white hover:bg-gray-50"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {shortcut.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-blue-600" />
              <Label className="text-sm font-medium text-gray-700">Apply to All Open Days</Label>
            </div>

            {/* FIXED: Aligned Apply to Open Days button properly */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
                <div className="space-y-1 min-w-[140px]">
                  <Label className="text-xs text-gray-500">Start Time</Label>
                  <Input
                    ref={applyStartRef}
                    type="text"
                    placeholder={suggestedTimes.start}
                    defaultValue={suggestedTimes.start}
                    className="h-9 text-sm"
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value && !convertAMPMto24Hour(value)) {
                        toast.error(`Invalid start time: "${value}". Use formats like "8:00 AM" or "08:00"`);
                        e.target.value = "";
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSetAllTimes();
                      }
                    }}
                  />
                </div>

                <div className="space-y-1 min-w-[140px]">
                  <Label className="text-xs text-gray-500">End Time</Label>
                  <Input
                    ref={applyEndRef}
                    type="text"
                    placeholder={suggestedTimes.end}
                    defaultValue={suggestedTimes.end}
                    className="h-9 text-sm"
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value && !convertAMPMto24Hour(value)) {
                        toast.error(`Invalid end time: "${value}". Use formats like "5:00 PM" or "17:00"`);
                        e.target.value = "";
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSetAllTimes();
                      }
                    }}
                  />
                </div>
              </div>

              <Button
                variant="default"
                size="sm"
                onClick={handleSetAllTimes}
                className="h-9 bg-blue-600 hover:bg-blue-700 whitespace-nowrap w-full sm:w-auto"
              >
                Apply to Open Days
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Tip: Editing any day's time will auto-fill these fields
            </p>
          </div>
        </div>
      </div>

      {/* Days Grid - FIXED LAYOUT */}
      <div className="space-y-3">
        {days.map((day) => {
          const schedule = businessHours[day.key];

          return (
            <div
              key={day.key}
              className={`flex flex-col md:flex-row md:items-start justify-between p-4 rounded-lg border transition-all ${schedule.enabled ? 'border-green-200 bg-green-50 hover:bg-green-100' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              {/* Day name and toggle */}
              <div className="flex items-center justify-between mb-3 md:mb-0 md:w-48">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${schedule.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <Label className="font-medium text-gray-700 w-28">{day.label}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={schedule.enabled}
                    onCheckedChange={(checked) => handleToggleDay(day.key, checked)}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </div>

              {schedule.enabled ? (
                <div className="flex flex-col md:flex-1 md:items-center">
                  {/* First line: Time controls - Centered */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 mb-2 w-full justify-center">
                    {/* Start Time Group */}
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-500 whitespace-nowrap">Open:</Label>
                      <div className="flex gap-1">
                        <Select
                          value={schedule.startTime}
                          onValueChange={(value) => handleTimeSelectChange(day.key, 'startTime', value)}
                        >
                          <SelectTrigger className="w-28 h-8 text-sm">
                            <SelectValue>
                              {formatTimeToAMPM(schedule.startTime)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {timeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="text-sm">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="relative flex items-center gap-1">
                          <Input
                            ref={(el) => {
                              if (!typeInputRefs.current[day.key]) {
                                typeInputRefs.current[day.key] = { start: null, end: null };
                              }
                              typeInputRefs.current[day.key].start = el;
                            }}
                            type="text"
                            placeholder="or type"
                            className="w-20 h-8 text-sm pr-8"
                            onKeyPress={(e) => handleTypeInputKeyPress(e, day.key, 'startTime')}
                          />
                          <Button
                            size="icon"
                            className="h-6 w-6 absolute right-1"
                            onClick={() => handleTypeInputOkClick(day.key, 'startTime')}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <span className="text-gray-400 hidden sm:block">-</span>

                    {/* End Time Group */}
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-500 whitespace-nowrap">Close:</Label>
                      <div className="flex gap-1">
                        <Select
                          value={schedule.endTime}
                          onValueChange={(value) => handleTimeSelectChange(day.key, 'endTime', value)}
                        >
                          <SelectTrigger className="w-28 h-8 text-sm">
                            <SelectValue>
                              {formatTimeToAMPM(schedule.endTime)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {timeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="text-sm">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="relative flex items-center gap-1">
                          <Input
                            ref={(el) => {
                              if (!typeInputRefs.current[day.key]) {
                                typeInputRefs.current[day.key] = { start: null, end: null };
                              }
                              typeInputRefs.current[day.key].end = el;
                            }}
                            type="text"
                            placeholder="or type"
                            className="w-20 h-8 text-sm pr-8"
                            onKeyPress={(e) => handleTypeInputKeyPress(e, day.key, 'endTime')}
                          />
                          <Button
                            size="icon"
                            className="h-6 w-6 absolute right-1"
                            onClick={() => handleTypeInputOkClick(day.key, 'endTime')}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second line: Time display - Centered */}
                  <div className="flex justify-center w-full">
                    <div className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded border min-w-[160px] text-center">
                      <span className="font-medium">{formatTimeToAMPM(schedule.startTime)}</span>
                      <span className="mx-2">to</span>
                      <span className="font-medium">{formatTimeToAMPM(schedule.endTime)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-sm flex items-center">
                  <Clock className="w-3 h-3 mr-2" />
                  Closed
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          isLoading={isSaving}
          className="px-6 h-10 bg-blue-600 hover:bg-blue-700"
        >

          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

    </div>
  );
}

export default AvailableDays;