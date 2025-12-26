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

      if (
        (slot.breakFrom && !slot.breakTo) ||
        (!slot.breakFrom && slot.breakTo)
      ) {
        return {
          valid: false,
          message: `${label}: Both break times are required`,
        };
      }

      if (slot.breakFrom && slot.breakTo) {
        const bf = new Date(`2000-01-01 ${slot.breakFrom}`);
        const bt = new Date(`2000-01-01 ${slot.breakTo}`);

        if (bf >= bt) {
          return {
            valid: false,
            message: `${label}: Break end must be after start`,
          };
        }

        if (bf < from || bt > to) {
          return {
            valid: false,
            message: `${label}: Break must be within working hours`,
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
          department={department}   // 👈 contains appointmentSettings
          onSave={setSchedule}
          onValidationChange={setHasScheduleErrors}
        />
      </div>

      {/* SAVE BAR */}
      <Sticky>
        <Button
          onClick={handleSave}
          disabled={isLoading || hasScheduleErrors}
          isLoading={isLoading}
          className={
            hasScheduleErrors ? "bg-gray-400 hover:bg-gray-400" : ""
          }
        >
          {hasScheduleErrors ? "Fix Schedule Errors First" : "Save"}
        </Button>
      </Sticky>
    </>
  );
};

export default OtherForm;
