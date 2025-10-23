import React from "react";
import classNames from "classnames";

const variantStyles = {
    primary: {
        solid: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    },
    secondary: {
        solid: "bg-gray-600 text-white hover:bg-gray-700",
        outline: "border border-gray-600 text-gray-600 hover:bg-gray-50",
    },
    danger: {
        solid: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-red-600 text-red-600 hover:bg-red-50",
    },
    warning: {
        solid: "bg-yellow-500 text-white hover:bg-yellow-600",
        outline: "border border-yellow-500 text-yellow-600 hover:bg-yellow-50",
    },
    success: {
        solid: "bg-green-600 text-white hover:bg-green-700",
        outline: "border border-green-600 text-green-600 hover:bg-green-50",
    },
};

const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    onClick,
    type = "button",
    className = "",
    loading = false,
    outline = false, // NEW: boolean to control solid/outline
}) {
    const baseStyle =
        "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const styleType = outline ? "outline" : "solid";
    const finalClass = classNames(
        baseStyle,
        variantStyles[variant]?.[styleType],
        sizeStyles[size],
        className
    );

    return (
        <button
            type={type}
            className={finalClass}
            disabled={disabled || loading}
            onClick={onClick}
        >
            {loading ? (
                <div className="flex gap-1 py-2">
                    {[0, 150, 300, 450, 600].map((delay) => (
                        <span
                            key={delay}
                            className={`relative flex size-2 duration-1000 animate-bounce [animation-delay:${delay}ms]`}
                        >
                            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex size-2 rounded-full bg-white"></span>
                        </span>
                    ))}
                </div>
            ) : (
                children
            )}
        </button>
    );
}
