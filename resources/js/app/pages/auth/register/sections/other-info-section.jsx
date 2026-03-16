import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React, { useState, useEffect } from "react";

export default function OtherInfoSection({
    register,
    errors,
    watch,
    setValue,
}) {
    const residencyStatus = watch ? watch("residencyStatus") : "";
    const dateStartedLiving = watch ? watch("dateStartedLiving") : "";
    const selectedZone = watch ? watch("zone") : "";

    // Zone and street data for Barangay 2
    const zoneStreets = {
        "Don Juan Subdivision": [
            "Pres. Ramon Magsaysay St.",
            "Pres. Osmeña St.",
            "Pres. Aguinaldo St.",
            "Gen Romulo St.",
            "Pres. Quirino St.",
            "Pres. Garcia St.",
            "Pres. Jose Laurel St.",
            "Pres. Quezon St.",
        ],
        "Don Juan Extension": [
            "Extension Road",
            "Main Street",
            "Side Street",
            "Corner Street",
        ],
        "Margarita Village": [
            "T.C. Lacson Ave.",
            "M.B. Ramas St.",
            "C.B. Rabacal St.",
            "E.A. Parana St.",
            "F.B. Kyamko St.",
            "O.V. Gaviola St.",
            "P/CPT. A.C. Lacson St.",
            "L.Y. Apuhin St.",
            "E.L Ramos St.",
            "C.Y. Antonio St.",
            "S.C. Carmona St.",
            "Margarita Extension",
        ],
        Mondragon: ["Mondragon St.", "Quisumbing St.", "Eusebio Rd."],
        Caballero: [
            "Magsaysay St.",
            "Caballero St.",
            "Jose Abad Santos St.",
            "Endrina St.",
        ],
        Mansfield: [
            "Beer St.",
            "Sake St.",
            "Wine St.",
            "Rum St.",
            "Tequila St.",
            "Cognac St.",
            "Champagne St.",
            "Absinthe St.",
            "Gin St.",
            "Vodka St.",
            "Whiskey St.",
            "Brandy St.",
        ],
        "San Julio": [
            "Nangka St.",
            "Caimito St.",
            "Mapa St.",
            "Chico St.",
            "Ilang Ilang St.",
            "Pili St.",
            "Campanilla St.",
            "Zenia St.",
            "Sampaguita St.",
            "Gumamela St.",
            "Dahlia St.",
            "Calachuchi St.",
            "Jasmin St.",
            "Santol St.",
            "Casoy St.",
        ],
        "Teachers Village": [
            "Sapphire St.",
            "Gold St.",
            "Silver St.",
            "Ruby St.",
            "Pearl St.",
            "Jade St.",
        ],
        Bulangan: ["Broce St."],
        Sumakwel: [
            "Sumakwel Avenue",
            "Tribal Street",
            "Heritage Road",
            "Cultural Street",
        ],
    };

    const zones = Object.keys(zoneStreets);
    const availableStreets = selectedZone
        ? zoneStreets[selectedZone] || []
        : [];

    // Reset street when zone changes
    useEffect(() => {
        if (selectedZone && setValue) {
            setValue("street", "");
        }
    }, [selectedZone, setValue]);

    // Calculate resident type based on duration
    const calculateResidentType = (dateStarted) => {
        if (!dateStarted) return "";

        const startDate = new Date(dateStarted);
        const today = new Date();
        const monthsDiff =
            (today.getFullYear() - startDate.getFullYear()) * 12 +
            (today.getMonth() - startDate.getMonth());

        return monthsDiff >= 6 ? "official" : "temporary";
    };

    const showPermanentAddress = ["renter", "boarder", "temporary"].includes(
        residencyStatus,
    );

    return (
        <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    Address Information
                </h2>

                <div className="space-y-6">
                    {/* Current Address Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">
                            Current Address
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Zone <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register("zone", {
                                        required: "Zone is required",
                                    })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors?.zone
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Select Zone</option>
                                    {zones.map((zone) => (
                                        <option key={zone} value={zone}>
                                            {zone}
                                        </option>
                                    ))}
                                </select>
                                {errors?.zone && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.zone.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Street{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register("street", {
                                        required: "Street is required",
                                    })}
                                    disabled={!selectedZone}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                        errors?.street
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">
                                        {selectedZone
                                            ? "Select Street"
                                            : "Select Zone First"}
                                    </option>
                                    {availableStreets.map((street) => (
                                        <option key={street} value={street}>
                                            {street}
                                        </option>
                                    ))}
                                </select>
                                {errors?.street && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.street.message}
                                    </p>
                                )}
                            </div>
                            {/* <div className="space-y-2 mt-6">
                                <Input
                                    register={register("houseNumber")}
                                    error={errors?.houseNumber?.message}
                                    label="House No."
                                    type="text"
                                    name="houseNumber"
                                    placeholder="e.g., 123"
                                />
                            </div> */}
                            <div className="space-y-2 mt-6">
                                <Input
                                    register={register("houseNumber")}
                                    error={errors?.houseNumber?.message}
                                    label="House No."
                                    type="number"
                                    name="houseNumber"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="space-y-2">
                                <Input
                                    register={register("barangay")}
                                    error={errors?.barangay?.message}
                                    label="Barangay"
                                    type="text"
                                    name="barangay"
                                    value="Barangay II"
                                    disabled
                                    className="bg-gray-100"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    register={register("municipality")}
                                    error={errors?.municipality?.message}
                                    label="City / Municipality"
                                    type="text"
                                    name="municipality"
                                    value="San Carlos City"
                                    disabled
                                    className="bg-gray-100"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    register={register("province")}
                                    error={errors?.province?.message}
                                    label="Province"
                                    type="text"
                                    name="province"
                                    value="Negros Occidental"
                                    disabled
                                    className="bg-gray-100"
                                />
                            </div>
                        </div>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-6">
                                <div className="space-y-2">
                                    <Input
                                        register={register("zip", {
                                            required: "Zip code is required",
                                        })}
                                        error={errors?.zip?.message}
                                        label="Zip Code"
                                        type="number"
                                        name="zip"
                                        placeholder="e.g., 6127"
                                    />
                                </div>
                            </div>
                    </div>

                    {/* Residency Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">
                            Residency Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Select
                                    register={register("residencyStatus", {
                                        required:
                                            "Residency status is required",
                                    })}
                                    error={errors?.residencyStatus?.message}
                                    name="residencyStatus"
                                    label="Residency Status"
                                    options={[
                                        { value: "", label: "Select Status" },
                                        {
                                            value: "homeowner",
                                            label: "Homeowner",
                                        },
                                        { value: "renter", label: "Renter" },
                                        { value: "boarder", label: "Boarder" },
                                        {
                                            value: "living_with_relatives",
                                            label: "Living with Relatives",
                                        },
                                        {
                                            value: "temporary",
                                            label: "Temporary Resident",
                                        },
                                        { value: "others", label: "Others" },
                                    ]}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    register={register("dateStartedLiving", {
                                        required:
                                            "Date started living is required",
                                        validate: {
                                            notFuture: (value) => {
                                                const selectedDate = new Date(
                                                    value,
                                                );
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                return (
                                                    selectedDate <= today ||
                                                    "Date cannot be in the future"
                                                );
                                            },
                                        },
                                    })}
                                    error={errors?.dateStartedLiving?.message}
                                    label="Date Started Living in Barangay"
                                    type="date"
                                    name="dateStartedLiving"
                                />
                                {dateStartedLiving && (
                                    <p className="text-xs text-gray-600 mt-1">
                                        Resident Type:{" "}
                                        <span className="font-semibold">
                                            {calculateResidentType(
                                                dateStartedLiving,
                                            ) === "official"
                                                ? "Official Resident (6+ months)"
                                                : "Temporary Resident (< 6 months)"}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {residencyStatus === "others" && (
                            <div className="grid grid-cols-1 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Input
                                        register={register(
                                            "residencyStatusOther",
                                            {
                                                required:
                                                    "Please specify residency status",
                                            },
                                        )}
                                        error={
                                            errors?.residencyStatusOther
                                                ?.message
                                        }
                                        label="Please Specify"
                                        type="text"
                                        name="residencyStatusOther"
                                        placeholder="Specify your residency status"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Permanent Address (Conditional) */}
                    {showPermanentAddress && (
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <h3 className="text-sm font-semibold text-amber-800 mb-4">
                                Permanent Address{" "}
                                <span className="text-red-500">*</span>
                            </h3>
                            <p className="text-xs text-amber-700 mb-4">
                                Since you are a{" "}
                                {residencyStatus === "renter"
                                    ? "renter"
                                    : residencyStatus === "boarder"
                                      ? "boarder"
                                      : "temporary resident"}
                                , please provide your permanent address.
                            </p>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Complete Permanent Address
                                </label>
                                <textarea
                                    {...register("permanentAddress", {
                                        required: showPermanentAddress
                                            ? "Permanent address is required"
                                            : false,
                                    })}
                                    rows="3"
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors?.permanentAddress
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Complete address including House No., Street, Barangay, City/Municipality, Province, Zip Code"
                                />
                                {errors?.permanentAddress && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.permanentAddress.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Contact Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">
                            Contact Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input
                                    register={register("contactNumber", {
                                        required: "Contact number is required",
                                        pattern: {
                                            value: /^[0-9]{10,13}$/,
                                            message:
                                                "Please enter a valid contact number (10-13 digits)",
                                        },
                                    })}
                                    error={errors?.contactNumber?.message}
                                    label="Contact Number"
                                    type="number"
                                    name="contactNumber"
                                    placeholder="e.g., 09123456789"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    register={register("emailAddress", {
                                        required: "Email address is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message:
                                                "Please enter a valid email address",
                                        },
                                    })}
                                    error={errors?.emailAddress?.message}
                                    label="Email Address"
                                    type="email"
                                    name="emailAddress"
                                    placeholder="e.g., juan.delacruz@email.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
