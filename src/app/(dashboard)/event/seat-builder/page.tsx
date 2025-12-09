"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/* SIMPLE SEAT PREVIEW GRID */
const generateGrid = (rows: number, cols: number) => {
  return Array.from({ length: rows }).map(() =>
    Array.from({ length: cols }).map(() => ({
      selected: false,
    }))
  );
};

export default function SeatBuilderPage() {
  const params = useSearchParams();
  const layout = params.get("layout") || "theatre";

  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(8);
  const [grid, setGrid] = useState(generateGrid(5, 8));

  const toggleSeat = (r: number, c: number) => {
    const newGrid = [...grid];
    newGrid[r][c].selected = !newGrid[r][c].selected;
    setGrid(newGrid);
  };

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold capitalize">
        Seat Builder — {layout.replace("-", " ")}
      </h1>

      {/* Row / Column Controls */}
      <div className="bg-white p-5 rounded-xl border grid grid-cols-2 gap-5">
        <div>
          <label className="font-medium">Rows</label>
          <input
            type="number"
            value={rows}
            className="border p-2 w-full rounded"
            onChange={(e) => {
              const newRows = Number(e.target.value);
              setRows(newRows);
              setGrid(generateGrid(newRows, cols));
            }}
          />
        </div>

        <div>
          <label className="font-medium">Columns</label>
          <input
            type="number"
            value={cols}
            className="border p-2 w-full rounded"
            onChange={(e) => {
              const newCols = Number(e.target.value);
              setCols(newCols);
              setGrid(generateGrid(rows, newCols));
            }}
          />
        </div>
      </div>

      {/* Seat Preview Box */}
      <div className="bg-white p-6 rounded-xl border inline-block">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${cols}, 40px)`
          }}
        >
          {grid.map((row, rIdx) =>
            row.map((seat, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`w-10 h-10 rounded flex items-center justify-center cursor-pointer 
                  ${seat.selected ? "bg-purple-600 text-white" : "bg-gray-200"}
                `}
                onClick={() => toggleSeat(rIdx, cIdx)}
              >
                {rIdx + 1}-{cIdx + 1}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Save Button */}
      <Button className="px-10 mt-5">Save Seat Layout</Button>
    </div>
  );
}
