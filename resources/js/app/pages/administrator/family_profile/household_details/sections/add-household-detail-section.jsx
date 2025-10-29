import React, { useState, useEffect } from "react";
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
import axios from "axios";

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
    const [existingFamilies, setExistingFamilies] = useState([]);
    const [loadingFamilies, setLoadingFamilies] = useState(true);
    const [selectedFamilyDetails, setSelectedFamilyDetails] = useState(null);

    // Fetch families from database
    useEffect(() => {
        const fetchFamilies = async () => {
            try {
                const response = await axios.get("/api/families");
                const families = response.data.data || response.data;
                setExistingFamilies(families);
            } catch (error) {
                console.error("Error fetching families:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error loading families",
                    text: "Could not load family list",
                });
            } finally {
                setLoadingFamilies(false);
            }
        };

        fetchFamilies();
    }, []);

    // Fetch family details including members when a family is selected
    useEffect(() => {
        const fetchFamilyDetails = async () => {
            if (formData.familyId) {
                try {
                    const response = await axios.get(
                        `/api/families/${formData.familyId}`
                    );
                    setSelectedFamilyDetails(response.data);
                } catch (error) {
                    console.error("Error fetching family details:", error);
                }
            } else {
                setSelectedFamilyDetails(null);
            }
        };

        fetchFamilyDetails();
    }, [formData.familyId]);

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
        setSelectedFamilyDetails(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await create_households_service(formData);
            await Swal.fire({
                icon: "success",
                title: "Household saved successfully",
                showConfirmButton: false,
                timer: 1500,
            });
            resetForm();
        } catch (error) {
            console.error("Error saving household:", error);
            Swal.fire({
                icon: "error",
                title: "Failed to save household",
                text: error.response?.data?.message || error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="">
            <div className="space-y-6">
                {/* FAMILY SELECTION */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        <Hash className="inline w-4 h-4 mr-1" />
                        Select Family *
                    </label>
                    <div className="relative">
                        <Users className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10" />
                        <select
                            name="familyId"
                            value={formData.familyId}
                            onChange={handleInputChange}
                            disabled={loadingFamilies}
                            className="w-full pl-10 pr-4 py-2.5 border bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">
                                {loadingFamilies
                                    ? "Loading families..."
                                    : "Select a family"}
                            </option>
                            {existingFamilies.map((family) => (
                                <option key={family.id} value={family.id}>
                                    {family.familyNumber} - {family.headOfFamily}{" "}
                                    ({family.sitio}, {family.street})
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.familyId && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.familyId}
                        </p>
                    )}

                    {/* Display Selected Family Details */}
                    {selectedFamilyDetails && (
                        <div className="mt-3 space-y-3">
                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-md">
                                <h4 className="font-semibold text-orange-900 mb-2">
                                    Family Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <p className="text-orange-800">
                                        <strong>Family Number:</strong>{" "}
                                        {selectedFamilyDetails.familyNumber}
                                    </p>
                                    <p className="text-orange-800">
                                        <strong>Head of Family:</strong>{" "}
                                        {selectedFamilyDetails.headOfFamily}
                                    </p>
                                    <p className="text-orange-800">
                                        <strong>Address:</strong>{" "}
                                        {selectedFamilyDetails.sitio},{" "}
                                        {selectedFamilyDetails.street}
                                        {selectedFamilyDetails.houseNumber &&
                                            `, House #${selectedFamilyDetails.houseNumber}`}
                                    </p>
                                    <p className="text-orange-800">
                                        <strong>Ownership:</strong>{" "}
                                        {selectedFamilyDetails.ownershipType}
                                    </p>
                                </div>
                            </div>

                            {/* Display Family Members */}
                            {selectedFamilyDetails.members &&
                                selectedFamilyDetails.members.length > 0 && (
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                                            <Users className="w-4 h-4 mr-2" />
                                            Family Members (
                                            {selectedFamilyDetails.members.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedFamilyDetails.members.map(
                                                (member, index) => (
                                                    <div
                                                        key={member.id}
                                                        className="flex items-center justify-between text-sm bg-white p-2 rounded"
                                                    >
                                                        <div>
                                                            <span className="font-medium text-blue-900">
                                                                {index + 1}.{" "}
                                                                {member.resident
                                                                    ? `${member.resident.firstName} ${member.resident.middleName || ""} ${member.resident.lastName}`
                                                                    : "N/A"}
                                                            </span>
                                                            <span className="text-blue-700 ml-2">
                                                                ({member.relationship})
                                                            </span>
                                                        </div>
                                                        <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                                                            {member.role}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* Display existing household if any */}
                            {selectedFamilyDetails.household && (
                                <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-md">
                                    <p className="text-sm text-yellow-800">
                                        <strong>⚠️ Note:</strong> This family already
                                        has household details. Saving will update the
                                        existing record.
                                    </p>
                                </div>
                            )}
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
                        <label className="block mb-2 font-medium text-gray-700">
                            <Home className="inline w-4 h-4 mr-1" />
                            House Type *
                        </label>
                        <select
                            name="houseType"
                            value={formData.houseType}
                            onChange={handleInputChange}
                            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500"
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
                        <label className="block mb-2 font-medium text-gray-700">
                            <Building className="inline w-4 h-4 mr-1" />
                            Number of Rooms *
                        </label>
                        <Input
                            type="number"
                            name="numberOfRooms"
                            value={formData.numberOfRooms}
                            onChange={handleInputChange}
                            placeholder="Enter number of rooms"
                            min="0"
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
                        <Zap className="w-5 h-5 mr-2" /> Utilities & Amenities
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            { key: "electricity", label: "Electricity", icon: Zap },
                            { key: "water", label: "Water", icon: Droplets },
                            { key: "internet", label: "Internet", icon: Wifi },
                            { key: "cable", label: "Cable TV", icon: FileText },
                            { key: "landline", label: "Landline", icon: Hash },
                        ].map((util) => {
                            const Icon = util.icon;
                            return (
                                <label
                                    key={util.key}
                                    className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                        formData[util.key]
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-200 hover:border-orange-300"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        name={util.key}
                                        checked={formData[util.key]}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <Icon className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm">{util.label}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Sanitation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Toilet Type *
                        </label>
                        <select
                            name="toiletType"
                            value={formData.toiletType}
                            onChange={handleInputChange}
                            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500"
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
                        <label className="block mb-2 font-medium text-gray-700">
                            <Trash className="inline w-4 h-4 mr-1" />
                            Waste Disposal *
                        </label>
                        <select
                            name="wasteDisposal"
                            value={formData.wasteDisposal}
                            onChange={handleInputChange}
                            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500"
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
                    <label className="block mb-2 font-medium text-gray-700">
                        <FileText className="inline w-4 h-4 mr-1" />
                        Additional Notes
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Enter any additional information about the household..."
                        className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button
                        type="submit"
                        disabled={isSubmitting || loadingFamilies}
                        variant="primary"
                        size="lg"
                        className="flex-1"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        {isSubmitting ? "Saving..." : "Save Household Details"}
                    </Button>
                    <Button
                        type="button"
                        onClick={resetForm}
                        variant="secondary"
                        outline
                        size="lg"
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </form>
    );
}
