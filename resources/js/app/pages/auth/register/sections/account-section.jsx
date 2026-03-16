import React, { useState } from "react";

export default function AccountSection({ register, errors }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 ">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-8 tracking-wide">
                    Create Account
                </h2>

                <div className="space-y-6">
                    {/* Username */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            {...register("username", {
                                required: "Username is required",
                            })}
                            placeholder="Username"
                            className={`w-full py-3 pl-10 pr-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors?.username
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors?.username && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message:
                                        "Password must be at least 6 characters",
                                },
                            })}
                            placeholder="Password"
                            className={`w-full py-3 pl-10 pr-12 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors?.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-500"
                        >
                            {showPassword ? (
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                                </svg>
                            ) : (
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M10 2C5.273 2 1.188 5.73.458 10c.73 4.27 4.815 8 9.542 8s8.812-3.73 9.542-8c-.73-4.27-4.815-8-9.542-8zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                                </svg>
                            )}
                        </button>
                        {errors?.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                            })}
                            placeholder="Confirm Password"
                            className={`w-full py-3 pl-10 pr-12 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors?.confirmPassword
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-500"
                        >
                            {showConfirmPassword ? (
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                                </svg>
                            ) : (
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M10 2C5.273 2 1.188 5.73.458 10c.73 4.27 4.815 8 9.542 8s8.812-3.73 9.542-8c-.73-4.27-4.815-8-9.542-8zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                                </svg>
                            )}
                        </button>
                        {errors?.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                    <div className="bg-blue-100 dark:bg-gray-800 p-4 rounded-md border border-blue-300 dark:border-gray-700">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
                            Password Requirements:
                        </h3>
                        <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1">
                            <li>
                                <strong>Length:</strong> At least 8 characters
                                long.
                            </li>
                            <li>
                                <strong>Uppercase Letter:</strong> Include at
                                least one capital letter (A-Z).
                            </li>
                            <li>
                                <strong>Lowercase Letter:</strong> Include at
                                least one lowercase letter (a-z).
                            </li>
                            <li>
                                <strong>Number:</strong> Include at least one
                                number (0-9).
                            </li>
                            <li>
                                <strong>Symbol:</strong> Include at least one
                                special character (e.g., ! @ # $ % ^ & *).
                            </li>
                            <li>
                                <strong>No Spaces:</strong> Passwords should not
                                contain spaces.
                            </li>
                        </ul>
                        <p className="mt-2 text-blue-800 dark:text-blue-400">
                            <strong>Example:</strong> Secure@123
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
