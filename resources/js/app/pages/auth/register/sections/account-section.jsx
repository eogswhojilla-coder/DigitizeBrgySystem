import React, { useState } from "react";

export default function AccountSection({ register, errors }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [privacyChecked, setPrivacyChecked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [hasViewedTerms, setHasViewedTerms] = useState(false);

    return (
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg border border-gray-200">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 text-center mb-6 tracking-wide">
                Create Account
            </h2>

            <div className="space-y-4">

                {/* USERNAME */}
                <div>
                    <input
                        type="text"
                        {...register("username", {
                            required: "Username is required",
                        })}
                        placeholder="Username"
                        className={`w-full py-3 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors?.username ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors?.username && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.username.message}
                        </p>
                    )}
                </div>

                {/* PASSWORD */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "At least 8 characters",
                            },
                            pattern: {
                                value:
                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
                                message:
                                    "Must include uppercase, lowercase, number & symbol",
                            },
                        })}
                        placeholder="Password"
                        className={`w-full py-3 px-4 pr-12 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors?.password ? "border-red-500" : "border-gray-300"
                        }`}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-sm text-gray-500 hover:text-blue-500"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>

                    {errors?.password && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword", {
                            required: "Confirm your password",
                        })}
                        placeholder="Confirm Password"
                        className={`w-full py-3 px-4 pr-12 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                        className="absolute right-3 top-3 text-sm text-gray-500 hover:text-blue-500"
                    >
                        {showConfirmPassword ? "Hide" : "Show"}
                    </button>

                    {errors?.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* PASSWORD REQUIREMENTS */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2 text-xs">
                        Create a Strong Password
                    </h3>

                    <ul className="list-disc list-inside text-blue-700 text-xs space-y-1">
                        <li>Minimum of 8 characters</li>
                        <li>At least 1 uppercase letter (A–Z)</li>
                        <li>At least 1 lowercase letter (a–z)</li>
                        <li>At least 1 number (0–9)</li>
                        <li>At least 1 special character (! @ # $ % * ? &)</li>
                    </ul>

                    <p className="mt-2 text-blue-800 text-xs">
                        Example: <strong>Secure@123</strong>
                    </p>

                    <p className="mt-2 text-blue-600 text-[11px]">
                        Avoid using common words, names, or birthdays for better security.
                    </p>
                </div>

                {/* PRIVACY SECTION */}
                <div className="bg-gray-100 p-4 rounded-md border">
                    <h3 className="font-semibold text-gray-800 mb-2">
                        Privacy Notice
                    </h3>

                    <p className="text-sm text-gray-600">
                        Please read our Privacy Policy before creating your account.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setShowModal(true);
                            setHasViewedTerms(true);
                        }}
                        className="text-blue-600 text-sm mt-2 hover:underline"
                    >
                        View Privacy Policy
                    </button>

                    <div className="flex items-start mt-4 gap-2">
                        <input
                            type="checkbox"
                            checked={privacyChecked}
                            disabled={!hasViewedTerms}
                            onChange={() =>
                                setPrivacyChecked(!privacyChecked)
                            }
                            className="mt-1 accent-blue-600"
                        />
                        <label className="text-sm text-gray-800">
                            I have read and agree to the Privacy Policy and consent
                            to the collection and processing of my personal data.
                        </label>
                    </div>

                    {!privacyChecked && hasViewedTerms && (
                        <p className="text-red-500 text-xs mt-2">
                            You must agree before proceeding.
                        </p>
                    )}
                </div>
            </div>

            {/* PRIVACY MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">
                            Privacy Notice
                        </h2>

                        <div className="max-h-72 overflow-y-auto text-sm text-gray-700 space-y-3">

                            <p>
                                This system collects personal information such as
                                your name, address, contact number, and other
                                relevant data for barangay services.
                            </p>

                            <p>
                                Your data will be used for resident registration,
                                record keeping, certificate issuance, and other
                                official barangay transactions.
                            </p>

                            <p>
                                We ensure that your information is securely stored
                                and only accessible to authorized personnel.
                            </p>

                            <p>
                                Your data will not be shared without your consent
                                unless required by law.
                            </p>

                            <p>
                                You have the right to access, correct, or request
                                deletion of your personal data.
                            </p>

                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>  
                    </div>
                </div>
            )}
        </div>
    );
}