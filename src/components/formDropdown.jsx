"use client";
import { useState, useRef, useEffect } from "react";

export default function FormDropdown({ label, options = [], value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const isValueSelected = value && value !== "";

  return (
    <div className="relative flex w-full flex-col" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`text-leftfocus:ring-1 flex w-full items-center justify-between rounded-md border border-[#D4D4D8] bg-white px-3 py-2 focus:outline-none ${isValueSelected ? "text-[#011829]" : "text-gray-400"}`}
      >
        <span>{value || `${label}`}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transform text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-0 w-full rounded-lg border border-[#D4D4D8] bg-white shadow-lg">
          {options.length > 0 ? (
            options.map((option, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(option)}
                className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-50 ${
                  value === option ? "textgraye-700 bg-gray-100" : "text-gray-800"
                }`}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-400">Tidak ada opsi</div>
          )}
        </div>
      )}
    </div>
  );
}
