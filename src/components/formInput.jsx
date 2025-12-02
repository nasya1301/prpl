'use client";';

import { Children, useRef } from "react";
import { Calendar } from "./icons";

const DateInput = ({ value, onChange }) => {
  const dateInputRef = useRef(null);

  const formatTanggal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      className="relative flex w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pr-3 pl-9 transition-colors focus-within:ring-1 focus-within:ring-gray-400 hover:bg-gray-50"
      onClick={() => dateInputRef.current?.showPicker()}
    >
      <Calendar
        color="#71717A"
        className="top-2.4 pointer-events-none absolute left-3 h-5 w-5 text-gray-600"
      />

      <input
        ref={dateInputRef}
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer [appearance:none] opacity-0 [&::-webkit-calendar-picker-indicator]:opacity-0"
      />

      <span className={`pointer-events-none pl-3 ${value ? "text-gray-800" : "text-gray-400"}`}>
        {value ? formatTanggal(value) : "DD/MM/YYYY"}
      </span>
    </div>
  );
};

const TextInput = ({
  children,
  value,
  onChange,
  placeholder = "",
  prefix = "",
  auto = false,
  ...props
}) => {
  return (
    <div className="flex w-full items-center rounded-md border border-[#D4D4D8]">
      {prefix.length > 0 && (
        <span className="border-r border-[#D4D4D8] px-3 text-sm text-gray-500">{prefix}</span>
      )}
      {!auto ? (
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-3 py-2 focus:outline-none"
          onChange={(e) => onChange(e.target.value)}
          value={value}
          {...props}
        />
      ) : (
        <div className="px-3 py-2">{children}</div>
      )}
    </div>
  );
};

export { DateInput, TextInput };