"use client";

import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { Button } from "@/components/ui/button";
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
  type: "regular" | "vip" | "handicap" | "couple";
  price?: number;
  status: "available" | "reserved" | "sold";
};

type Category = {
  id: string;
  name: string;
  color: string;
  price: number;
  description: string;
};

/* ---------------- ICONS ---------------- */
const Icons = {
  Plus: () => <span className="text-lg">＋</span>,
  Grid: () => <span className="text-lg">▦</span>,
  Row: () => <span className="text-lg">⇄</span>,
  Column: () => <span className="text-lg">⇅</span>,
  Delete: () => <span className="text-lg">🗑️</span>,
  Trash: () => <span className="text-lg">✕</span>,
  Undo: () => <span className="text-lg">↶</span>,
  Redo: () => <span className="text-lg">↷</span>,
  Save: () => <span className="text-lg">💾</span>,
  Seat: () => <span className="text-lg">🪑</span>,
  Select: () => <span className="text-lg">⬚</span>,
  Copy: () => <span className="text-lg">⎘</span>,
  Paste: () => <span className="text-lg">📋</span>,
  Settings: () => <span className="text-lg">⚙️</span>,
  ZoomIn: () => <span className="text-lg">⊕</span>,
  ZoomOut: () => <span className="text-lg">⊖</span>,
  Reset: () => <span className="text-lg">↺</span>,
  Eye: () => <span className="text-lg">👁️</span>,
  EyeOff: () => <span className="text-lg">👁️‍🗨️</span>,
  Lock: () => <span className="text-lg">🔒</span>,
  Unlock: () => <span className="text-lg">🔓</span>,
  Filter: () => <span className="text-lg">🎯</span>,
  Move: () => <span className="text-lg">↔️</span>,
  Rotate: () => <span className="text-lg">🔄</span>,
  Align: () => <span className="text-lg">⯀</span>,
  Color: () => <span className="text-lg">🎨</span>,
    RowDelete: () => <span className="text-lg">🗑️⇄</span>,
  ColumnDelete: () => <span className="text-lg">🗑️⇅</span>,

};

const cloneSeats = (seats: Seat[]): Seat[] =>
  seats.map(seat => ({
    id: seat.id,
    x: seat.x,
    y: seat.y,
    label: seat.label,
    color: seat.color,
    category: seat.category,
    size: seat.size,
    type: seat.type,
    price: seat.price,
    status: seat.status,
  }));


/* ---------------- HELPERS ---------------- */
const snap = (v: number, g = 10) => Math.round(v / g) * g;
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/* ---------------- CATEGORIES ---------------- */
const DEFAULT_CATEGORIES: Category[] = [
  { id: "regular", name: "Regular", color: "#3B82F6", price: 50, description: "Standard seating" },
  { id: "vip", name: "VIP", color: "#F59E0B", price: 100, description: "Premium seating" },
  { id: "handicap", name: "Handicap", color: "#10B981", price: 40, description: "Accessible seating" },
  { id: "couple", name: "Couple", color: "#EC4899", price: 150, description: "Double seating" },
];

/* =====================================================
   🎭 THEATRE SEAT DESIGNER (WORKING VERSION)
===================================================== */
export default function TheatreSeatDesigner({ eventId }: { eventId: number }) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [history, setHistory] = useState<Seat[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [lockSeats, setLockSeats] = useState(false);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<string>("regular");
  const [seatSize, setSeatSize] = useState(48);
  const [clipboard, setClipboard] = useState<Seat[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showCategorySelect, setShowCategorySelect] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const categorySelectRef = useRef<HTMLDivElement>(null);

  /* -------- Drag selection box -------- */
  const [box, setBox] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    active: false,
  });

  /* ---------------- HISTORY MANAGEMENT ---------------- */
