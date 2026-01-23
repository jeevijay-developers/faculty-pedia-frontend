"use client";

import { useState, useRef, useEffect } from "react";
import { LuCalendar, LuChevronLeft, LuChevronRight } from "react-icons/lu";

const MonthPicker = ({ value, onChange, disabled, placeholder, className, maxDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(() => {
    if (value) {
      const [year] = value.split("-");
      return parseInt(year);
    }
    return new Date().getFullYear();
  });

  const containerRef = useRef(null);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Use maxDate if provided, otherwise use current date
  const maxAllowedDate = maxDate || currentDate;
  const maxMonth = maxAllowedDate.getMonth();
  const maxYear = maxAllowedDate.getFullYear();

  // Parse the current value
  const [selectedYearValue, selectedMonthValue] = value
    ? value.split("-").map(Number)
    : [null, null];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMonthSelect = (monthIndex) => {
    const month = String(monthIndex + 1).padStart(2, "0");
    const newValue = `${selectedYear}-${month}`;
    onChange(newValue);
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!value) return placeholder || "Select month";
    const [year, month] = value.split("-");
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full h-12 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all flex items-center justify-between ${
          disabled
            ? "bg-slate-50 text-slate-400 cursor-not-allowed"
            : "cursor-pointer hover:border-slate-300"
        } ${className || ""}`}
      >
        <span className={!value ? "text-slate-400" : ""}>
          {getDisplayValue()}
        </span>
        <LuCalendar className="h-5 w-5 text-slate-400" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full mt-2 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-4 w-80">
          {/* Year Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setSelectedYear(selectedYear - 1)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LuChevronLeft className="h-5 w-5 text-slate-600" />
            </button>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="text-lg font-semibold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer hover:bg-slate-50 rounded-lg px-3 py-1"
            >
              {Array.from({ length: 100 }, (_, i) => currentYear + 10 - i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
            <button
              type="button"
              onClick={() => setSelectedYear(selectedYear + 1)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LuChevronRight className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => {
              const isSelected =
                selectedYear === selectedYearValue &&
                index + 1 === selectedMonthValue;
              const isCurrent =
                selectedYear === currentYear && index === currentMonth;
              
              // Disable future months
              const isFutureMonth =
                selectedYear > maxYear ||
                (selectedYear === maxYear && index > maxMonth);

              return (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleMonthSelect(index)}
                  disabled={isFutureMonth}
                  className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    isFutureMonth
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                      : isSelected
                      ? "bg-blue-500 text-white shadow-md"
                      : isCurrent
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {month}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const month = String(today.getMonth() + 1).padStart(2, "0");
                const year = today.getFullYear();
                onChange(`${year}-${month}`);
                setSelectedYear(year);
                setIsOpen(false);
              }}
              className="flex-1 py-2 px-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="flex-1 py-2 px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthPicker;
