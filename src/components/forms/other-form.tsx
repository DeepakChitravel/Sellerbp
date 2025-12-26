"use client";

import { useState, useEffect } from "react";
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
 * This is the LAST gate before API call
 */
const validateSchedule = (schedule: any): { valid: boolean; message?: string } => {
  // Check if any day is enabled
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
      const slotLabel = `${day} - Slot ${i + 1}`;

      // Working hours validation
      if (!slot.from || !slot.to) {
        return {
          valid: false,
          message: `${slotLabel}: Working hours are required`,
        };
      }

      // Check if start time is before end time
      const fromTime = new Date(`2000/01/01 ${slot.from}`);
      const toTime = new Date(`2000/01/01 ${slot.to}`);
      if (fromTime >= toTime) {
        return {
          valid: false,
          message: `${slotLabel}: End time must be after start time`,
        };
      }

      // Token validation
      if (!slot.token || slot.token < 1) {
        return {
          valid: false,
          message: `${slotLabel}: Token limit must be at least 1`,
        };
      }

      // Break validation (both or none)
      if ((slot.breakFrom && !slot.breakTo) || (!slot.breakFrom && slot.breakTo)) {
        return {
          valid: false,
          message: `${slotLabel}: Both break start and end times are required if you add break time`,
        };
      }

      // If both break times exist, validate them
      if (slot.breakFrom && slot.breakTo) {
        const breakFromTime = new Date(`2000/01/01 ${slot.breakFrom}`);
        const breakToTime = new Date(`2000/01/01 ${slot.breakTo}`);
        
        if (breakFromTime >= breakToTime) {
          return {
            valid: false,
            message: `${slotLabel}: Break end time must be after break start time`,
          };
        }

        // Check if break is within working hours
        if (breakFromTime < fromTime || breakToTime > toTime) {
          return {
            valid: false,
            message: `${slotLabel}: Break time must be within working hours`,
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

  // Listen for validation state from child
  const handleScheduleValidation = (hasErrors: boolean) => {
    setHasScheduleErrors(hasErrors);
  };

  // ============================
  // SAVE
  // ============================
  const handleSave = async () => {
    // 1️⃣ No schedule at all
    if (!schedule || Object.keys(schedule).length === 0) {
      toast.error("Please configure appointment schedule first");
      return;
    }

    // 2️⃣ Check if schedule has validation errors from child component
    if (hasScheduleErrors) {
      toast.error("Please fix all validation errors in the schedule");
      return;
    }

    // 3️⃣ Final validation gate
    const validation = validateSchedule(schedule);
    if (!validation.valid) {
      toast.error(validation.message);
      return; // ⛔ STOP SAVE HERE
    }

    // 4️⃣ Department ID check
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

      if (!res || !res.success) {
        throw new Error(res?.message || "Failed to save schedule");
      }

      toast.success("Schedule saved successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* MAIN CONTENT */}
      <div className="space-y-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OtherImages department={department} />
          <OtherDetails department={department} />
        </div>

        {/* Weekly Appointment Schedule */}
        <OtherSchedule
          department={department}
          onSave={setSchedule}
          onValidationChange={handleScheduleValidation}
        />
      </div>

      {/* STICKY SAVE BAR */}
      <Sticky>
        <Button 
          onClick={handleSave} 
          disabled={isLoading || hasScheduleErrors}
          isLoading={isLoading}
          className={hasScheduleErrors ? "bg-gray-400 hover:bg-gray-400" : ""}
        >
          {hasScheduleErrors ? "Fix Schedule Errors First" : "Save"}
        </Button>
      </Sticky>
    </>
  );
};

export default OtherForm;