"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DatePickerProps = {
  value: string;
  min?: string;
  onChange: (value: string) => void;
  ariaLabel: string;
};

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const displayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function parseIso(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function DatePicker({ value, min, onChange, ariaLabel }: DatePickerProps) {
  const selected = useMemo(() => parseIso(value), [value]);
  const minimum = useMemo(() => (min ? parseIso(min) : null), [min]);
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function closeOnOutsidePress(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  useEffect(() => {
    if (open) setViewMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
  }, [open, selected]);

  const days = useMemo(() => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [viewMonth]);

  const previousMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
  const previousDisabled = minimum
    ? new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0) < minimum
    : false;

  return (
    <div className="date-picker" ref={rootRef}>
      <button
        type="button"
        className="date-picker-trigger"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{displayFormatter.format(selected)}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 2v3M17 2v3M3.5 9h17M5.5 4.5h13a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2Z" />
        </svg>
      </button>

      {open && (
        <div className="date-picker-popover" role="dialog" aria-label={`${ariaLabel} calendar`}>
          <div className="date-picker-header">
            <button
              type="button"
              className="date-picker-nav"
              aria-label="Previous month"
              disabled={previousDisabled}
              onClick={() => setViewMonth(previousMonth)}
            >
              ‹
            </button>
            <strong>{monthFormatter.format(viewMonth)}</strong>
            <button
              type="button"
              className="date-picker-nav"
              aria-label="Next month"
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
            >
              ›
            </button>
          </div>

          <div className="date-picker-weekdays" aria-hidden="true">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
          </div>

          <div className="date-picker-grid">
            {days.map((day) => {
              const outside = day.getMonth() !== viewMonth.getMonth();
              const disabled = minimum ? day < minimum : false;
              const isSelected = sameDay(day, selected);
              const iso = toIso(day);

              return (
                <button
                  type="button"
                  key={iso}
                  className={`date-picker-day${outside ? " outside" : ""}${isSelected ? " selected" : ""}`}
                  disabled={disabled}
                  aria-label={displayFormatter.format(day)}
                  aria-pressed={isSelected}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