const pushHistory = () => {
  const snapshot = cloneSeats(seats);

  setHistory(prev => [
    ...prev.slice(0, historyIndex + 1),
    snapshot,
  ]);

  setHistoryIndex(prev => prev + 1);
};

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSeats(history[historyIndex - 1]);
      setSelected([]);
      toast.info("Undone last action");
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSeats(history[historyIndex + 1]);
      setSelected([]);
      toast.info("Redone last action");
    }
  };

  /* ---------------- DATA PERSISTENCE ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `http://localhost/managerbp/public/seller/events/get_seat_layout.php?event_id=${eventId}`
        );
        const json = await res.json();
        const loadedSeats = json.success ? json.data?.seats || [] : [];
        setSeats(loadedSeats);
        setHistory([loadedSeats]);
        setHistoryIndex(0);
        toast.success("Layout loaded successfully");
      } catch {
        setSeats([]);
        setHistory([[]]);
        setHistoryIndex(0);
        toast.error("Failed to load layout");
      }
    })();
  }, [eventId]);

  const saveLayout = async () => {
    try {
      const res = await fetch(
        "http://localhost/managerbp/public/seller/events/save_seat_layout.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_id: eventId,
            user_id: 52064,
            layout: { seats },
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("✅ Seat layout saved successfully!");
      } else {
        toast.error(`Failed: ${data.message}`);
      }
    } catch {
      toast.error("🚨 Server error. Please try again.");
    }
  };

  /* ---------------- SEAT CREATION ---------------- */
  const addSeat = (x?: number, y?: number) => {
    pushHistory();
    const category = categories.find(c => c.id === activeCategory);
    const newSeat: Seat = {
      id: generateId(),
      label: `S${seats.length + 1}`,
      x: x || 120,
      y: y || 120,
      color: category?.color || "#3B82F6",
      category: activeCategory,
      type: activeCategory as any,
      size: seatSize,
      price: category?.price,
      status: "available",
    };
    setSeats(prev => [...prev, newSeat]);
    setSelected([newSeat.id]);
    toast.info(`➕ Added ${category?.name} seat`);
  };

  const addRow = () => {
    pushHistory();
    const rows = seats.map((s) => s.label[0]);
    const nextRow = String.fromCharCode(
      (rows.length ? Math.max(...rows.map((r) => r.charCodeAt(0))) : 64) + 1
    );

    const maxY = Math.max(...seats.map((s) => s.y), 0);
    const category = categories.find(c => c.id === activeCategory);
    
    const newSeats = Array.from({ length: 10 }).map((_, i) => ({
      id: generateId(),
      label: `${nextRow}${i + 1}`,
      x: i * (seatSize + 10) + 80,
      y: maxY + seatSize + 20,
      color: category?.color || "#3B82F6",
      category: activeCategory,
      type: activeCategory as any,
      size: seatSize,
      price: category?.price,
      status: "available",
    }));

    setSeats(prev => [...prev, ...newSeats]);
    toast.info(`📊 Row ${nextRow} added (10 ${category?.name} seats)`);
  };

  const addColumn = () => {
    pushHistory();
    const grouped: Record<string, Seat[]> = {};
    seats.forEach((s) => {
      grouped[s.label[0]] = grouped[s.label[0]] || [];
      grouped[s.label[0]].push(s);
    });

    if (Object.keys(grouped).length === 0) {
      toast.error("No rows to add column to");
      return;
    }

    const category = categories.find(c => c.id === activeCategory);
    const newSeats = Object.values(grouped).map((row) => ({
      id: generateId(),
      label: `${row[0].label[0]}${row.length + 1}`,
      x: Math.max(...row.map((s) => s.x)) + seatSize + 10,
      y: row[0].y,
      color: category?.color || "#3B82F6",
      category: activeCategory,
      type: activeCategory as any,
      size: seatSize,
      price: category?.price,
      status: "available",
    }));

    setSeats(prev => [...prev, ...newSeats]);
    toast.info(`📐 Column added to ${Object.keys(grouped).length} rows`);
  };

  const addGrid = (rows: number = 5, cols: number = 8) => {
    pushHistory();
    const category = categories.find(c => c.id === activeCategory);
    const newSeats: Seat[] = [];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        newSeats.push({
          id: generateId(),
          label: `${String.fromCharCode(65 + r)}${c + 1}`,
          x: c * (seatSize + 15) + 100,
          y: r * (seatSize + 15) + 100,
          color: category?.color || "#3B82F6",
          category: activeCategory,
          type: activeCategory as any,
          size: seatSize,
          price: category?.price,
          status: "available",
        });
      }
    }
    
    setSeats(prev => [...prev, ...newSeats]);
    toast.info(`▦ Grid added: ${rows}×${cols} (${rows * cols} seats)`);
  };

  /* ---------------- SEAT SELECTION ---------------- */
  const activeSeat = seats.find((s) => selected.includes(s.id));
  const activeRow = activeSeat?.label[0];
  const activeCol = activeSeat?.label.slice(1);

  const selectAll = () => {
    setSelected(seats.map(s => s.id));
    toast.info(`⬚ Selected all ${seats.length} seats`);
  };

  const clearSelection = () => {
    setSelected([]);
  };

  /* ---------------- DELETE OPERATIONS ---------------- */
  const deleteRow = () => {
    if (!activeRow) return;
    pushHistory();
    const rowSeats = seats.filter((seat) => seat.label[0] === activeRow);
    setSeats(prev => prev.filter((seat) => seat.label[0] !== activeRow));
    setSelected([]);
    toast.warning(`🗑️ Deleted Row ${activeRow} (${rowSeats.length} seats)`);
  };

  const deleteColumn = () => {
    if (!activeCol) return;
    pushHistory();
    const colSeats = seats.filter((seat) => seat.label.slice(1) === activeCol);
    setSeats(prev => prev.filter((seat) => seat.label.slice(1) !== activeCol));
    setSelected([]);
    toast.warning(`🗑️ Deleted Column ${activeCol} (${colSeats.length} seats)`);
  };

  const deleteSelected = () => {
    if (!selected.length) return;
    pushHistory();
    setSeats(prev => prev.filter((seat) => !selected.includes(seat.id)));
    setSelected([]);
    toast.warning(`🗑️ Deleted ${selected.length} seat(s)`);
  };

  /* ---------------- COPY/PASTE ---------------- */
  const copySelected = () => {
    const selectedSeats = seats.filter(s => selected.includes(s.id));
    if (selectedSeats.length) {
      setClipboard(selectedSeats.map(s => ({...s, id: generateId()})));
      toast.info(`⎘ Copied ${selectedSeats.length} seat(s) to clipboard`);
    }
  };

  const pasteSeats = () => {
    if (!clipboard.length) return;
    pushHistory();
    const offset = 50;
    const newSeats = clipboard.map(seat => ({
      ...seat,
      id: generateId(),
      x: seat.x + offset,
      y: seat.y + offset,
    }));
    setSeats(prev => [...prev, ...newSeats]);
    setSelected(newSeats.map(s => s.id));
    toast.info(`📋 Pasted ${newSeats.length} seat(s)`);
  };

  /* ---------------- BULK OPERATIONS ---------------- */
  const updateSelectedCategory = (categoryId: string) => {
    if (!selected.length) return;
    pushHistory();
    const category = categories.find(c => c.id === categoryId);
    setSeats(prev => prev.map(seat => 
      selected.includes(seat.id) 
        ? { ...seat, category: categoryId, color: category?.color || seat.color, type: categoryId as any }
        : seat
    ));
    toast.info(`🎨 Updated ${selected.length} seat(s) to ${category?.name}`);
    setShowCategorySelect(false);
  };

  /* ---------------- CANVAS INTERACTION ---------------- */
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.target !== canvasRef.current || lockSeats) return;
    const r = canvasRef.current!.getBoundingClientRect();
    setBox({
      startX: e.clientX - r.left,
      startY: e.clientY - r.top,
      endX: e.clientX - r.left,
      endY: e.clientY - r.top,
      active: true,
    });
    setSelected([]);
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!box.active) return;
    const r = canvasRef.current!.getBoundingClientRect();
    setBox((b) => ({
      ...b,
      endX: e.clientX - r.left,
      endY: e.clientY - r.top,
    }));
  };

  const onMouseUp = () => {
    if (!box.active) return;
    setIsDragging(false);

    const minX = Math.min(box.startX, box.endX);
    const maxX = Math.max(box.startX, box.endX);
    const minY = Math.min(box.startY, box.endY);
    const maxY = Math.max(box.startY, box.endY);

    const selectedSeats = seats.filter(
      (s) =>
        s.x + seatSize > minX &&
        s.x < maxX &&
        s.y + seatSize > minY &&
        s.y < maxY
    );

    setSelected(selectedSeats.map((s) => s.id));
    
    if (selectedSeats.length > 0) {
      toast.info(`⬚ Selected ${selectedSeats.length} seat(s)`);
    }

    setBox((b) => ({ ...b, active: false }));
  };

  /* ---------------- CANVAS CONTROLS ---------------- */
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setZoom(1);
  const centerCanvas = () => {
    if (canvasContainerRef.current) {
      canvasContainerRef.current.scrollTo({
        left: canvasContainerRef.current.scrollWidth / 2 - canvasContainerRef.current.clientWidth / 2,
        top: canvasContainerRef.current.scrollHeight / 2 - canvasContainerRef.current.clientHeight / 2,
        behavior: 'smooth'
      });
    }
  };

  /* ---------------- CLICK OUTSIDE HANDLERS ---------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      if (categorySelectRef.current && !categorySelectRef.current.contains(event.target as Node)) {
        setShowCategorySelect(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ---------------- STATISTICS ---------------- */
  const totalSeats = seats.length;
  const selectedSeats = selected.length;
  const totalRows = new Set(seats.map(s => s.label[0])).size;
  const seatsByCategory = seats.reduce((acc, seat) => {
    acc[seat.category] = (acc[seat.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-[1920px] mx-auto">
        {/* ===== TOP TOOLBAR ===== */}
        <div className="bg-white rounded-2xl border shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* LEFT SECTION - BRANDING & STATS */}
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Theatre Seat Designer</h1>
                <p className="text-sm text-gray-500">Event #{eventId}</p>
              </div>
              <div className="hidden md:block w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-700">Total: <strong>{totalSeats}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-gray-700">Selected: <strong className="text-purple-600">{selectedSeats}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-700">Rows: <strong>{totalRows}</strong></span>
                </div>
              </div>
            </div>

            {/* CENTER SECTION - MAIN TOOLS */}
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" onClick={addSeat}>
                <Icons.Plus />
                <span className="ml-2 hidden sm:inline">Add Seat</span>
              </Button>

              <Button size="sm" variant="outline" onClick={addRow}>
                <Icons.Row />
                <span className="ml-2 hidden sm:inline">Add Row</span>
              </Button>

              <Button size="sm" variant="outline" onClick={() => addGrid()}>
                <Icons.Grid />
                <span className="ml-2 hidden sm:inline">Add Grid</span>
              </Button>

              <div className="w-px h-6 bg-gray-200"></div>

              <Button 
                size="sm" 
                variant="outline" 
                disabled={!selectedSeats}
                onClick={copySelected}
              >
                <Icons.Copy />
              </Button>

              <Button 
                size="sm" 
                variant="outline" 
                disabled={!clipboard.length}
                onClick={pasteSeats}
              >
                <Icons.Paste />
              </Button>

              <div className="w-px h-6 bg-gray-200"></div>

              <Button 
                size="sm" 
                variant="outline" 
                disabled={historyIndex <= 0}
                onClick={undo}
              >
                <Icons.Undo />
              </Button>

              <Button 
                size="sm" 
                variant="outline" 
                disabled={historyIndex >= history.length - 1}
                onClick={redo}
              >
                <Icons.Redo />
              </Button>
            </div>

            {/* RIGHT SECTION - ACTIONS */}
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="destructive" 
                disabled={!selectedSeats}
                onClick={deleteSelected}
                className="hidden sm:flex"
              >
                <Icons.Trash />
                <span className="ml-2">Delete Selected</span>
              </Button>
              
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                onClick={saveLayout}
              >
                <Icons.Save />
                <span className="ml-2 hidden sm:inline">Save Layout</span>
              </Button>
              
              <div className="relative" ref={settingsRef}>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Icons.Settings />
                </Button>
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border shadow-lg p-4 z-50">
                    <div className="space-y-4">
                      <h4 className="font-medium">Canvas Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">Show Grid</label>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={showGrid}
                            onClick={() => setShowGrid(!showGrid)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showGrid ? "bg-blue-600" : "bg-gray-200"}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showGrid ? "translate-x-6" : "translate-x-1"}`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">Snap to Grid</label>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={snapToGrid}
                            onClick={() => setSnapToGrid(!snapToGrid)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${snapToGrid ? "bg-blue-600" : "bg-gray-200"}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${snapToGrid ? "translate-x-6" : "translate-x-1"}`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">Lock Seats</label>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={lockSeats}
                            onClick={() => setLockSeats(!lockSeats)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${lockSeats ? "bg-blue-600" : "bg-gray-200"}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${lockSeats ? "translate-x-6" : "translate-x-1"}`}
                            />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Seat Size: {seatSize}px
                          </label>
                          <input
                            type="range"
                            min="32"
                            max="64"
                            step="4"
                            value={seatSize}
                            onChange={(e) => setSeatSize(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECONDARY TOOLBAR */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t">
            {/* CATEGORY SELECTOR */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <div className="flex gap-1">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    size="sm"
                    variant={activeCategory === category.id ? "default" : "outline"}
                    style={{ 
                      backgroundColor: activeCategory === category.id ? category.color : 'transparent',
                      borderColor: category.color,
                      color: activeCategory === category.id ? 'white' : category.color
                    }}
                    onClick={() => setActiveCategory(category.id)}
                    className="h-8 px-3"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* SELECTION ACTIONS */}
            {selectedSeats > 0 && (
              <>
                <div className="w-px h-6 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedSeats} selected
                  </span>
                  <div className="relative" ref={categorySelectRef}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCategorySelect(!showCategorySelect)}
                      className="h-8 w-40 justify-between"
                    >
                      <span>Change category</span>
                      <span>▼</span>
                    </Button>
                    {showCategorySelect && (
                      <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-50">
                        {categories.map(category => (
                          <button
                            key={category.id}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => updateSelectedCategory(category.id)}
                          >
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                            {category.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* CANVAS CONTROLS */}
            <div className="w-px h-6 bg-gray-200 ml-auto"></div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={zoomOut}>
                <Icons.ZoomOut />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button size="sm" variant="outline" onClick={zoomIn}>
                <Icons.ZoomIn />
              </Button>
              <Button size="sm" variant="outline" onClick={resetZoom}>
                <Icons.Reset />
              </Button>
              <Button size="sm" variant="outline" onClick={centerCanvas}>
                Center
              </Button>
            </div>
          </div>
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ===== LEFT PANEL - QUICK ACTIONS ===== */}
          <div className="lg:col-span-1 space-y-6">
            {/* SEAT CATEGORIES */}
            <div className="bg-white rounded-2xl border shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Seat Categories</h3>
              <div className="space-y-3">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500">${category.price}</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {seatsByCategory[category.id] || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-2xl border shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-auto py-3 flex-col gap-2"
                  onClick={selectAll}
                  disabled={!seats.length}
                >
                  <div className="text-lg">✓✓</div>
                  <span className="text-xs">Select All</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto py-3 flex-col gap-2"
                  onClick={clearSelection}
                  disabled={!selectedSeats}
                >
                  <div className="text-lg">✕✕</div>
                  <span className="text-xs">Clear Selection</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto py-3 flex-col gap-2"
                  disabled={!activeRow}
                  onClick={deleteRow}
                >
                  <Icons.RowDelete />
                  <span className="text-xs">Delete Row</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto py-3 flex-col gap-2"
                  disabled={!activeCol}
                  onClick={deleteColumn}
                >
                  <Icons.ColumnDelete />
                  <span className="text-xs">Delete Column</span>
                </Button>
              </div>
            </div>

            {/* STATISTICS */}
            <div className="bg-white rounded-2xl border shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-bold text-lg text-green-600">
                    ${seats.reduce((sum, seat) => sum + (seat.price || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Capacity</span>
                  <span className="font-bold">{totalSeats}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rows × Columns</span>
                  <span className="font-bold">{totalRows} × {Math.max(...seats.map(s => parseInt(s.label.slice(1)) || 0, 0))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Canvas Size</span>
                  <span className="font-bold">2000×2000</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== CANVAS AREA ===== */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border shadow-lg overflow-hidden h-[calc(100vh-200px)]">
              <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-gray-900">Design Canvas</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`w-3 h-3 rounded-full ${lockSeats ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <span className="text-gray-600">
                        {lockSeats ? 'Locked' : 'Editable'} • {snapToGrid ? 'Snap On' : 'Snap Off'}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {isDragging ? "Dragging selection..." : "Drag to select • Click to edit"}
                  </div>
                </div>
              </div>

              <div 
                ref={canvasContainerRef}
                className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-full overflow-auto"
              >
                <div
                  ref={canvasRef}
                  className="relative w-[2000px] h-[2000px]"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: '0 0',
                    backgroundImage: showGrid 
                      ? `linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                         linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`
                      : 'none',
                    backgroundSize: '20px 20px',
                  }}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                >
                  {/* SELECTION BOX */}
                  {box.active && (
                    <div
                      className="absolute border-2 border-blue-500 bg-gradient-to-r from-blue-100/40 to-blue-200/20"
                      style={{
                        left: Math.min(box.startX, box.endX),
                        top: Math.min(box.startY, box.endY),
                        width: Math.abs(box.endX - box.startX),
                        height: Math.abs(box.endY - box.startY),
                      }}
                    />
                  )}

                  {/* SEATS */}
                  {seats.map((seat) => {
                    const isSelected = selected.includes(seat.id);
                    const category = categories.find(c => c.id === seat.category);
                    const seatColor = category?.color || seat.color;
                    
                    return (
                      <Draggable
                        key={seat.id}
                        position={{ x: seat.x, y: seat.y }}
                        disabled={lockSeats}
                        onStart={() => setIsDragging(true)}
                        onStop={(e, d) => {
                          setIsDragging(false);
                          pushHistory();
                          setSeats((prev) =>
                            prev.map((s) =>
                              s.id === seat.id
                                ? { 
                                    ...s, 
                                    x: snapToGrid ? snap(d.x) : d.x, 
                                    y: snapToGrid ? snap(d.y) : d.y 
                                  }
                                : s
                            )
                          );
                        }}
                      >
                        <div
                          onClick={(e) => {
                            if (lockSeats) return;
                            e.stopPropagation();
                            setSelected((p) =>
                              p.includes(seat.id)
                                ? p.filter((i) => i !== seat.id)
                                : [...p, seat.id]
                            );
                          }}
                          className={`absolute flex items-center justify-center rounded-lg border-2 cursor-pointer text-sm font-medium transition-all duration-200
                            ${isSelected
                              ? 'shadow-lg scale-105 z-10 border-white ring-4 ring-blue-500/50'
                              : 'hover:shadow-md border-gray-300 hover:border-blue-300'
                            }
                            ${lockSeats ? 'cursor-not-allowed opacity-80' : ''}`}
                          style={{
                            width: seatSize,
                            height: seatSize,
                            backgroundColor: isSelected ? seatColor : `${seatColor}80`,
                            color: isSelected ? 'white' : 'black',
                            boxShadow: isSelected 
                              ? `0 10px 25px -5px ${seatColor}40, inset 0 2px 4px 0 ${seatColor}80` 
                              : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                          }}
                        >
                          <span className="font-bold">{seat.label}</span>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                          )}
                          {seat.type === 'vip' && (
                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-500 rounded-full"></div>
                          )}
                          {seat.type === 'handicap' && (
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-500 rounded-full"></div>
                          )}
                          {seat.type === 'couple' && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></div>
                          )}
                        </div>
                      </Draggable>
                    );
                  })}

                  {/* CANVAS MARKERS */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-red-500 rounded-full opacity-50"></div>
                  </div>
                </div>
              </div>

              {/* CANVAS STATUS BAR */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span>Seats: {totalSeats}</span>
                  <span>Selected: {selectedSeats}</span>
                  <span>Zoom: {Math.round(zoom * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            💡 <strong>Pro Tips:</strong> Use Ctrl+Click to select multiple seats • 
            Drag from empty space to select area • Double-click seat to edit properties
          </p>
        </div>
      </div>
    </div>
  );
}