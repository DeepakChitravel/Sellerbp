"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Sticky from "../sticky";

import OtherImages from "./other-forms/other-images";
import OtherDetails from "./other-forms/other-details";
import OtherSchedule from "./other-forms/other-schedule";

import { updateAppointmentSettings } from "@/lib/api/departments";

type Props = {
  department: any;
};

/**
 * Final schedule validation before save
 * LAST gate before API call
 */
const validateSchedule = (
  schedule: any
): { valid: boolean; message?: string } => {
  if (!schedule || Object.keys(schedule).length === 0) {
    return {
      valid: false,
      message: "Please configure appointment schedule first",
    };
  }

  const hasEnabledDays = Object.keys(schedule).some(
    (day) => schedule[day]?.enabled
  );

  if (!hasEnabledDays) {
    return {
      valid: false,
      message: "Please select at least one working day",
    };
  }

  for (const day of Object.keys(schedule)) {
    const dayData = schedule[day];
    if (!dayData.enabled) continue;

    if (!dayData.slots || dayData.slots.length === 0) {
      return {
        valid: false,
        message: `${day}: Please add at least one slot`,
      };
    }

    for (let i = 0; i < dayData.slots.length; i++) {
      const slot = dayData.slots[i];
      const label = `${day} - Slot ${i + 1}`;

      if (!slot.from || !slot.to) {
        return {
          valid: false,
          message: `${label}: Working hours are required`,
        };
      }

      // Validate 24-hour format times
      const validate24HourTime = (time: string): boolean => {
        if (!time) return false;
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
      };

      if (!validate24HourTime(slot.from) || !validate24HourTime(slot.to)) {
        return {
          valid: false,
          message: `${label}: Invalid time format (must be HH:MM in 24-hour format)`,
        };
      }

      // Compare times (already in 24-hour format)
      const from = new Date(`2000-01-01 ${slot.from}`);
      const to = new Date(`2000-01-01 ${slot.to}`);
      if (from >= to) {
        return {
          valid: false,
          message: `${label}: End time must be after start time`,
        };
      }

      if (!slot.token || slot.token < 1) {
        return {
          valid: false,
          message: `${label}: Token limit must be at least 1`,
        };
      }

      // Validate break times if provided (optional)
      if (slot.breakFrom || slot.breakTo) {
        if (slot.breakFrom && !validate24HourTime(slot.breakFrom)) {
          return {
            valid: false,
            message: `${label}: Invalid break start time format`,
          };
        }
        if (slot.breakTo && !validate24HourTime(slot.breakTo)) {
          return {
            valid: false,
            message: `${label}: Invalid break end time format`,
          };
        }
      }
    }
  }

  return { valid: true };
};

const OtherForm = ({ department }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState<any>(null);
  const [hasScheduleErrors, setHasScheduleErrors] = useState(false);
  const [hasEnabledDays, setHasEnabledDays] = useState(false);

  const handleSave = async () => {
    if (!schedule) {
      toast.error("Please configure appointment schedule first");
      return;
    }

    if (hasScheduleErrors) {
      toast.error("Please fix schedule errors before saving");
      return;
    }

    const validation = validateSchedule(schedule);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    const departmentId =
      department?.departmentId || department?.department_id;

    if (!departmentId) {
      toast.error("Invalid department");
      return;
    }

    try {
      setIsLoading(true);

      const res = await updateAppointmentSettings(
        departmentId,
        schedule
      );

      if (!res?.success) {
        throw new Error(res?.message || "Failed to save schedule");
      }

      toast.success("Schedule saved successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if there are any enabled days in the schedule
  const checkEnabledDays = (scheduleData: any) => {
    if (!scheduleData) return false;
    
    const hasDays = Object.keys(scheduleData).some(
      (day) => scheduleData[day]?.enabled && scheduleData[day]?.slots?.length > 0
    );
    
    setHasEnabledDays(hasDays);
    return hasDays;
  };

  // Handle schedule updates
  const handleScheduleUpdate = (updatedSchedule: any) => {
    setSchedule(updatedSchedule);
    checkEnabledDays(updatedSchedule);
  };

  return (
    <>
      {/* MAIN CONTENT */}
      <div className="space-y-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OtherImages department={department} />
          <OtherDetails department={department} />
        </div>

        {/* Schedule */}
        <OtherSchedule
          department={department}
          onSave={handleScheduleUpdate}
          onValidationChange={setHasScheduleErrors}
        />
      </div>

      {/* SAVE BAR - Only show if there are enabled days */}
      {hasEnabledDays && (
        <Sticky>
          <Button
            onClick={handleSave}
            disabled={isLoading || hasScheduleErrors}
            isLoading={isLoading}
            className={
              hasScheduleErrors 
                ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            }
          >
            {hasScheduleErrors ? "Fix Schedule Errors First" : "Save Schedule"}
          </Button>
        </Sticky>
      )}
    </>
  );
};

export default OtherForm;