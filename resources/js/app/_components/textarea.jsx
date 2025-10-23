import React from "react";

export default function TextArea({
  label,
  name,
  register,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  error,
  className = "",
  rows=4,
  ...rest
}) {
  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          id={name}
          name={name}
          {...register}
          value={value}
          onChange={onChange}
          placeholder=" "
          required={required}
          disabled={disabled}
          rows={rows}
          className={`peer w-full px-5 pt-4 pb-2.5 text-black border border-gray-600 rounded-md bg-white placeholder-transparent focus:outline-none focus:border-blue-500 resize-none transition-all ${
            error ? "border-red-500" : ""
          } ${className}`}
          {...rest}
        />
        <label
          htmlFor={name}
          className="absolute left-2.5 px-2.5 transition-all bg-white text-blue-black/60 text-sm -top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2.5 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:bg-white"
        >
          {label}
        </label>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
