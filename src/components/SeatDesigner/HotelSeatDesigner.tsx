"use client";

import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

/* ==========================
   TYPES
========================== */
type Seat = {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
};

type Table = {
  id: string;
  x: number;
  y: number;
  seats: Seat[];
};

const newId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/* ==================================================
   ⭐ CREATE HOTEL TABLE WITH SEPARATE CHAIRS
================================================== */
const createHotelTable = (x: number, y: number): Table => {
  const tableWidth = 160;
  const tableHeight = 90;
  const offset = 60;

  return {
    id: newId(),
    x,
    y,
    seats: [
      { id: newId(), label: "C1", x: x + tableWidth / 2 - 20, y: y - offset, color: "#E5E7EB" },
      { id: newId(), label: "C2", x: x + tableWidth / 2 - 20, y: y + tableHeight + offset - 35, color: "#E5E7EB" },
      { id: newId(), label: "C3", x: x - offset, y: y + tableHeight / 2 - 20, color: "#E5E7EB" },
      { id: newId(), label: "C4", x: x + tableWidth + offset - 35, y: y + tableHeight / 2 - 20, color: "#E5E7EB" },
    ],
  };
};

/* ==================================================
   ⭐ MAIN HOTEL SEAT DESIGNER
================================================== */
export default function HotelSeatDesigner({ eventId }: { eventId: number }) {
  const [tables, setTables] = useState<Table[]>([]);
  const [popupSeat, setPopupSeat] = useState<Seat | null>(null);

  /* ================================
     LOAD DEFAULT LAYOUT
  ================================= */
  const loadHotelLayout = () => {
    const arr: Table[] = [];
    let x = 200,
      y = 200;

    for (let i = 0; i < 6; i++) {
      arr.push(createHotelTable(x, y));

      x += 350;
      if (i === 2) {
        x = 200;
        y += 300;
      }
    }
    setTables(arr);
  };

  useEffect(() => {
    loadHotelLayout();
  }, []);

  /* ================================
     SAVE LAYOUT
  ================================= */
  const saveLayout = async () => {
    const payload = {
      event_id: eventId,
      user_id: 52064,
      layout: { tables },
    };

    try {
      const res = await fetch(
        "http://localhost/managerbp/public/seller/events/save_seat_layout.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.success) toast.success("Hotel layout saved 🎉");
      else toast.error("Save failed: " + data.message);
    } catch {
      toast.error("Server error ❌");
    }
  };

  /* ================================
     RENDER UI
  ================================= */
  return (
    <div className="space-y-4 p-6">

      {/* Toolbar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow border">
        <Button onClick={loadHotelLayout}>Reset Default</Button>
        <Button onClick={saveLayout}>Save</Button>
      </div>

      {/* Canvas */}
      <div
        className="relative bg-gray-100 border rounded-xl shadow-inner overflow-scroll"
        style={{ width: "100%", height: "80vh" }}
      >
        <div style={{ width: "2000px", height: "2000px", position: "relative" }}>

          {/* TABLES */}
          {tables.map((table) => (
            <Draggable
              key={table.id}
              position={{ x: table.x, y: table.y }}
              onStop={(e, d) =>
                setTables((prev) =>
                  prev.map((t) =>
                    t.id === table.id ? { ...t, x: d.x, y: d.y } : t
                  )
                )
              }
            >
              <div
                className="absolute w-[160px] h-[90px] bg-amber-500 shadow-xl text-white rounded-lg flex items-center justify-center cursor-pointer"
              >
                Table
              </div>
            </Draggable>
          ))}

          {/* SEATS: rendered separately so dragging them won't move the table */}
          {tables.flatMap((table) =>
            table.seats.map((seat) => (
              <Draggable
                key={seat.id}
                position={{ x: seat.x, y: seat.y }}
                onStop={(e, d) =>
                  setTables((prev) =>
                    prev.map((t) =>
                      t.id === table.id
                        ? {
                            ...t,
                            seats: t.seats.map((s) =>
                              s.id === seat.id ? { ...s, x: d.x, y: d.y } : s
                            ),
                          }
                        : t
                    )
                  )
                }
              >
                <div
                  className="absolute w-10 h-10 bg-white border rounded shadow flex items-center justify-center cursor-pointer"
                  onDoubleClick={() => setPopupSeat(seat)}
                >
                  {seat.label}
                </div>
              </Draggable>
            ))
          )}
        </div>
      </div>

      {/* Seat Edit Popup */}
      <Dialog open={!!popupSeat} onOpenChange={() => setPopupSeat(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Seat</DialogTitle></DialogHeader>

          {popupSeat && (
            <div className="space-y-3">
              <input
                className="border p-2 rounded w-full"
                value={popupSeat.label}
                onChange={(e) =>
                  setPopupSeat({ ...popupSeat, label: e.target.value })
                }
              />

              <DialogFooter>
                <Button
                  onClick={() => {
                    setTables((prev) =>
                      prev.map((t) => ({
                        ...t,
                        seats: t.seats.map((s) =>
                          s.id === popupSeat.id ? popupSeat : s
                        ),
                      }))
                    );
                    setPopupSeat(null);
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </div>
          )}

        </DialogContent>
      </Dialog>

    </div>
  );
}
