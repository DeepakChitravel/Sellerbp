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

/* ================================
   TYPES
================================= */
type Seat = {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
  category: string;
  size?: number;
};

type Table = {
  id: string;
  x: number;
  y: number;
  size: number;
  shape: "round" | "square";
  seats: Seat[];
  radius?: number;
};

type Layout = {
  seats: Seat[];
  tables: Table[];
  meta?: { snapped?: boolean; gridSize?: number; zoom?: number };
};

/* ================================
   DEFAULT CATEGORY COLORS
================================= */
const categories = [
  { id: "regular", name: "Regular", color: "#E5E7EB" },
  { id: "vip", name: "VIP", color: "#A855F7" },
  { id: "balcony", name: "Balcony", color: "#22C55E" },
];

const snap = (value: number, size = 10) =>
  Math.round(value / size) * size;

/* ================================
   MAIN COMPONENT
================================= */

export default function SeatDesigner({
  eventId,
  initialLoad = true,
}: {
  eventId: number;
  initialLoad?: boolean;
}) {
  /* ---- STATES ---- */
  const [seats, setSeats] = useState<Seat[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [popup, setPopup] = useState<Seat | Table | null>(null);
  const [popupType, setPopupType] = useState<"seat" | "table" | null>(null);

  const [snapped, setSnapped] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [zoom, setZoom] = useState(1);

  const canvasRef = useRef<HTMLDivElement>(null);

  /* ID generator */
  const newId = () =>
    `${Date.now().toString(36)}${Math.random()
      .toString(36)
      .substring(2, 6)}`;

  /* ================================
     THEATRE ROW GENERATOR
  ================================= */
  const generateTheatre = (rows = 10, cols = 12): Seat[] => {
    const seatWidth = 48;
    const seatHeight = 48;
    const gapX = 12;
    const gapY = 20;

    const list: Seat[] = [];

    for (let r = 0; r < rows; r++) {
      const rowChar = String.fromCharCode(65 + r);

      for (let c = 0; c < cols; c++) {
        list.push({
          id: newId(),
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

  /* ================================
     ADD SEAT
  ================================= */
  const addSeat = () => {
    const s: Seat = {
      id: newId(),
      x: 150,
      y: 150,
      label: "Seat",
      color: "#E5E7EB",
      category: "regular",
      size: 42,
    };

    setSeats((prev) => [...prev, s]);
    setPopup(s);
    setPopupType("seat");
  };

  /* ================================
     ADD TABLE + SEATS
  ================================= */
  const addTable = () => {
    const centerX = 300;
    const centerY = 200;
    const seatCount = 6;
    const radius = 60;

    const tSeats = Array.from({ length: seatCount }).map((_, i) => {
      const angle = (i / seatCount) * Math.PI * 2;

      return {
        id: newId(),
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        label: `S${i + 1}`,
        color: "#E5E7EB",
        category: "regular",
        size: 32,
      };
    });

    const tbl: Table = {
      id: newId(),
      x: centerX,
      y: centerY,
      size: seatCount,
      shape: "round",
      radius,
      seats: tSeats,
    };

    setTables((prev) => [...prev, tbl]);
    setPopup(tbl);
    setPopupType("table");
  };

  /* ================================
      SAVE
  ================================= */
const saveLayout = async () => {
  const layout: Layout = { seats, tables, meta: { snapped, gridSize, zoom } };

  const payload = {
    event_id: eventId,
    user_id: 52064,   // logged-in seller ID
    layout
  };

  console.log("Saving layout payload:", payload);

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
    console.log("Save response:", data);

    if (data.success) {
      toast.success("Seat layout saved successfully! 🎉");
    } else {
      toast.error("Failed to save layout: " + data.message);
    }

  } catch (err) {
    console.error(err);
    toast.error("Server error while saving layout ❌");
  }
};



  /* ================================
      LOAD (OR DEFAULT THEATRE)
  ================================= */
  const loadLayout = async () => {
    try {
      const res = await fetch(
        `http://localhost/managerbp/public/seller/events/get_seat_layout.php?event_id=${eventId}`
      );
      const json = await res.json();

      if (json.success && json.data) {
        setSeats(json.data.seats || []);
        setTables(json.data.tables || []);
        setSnapped(json.data.meta?.snapped ?? true);
        setGridSize(json.data.meta?.gridSize ?? 10);
        setZoom(json.data.meta?.zoom ?? 1);
        return;
      }

      console.log("🎭 No saved layout → Loading theatre layout");
      setSeats(generateTheatre());
    } catch (err) {
      console.error(err);
      setSeats(generateTheatre());
    }
  };

  useEffect(() => {
    if (initialLoad) loadLayout();
  }, []);

  /* ================================
      RENDER UI
  ================================= */
  return (
    <div className="space-y-4 p-6">

      {/* TOOLBAR */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow border">
        <Button onClick={addSeat}>➕ Add Seat</Button>
        <Button onClick={addTable}>🪑 Add Table</Button>

        <Button variant="outline" onClick={() => setZoom((z) => Math.min(2, z + 0.1))}>
          Zoom +
        </Button>
        <Button variant="outline" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>
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

      {/* CANVAS WRAPPER */}
      <div
        className="relative bg-gray-100 border rounded-xl shadow-inner overflow-scroll"
        style={{ width: "100%", height: "80vh" }}
      >

        {/* CANVAS */}
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

          {/* GRID LINES */}
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full border-l border-gray-200/40"
              style={{ left: i * gridSize }}
            />
          ))}

          {/* =========================
              RENDER SEATS
          ========================== */}
          {seats.map((s) => (
            <Draggable
              key={s.id}
              position={{ x: s.x, y: s.y }}
              onStop={(e, d) =>
                setSeats((prev) =>
                  prev.map((x) =>
                    x.id === s.id
                      ? { ...x, x: snapped ? snap(d.x, gridSize) : d.x, y: snapped ? snap(d.y, gridSize) : d.y }
                      : x
                  )
                )
              }
            >
              <div
                onDoubleClick={() => {
                  setPopup(s);
                  setPopupType("seat");
                }}
                className="absolute w-12 h-12 rounded-lg shadow-sm border flex items-center justify-center cursor-pointer hover:shadow-lg transition"
                style={{ backgroundColor: s.color }}
              >
                {s.label}
              </div>
            </Draggable>
          ))}

          {/* =========================
              RENDER TABLES + TABLE SEATS
          ========================== */}
          {tables.map((t) => (
            <Draggable
              key={t.id}
              position={{ x: t.x, y: t.y }}
              onStop={(e, d) =>
                setTables((tbl) =>
                  tbl.map((x) =>
                    x.id === t.id
                      ? {
                          ...x,
                          x: snapped ? snap(d.x, gridSize) : d.x,
                          y: snapped ? snap(d.y, gridSize) : d.y,
                          seats: x.seats.map((s) => ({
                            ...s,
                            x: s.x + (d.x - x.x),
                            y: s.y + (d.y - x.y),
                          })),
                        }
                      : x
                  )
                )
              }
            >
              <div className="absolute">

                <div
                  className="flex items-center justify-center shadow-xl text-white cursor-pointer"
                  onDoubleClick={() => {
                    setPopup(t);
                    setPopupType("table");
                  }}
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: t.shape === "round" ? "50%" : "16px",
                    background: "#FB923C",
                  }}
                >
                  Table ({t.size})
                </div>

                {t.seats.map((s) => (
                  <Draggable
                    key={s.id}
                    position={{ x: s.x, y: s.y }}
                    onStop={(e, d) =>
                      setTables((tbl) =>
                        tbl.map((tb) =>
                          tb.id === t.id
                            ? {
                                ...tb,
                                seats: tb.seats.map((st) =>
                                  st.id === s.id
                                    ? { ...st, x: d.x, y: d.y }
                                    : st
                                ),
                              }
                            : tb
                        )
                      )
                    }
                  >
                    <div
                      onDoubleClick={() => {
                        setPopup(s);
                        setPopupType("seat");
                      }}
                      className="absolute flex items-center justify-center rounded-md w-10 h-10 border shadow cursor-pointer"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.label}
                    </div>
                  </Draggable>
                ))}

              </div>
            </Draggable>
          ))}

        </div>
      </div>

      {/* =============================
          POPUP EDITOR
      ============================== */}
      <Dialog open={!!popup} onOpenChange={() => setPopup(null)}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>
              Edit {popupType === "seat" ? "Seat" : "Table"}
            </DialogTitle>
          </DialogHeader>

          {/* ---- Seat Editor ---- */}
          {popupType === "seat" && popup && "label" in popup && (
            <div className="space-y-4">

              <input
                className="border p-2 rounded w-full"
                value={popup.label}
                onChange={(e) => setPopup({ ...popup, label: e.target.value })}
              />

              <input
                type="color"
                className="w-full h-12 rounded"
                value={popup.color}
                onChange={(e) => setPopup({ ...popup, color: e.target.value })}
              />

              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSeats(seats.filter((x) => x.id !== popup.id));
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

          {/* ---- Table Editor ---- */}
          {popupType === "table" && popup && "seats" in popup && (
            <div className="space-y-4">

              <input
                type="number"
                className="border p-2 rounded w-full"
                value={popup.size}
                onChange={(e) =>
                  setPopup({ ...popup, size: Number(e.target.value) })
                }
              />

              <select
                className="border p-2 rounded w-full"
                value={popup.shape}
                onChange={(e) =>
                  setPopup({ ...popup, shape: e.target.value as any })
                }
              >
                <option value="round">Round</option>
                <option value="square">Square</option>
              </select>

              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setTables(tables.filter((x) => x.id !== popup.id));
                    setPopup(null);
                  }}
                >
                  Delete
                </Button>

                <Button
                  onClick={() => {
                    setTables(
                      tables.map((t) => (t.id === popup.id ? popup : t))
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
