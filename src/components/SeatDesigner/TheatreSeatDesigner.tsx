"use client";

import React, { useEffect, useRef, useState } from "react";
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

/* ---------------- TYPES ---------------- */
type Seat = {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
  category: string;
  size?: number;
};

type Layout = {
  seats: Seat[];
  meta?: { snapped?: boolean; gridSize?: number; zoom?: number };
};

/* ---------------- HELPERS ---------------- */
const snap = (value: number, grid = 10) =>
  Math.round(value / grid) * grid;

const generateId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/* =====================================================
   🎭 THEATRE SEAT DESIGNER
===================================================== */
export default function TheatreSeatDesigner({
  eventId,
}: {
  eventId: number;
}) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [popup, setPopup] = useState<Seat | null>(null);

  const [snapped, setSnapped] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [zoom, setZoom] = useState(1);

  const canvasRef = useRef<HTMLDivElement>(null);

  /* ---------------- GENERATE DEFAULT THEATRE ---------------- */
  const generateTheatreLayout = (rows = 10, cols = 12): Seat[] => {
    const seatWidth = 48;
    const seatHeight = 48;
    const gapX = 12;
    const gapY = 20;

    const list: Seat[] = [];

    for (let r = 0; r < rows; r++) {
      const rowChar = String.fromCharCode(65 + r);

      for (let c = 0; c < cols; c++) {
        list.push({
          id: generateId(),
          label: `${rowChar}${c + 1}`,
          x: c * (seatWidth + gapX) + 80,
          y: r * (seatHeight + gapY) + 80,
          color: "#E5E7EB",
          category: "regular",
          size: 42,
        });
      }
    }

    return list;
  };

  /* ---------------- LOAD FROM SERVER OR DEFAULT ---------------- */
  const loadLayout = async () => {
    try {
      const res = await fetch(
        `http://localhost/managerbp/public/seller/events/get_seat_layout.php?event_id=${eventId}`
      );
      const json = await res.json();

      if (json.success && json.data) {
        setSeats(json.data.seats || []);
        setSnapped(json.data.meta?.snapped ?? true);
        setGridSize(json.data.meta?.gridSize ?? 10);
        setZoom(json.data.meta?.zoom ?? 1);
        return;
      }

      // No saved → load theatre
      setSeats(generateTheatreLayout());
    } catch (err) {
      setSeats(generateTheatreLayout());
    }
  };

  useEffect(() => {
    loadLayout();
  }, []);

  /* ---------------- SAVE ---------------- */
  const saveLayout = async () => {
    const layout: Layout = {
      seats,
      meta: { snapped, gridSize, zoom },
    };

    const payload = {
      event_id: eventId,
      user_id: 52064,
      layout,
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

      if (data.success) toast.success("Theatre layout saved!");
      else toast.error("Failed: " + data.message);
    } catch {
      toast.error("Server error!");
    }
  };

  return (
    <div className="space-y-4 p-6">
      {/* ---------- TOOLBAR ---------- */}
      <div className="flex items-center gap-3 bg-white p-4 border rounded-xl shadow">
        <Button onClick={() => setSeats(generateTheatreLayout())}>
          Reset Theatre Layout
        </Button>

        <Button variant="outline" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>
          Zoom +
        </Button>

        <Button variant="outline" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
          Zoom -
        </Button>

        <label className="flex items-center gap-2 ml-4">
          <input
            type="checkbox"
            checked={snapped}
            onChange={(e) => setSnapped(e.target.checked)}
          />
          Snap to Grid
        </label>

        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={loadLayout}>Load</Button>
          <Button onClick={saveLayout}>Save</Button>
        </div>
      </div>

      {/* ---------- CANVAS ---------- */}
      <div
        className="relative bg-gray-100 border rounded-xl shadow-inner overflow-scroll"
        style={{ width: "100%", height: "80vh" }}
      >
        <div
          ref={canvasRef}
          style={{
            width: "2000px",
            height: "2000px",
            transform: `scale(${zoom})`,
            transformOrigin: "0 0",
            position: "relative",
          }}
        >
          {/* GRID */}
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full border-l border-gray-200/40"
              style={{ left: i * gridSize }}
            />
          ))}

          {/* SEATS */}
          {seats.map((seat) => (
            <Draggable
              key={seat.id}
              position={{ x: seat.x, y: seat.y }}
              onStop={(e, d) =>
                setSeats((prev) =>
                  prev.map((s) =>
                    s.id === seat.id
                      ? {
                          ...s,
                          x: snapped ? snap(d.x, gridSize) : d.x,
                          y: snapped ? snap(d.y, gridSize) : d.y,
                        }
                      : s
                  )
                )
              }
            >
              <div
                onDoubleClick={() => setPopup(seat)}
                className="absolute w-12 h-12 rounded-lg border shadow bg-white flex items-center justify-center cursor-pointer hover:shadow-lg transition"
              >
                {seat.label}
              </div>
            </Draggable>
          ))}
        </div>
      </div>

      {/* ---------- POPUP ---------- */}
      <Dialog open={!!popup} onOpenChange={() => setPopup(null)}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Seat</DialogTitle>
          </DialogHeader>

          {popup && (
            <div className="space-y-4">
              <input
                className="border p-2 rounded w-full"
                value={popup.label}
                onChange={(e) => setPopup({ ...popup, label: e.target.value })}
              />

              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSeats(seats.filter((s) => s.id !== popup.id));
                    setPopup(null);
                  }}
                >
                  Delete
                </Button>

                <Button
                  onClick={() => {
                    setSeats(
                      seats.map((s) => (s.id === popup.id ? popup : s))
                    );
                    setPopup(null);
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
