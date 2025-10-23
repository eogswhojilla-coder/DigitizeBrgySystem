import React from "react";

export default function Radio({
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  required = false,
}) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className="w-4 h-4 text-blue-600 accent-blue-600"
      />
      <span className="text-sm text-gray-800">{label}</span>
    </label>
  );
}
