import React, { useState } from "react";
import {
    Home,
    DollarSign,
    Hash,
    Users,
    Zap,
    Droplets,
    Wifi,
    Trash,
    FileText,
    Building,
} from "lucide-react";
import Button from "@/app/_components/button";
import Select from "@/app/_components/select";
import Input from "@/app/_components/input";
import { create_households_service } from "@/app/services/households-service";
import Swal from "sweetalert2";

export default function AddHouseholdDetailSection() {
    const [formData, setFormData] = useState({
        familyId: "",
        incomeType: "bracket", // 'bracket' or 'numeric'
        incomeBracket: "",
        numericIncome: "",
        houseType: "",
        numberOfRooms: "",
        electricity: false,
        water: false,
        internet: false,
        cable: false,
        landline: false,
        toiletType: "",
        wasteDisposal: "",
        notes: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sample families (replace with API later if needed)
    const existingFamilies = [
        {
            id: "FAM-202501",
            headOfFamily: "Juan Dela Cruz",
            address: "Sitio Maligaya, Main St.",
            memberCount: 4,
        },
        {
            id: "FAM-202502",
            headOfFamily: "Maria Santos",
            address: "Sitio Bagong Pag-asa, Church St.",
            memberCount: 3,
        },
        {
            id: "FAM-202503",
            headOfFamily: "Pedro Rodriguez",
            address: "Sitio Tahanan, Market St.",
            memberCount: 5,
        },
    ];

    const incomeBrackets = [
        "Below ₱10,000",
        "₱10,000 - ₱20,000",
        "₱20,001 - ₱30,000",
        "₱30,001 - ₱50,000",
        "₱50,001 - ₱75,000",
        "₱75,001 - ₱100,000",
        "Above ₱100,000",
    ];

    const houseTypes = [
        "Concrete",
        "Semi-concrete",
        "Wood",
        "Bamboo",
        "Mixed (Concrete & Wood)",
        "Nipa/Cogon",
        "Makeshift/Temporary",
        "Apartment/Condominium",
    ];

    const toiletTypes = [
        "Water-sealed toilet",
        "Closed pit latrine",
        "Open pit latrine",
        "Pour flush toilet",
        "Composting toilet",
        "Shared toilet facility",
        "No toilet facility",
    ];

    const wasteDisposalTypes = [
        "Collected by garbage truck",
        "Burning",
        "Burying",
        "Composting",
        "Throwing in vacant lot/waterway",
        "Feeding to animals",
        "Others",
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "number" && value === ""
                    ? ""
                    : value,
        });

        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleIncomeTypeChange = (type) => {
        setFormData((prev) => ({
            ...prev,
            incomeType: type,
            incomeBracket: "",
            numericIncome: "",
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.familyId) newErrors.familyId = "Please select a family";

        if (formData.incomeType === "bracket" && !formData.incomeBracket) {
            newErrors.income = "Please select an income bracket";
        }

        if (formData.incomeType === "numeric" && !formData.numericIncome) {
            newErrors.income = "Please enter monthly income";
        }

        if (!formData.houseType)
            newErrors.houseType = "Please select house type";

        if (!formData.numberOfRooms || parseInt(formData.numberOfRooms) < 0) {
            newErrors.numberOfRooms = "Please enter valid number of rooms";
        }

        if (!formData.toiletType)
            newErrors.toiletType = "Please select toilet type";
        if (!formData.wasteDisposal)
            newErrors.wasteDisposal = "Please select waste disposal";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            familyId: "",
            incomeType: "bracket",
            incomeBracket: "",
            numericIncome: "",
            houseType: "",
            numberOfRooms: "",
            electricity: false,
            water: false,
            internet: false,
            cable: false,
            landline: false,
            toiletType: "",
            wasteDisposal: "",
            notes: "",
        });
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await create_households_service(formData);
            Swal.fire({
                icon: "success",
                title: "Household saved successfully",
                showConfirmButton: false,
                timer: 1500,
            });
            resetForm();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed to save household",
                text: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedFamily = existingFamilies.find(
        (family) => family.id === formData.familyId
    );

    return (
        <form onSubmit={handleSubmit} className="">
            <div className="space-y-6">
                {/* FAMILY SELECTION */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        <Hash className="inline w-4 h-4 mr-1" />
                        Select Family ID *
                    </label>
                    <div className="relative">
                        <Users className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10" />
                        <select
                            name="familyId"
                            value={formData.familyId}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2.5 border bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a family</option>
                            {existingFamilies.map((family) => (
                                <option key={family.id} value={family.id}>
                                    {family.id} - {family.headOfFamily} (
                                    {family.memberCount} members)
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.familyId && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.familyId}
                        </p>
                    )}
                    {selectedFamily && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-800">
                                <strong>Selected Family:</strong>{" "}
                                {selectedFamily.headOfFamily} -{" "}
                                {selectedFamily.address}
                                <br />
                                <strong>Members:</strong>{" "}
                                {selectedFamily.memberCount}
                            </p>
                        </div>
                    )}
                </div>

                {/* Monthly Income */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" /> Monthly Income *
                    </h3>
                    <div className="flex gap-6 mb-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="incomeType"
                                checked={formData.incomeType === "bracket"}
                                onChange={() =>
                                    handleIncomeTypeChange("bracket")
                                }
                                className="mr-2"
                            />
                            Bracket
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="incomeType"
                                checked={formData.incomeType === "numeric"}
                                onChange={() =>
                                    handleIncomeTypeChange("numeric")
                                }
                                className="mr-2"
                            />
                            Specific amount
                        </label>
                    </div>
                    {formData.incomeType === "bracket" ? (
                        <select
                            name="incomeBracket"
                            value={formData.incomeBracket}
                            onChange={handleInputChange}
                            className="w-full border rounded-md px-3 py-2"
                        >
                            <option value="">Select income bracket</option>
                            {incomeBrackets.map((b) => (
                                <option key={b} value={b}>
                                    {b}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <Input
                            type="number"
                            name="numericIncome"
                            value={formData.numericIncome}
                            onChange={handleInputChange}
                            placeholder="Enter monthly income"
                        />
                    )}
                    {errors.income && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.income}
                        </p>
                    )}
                </div>

                {/* House Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2">House Type *</label>
                        <select
                            name="houseType"
                            value={formData.houseType}
                            onChange={handleInputChange}
                            className="w-full border rounded-md px-3 py-2"
                        >
                            <option value="">Select house type</option>
                            {houseTypes.map((h) => (
                                <option key={h} value={h}>
                                    {h}
                                </option>
                            ))}
                        </select>
                        {errors.houseType && (
                            <p className="text-sm text-red-500">
                                {errors.houseType}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2">Number of Rooms *</label>
                        <Input
                            type="number"
                            name="numberOfRooms"
                            value={formData.numberOfRooms}
                            onChange={handleInputChange}
                            placeholder="Enter number of rooms"
                        />
                        {errors.numberOfRooms && (
                            <p className="text-sm text-red-500">
                                {errors.numberOfRooms}
                            </p>
                        )}
                    </div>
                </div>

                {/* Utilities */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Zap className="w-5 h-5 mr-2" /> Utilities
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            "electricity",
                            "water",
                            "internet",
                            "cable",
                            "landline",
                        ].map((util) => (
                            <label
                                key={util}
                                className="flex items-center space-x-2 p-2 border rounded-md"
                            >
                                <input
                                    type="checkbox"
                                    name={util}
                                    checked={formData[util]}
                                    onChange={handleInputChange}
                                />
                                <span className="capitalize">{util}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Sanitation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2">Toilet Type *</label>
                        <select
                            name="toiletType"
                            value={formData.toiletType}
                            onChange={handleInputChange}
                            className="w-full border rounded-md px-3 py-2"
                        >
                            <option value="">Select toilet type</option>
                            {toiletTypes.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                        {errors.toiletType && (
                            <p className="text-sm text-red-500">
                                {errors.toiletType}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-2">Waste Disposal *</label>
                        <select
                            name="wasteDisposal"
                            value={formData.wasteDisposal}
                            onChange={handleInputChange}
                            className="w-full border rounded-md px-3 py-2"
                        >
                            <option value="">Select disposal method</option>
                            {wasteDisposalTypes.map((w) => (
                                <option key={w} value={w}>
                                    {w}
                                </option>
                            ))}
                        </select>
                        {errors.wasteDisposal && (
                            <p className="text-sm text-red-500">
                                {errors.wasteDisposal}
                            </p>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="block mb-2">Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full border rounded-md px-3 py-2"
                    />
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                       
                    >
                        {isSubmitting ? "Saving..." : "Save Household"}
                    </Button>
                    <Button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-300"
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </form>
    );
}
