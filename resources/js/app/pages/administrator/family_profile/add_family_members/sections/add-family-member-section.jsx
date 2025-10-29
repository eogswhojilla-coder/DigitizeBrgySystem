import Button from "@/app/_components/button";
import React, { useState, useEffect } from "react";
import {
    Plus,
    Users,
    Search,
    Trash2,
    UserPlus,
    Hash,
    Heart,
    Briefcase,
    User,
} from "lucide-react";
import Input from "@/app/_components/input";
import { useFieldArray, useForm } from "react-hook-form";
import Select from "@/app/_components/select";
import Swal from "sweetalert2";
import { create_family_members_service } from "@/app/services/family-member";
import axios from "axios";

export default function AddFamilyMemberSection() {
    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            family_id: "",
            family_members: [
                {
                    residentId: "",
                    relationship: "",
                    role: "",
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "family_members",
    });

    const [existingFamilies, setExistingFamilies] = useState([]);
    const [loadingFamilies, setLoadingFamilies] = useState(true);
    const selectedFamilyId = watch("family_id");

    // Resident search states for each member
    const [memberSearchStates, setMemberSearchStates] = useState({});

    // Fetch families from database
    useEffect(() => {
        const fetchFamilies = async () => {
            try {
                const response = await axios.get("/api/families");
                setExistingFamilies(response.data.data || response.data);
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

    // Initialize search state for a member
    const initMemberSearch = (index) => {
        if (!memberSearchStates[index]) {
            setMemberSearchStates((prev) => ({
                ...prev,
                [index]: {
                    residents: [],
                    searchQuery: "",
                    showDropdown: false,
                    selectedResident: null,
                },
            }));
        }
    };

    // Fetch residents based on search query
    const handleMemberSearch = async (index, query) => {
        setMemberSearchStates((prev) => ({
            ...prev,
            [index]: {
                ...prev[index],
                searchQuery: query,
            },
        }));

        if (query.length > 0) {
            try {
                const response = await axios.get("/api/barangay_residents");
                const allResidents = response.data.data || response.data;

                // Filter residents based on search query
                const filtered = allResidents.filter((resident) => {
                    const fullName = `${resident.firstName || ""} ${
                        resident.middleName || ""
                    } ${resident.lastName || ""}`.toLowerCase();
                    return fullName.includes(query.toLowerCase());
                });

                setMemberSearchStates((prev) => ({
                    ...prev,
                    [index]: {
                        ...prev[index],
                        residents: filtered,
                        showDropdown: true,
                    },
                }));
            } catch (error) {
                console.error("Error fetching residents:", error);
            }
        } else {
            setMemberSearchStates((prev) => ({
                ...prev,
                [index]: {
                    ...prev[index],
                    residents: [],
                    showDropdown: false,
                },
            }));
        }
    };

    // Handle resident selection
    const handleResidentSelect = (index, resident) => {
        const fullName = `${resident.firstName} ${resident.middleName || ""} ${
            resident.lastName
        }`.trim();

        setMemberSearchStates((prev) => ({
            ...prev,
            [index]: {
                ...prev[index],
                searchQuery: fullName,
                selectedResident: resident,
                showDropdown: false,
            },
        }));

        setValue(`family_members.${index}.residentId`, resident.id);
    };

    const relationships = [
        "Spouse",
        "Son",
        "Daughter",
        "Father",
        "Mother",
        "Brother",
        "Sister",
        "Grandfather",
        "Grandmother",
        "Grandson",
        "Granddaughter",
        "Uncle",
        "Aunt",
        "Nephew",
        "Niece",
        "Cousin",
        "Son-in-law",
        "Daughter-in-law",
        "Father-in-law",
        "Mother-in-law",
        "Other Relative",
        "Non-relative",
    ];

    const roles = [
        "Student",
        "PWD (Person with Disability)",
        "Senior Citizen",
        "Working Adult",
        "Unemployed",
        "Housewife/Househusband",
        "Retiree",
        "Self-employed",
        "OFW (Overseas Filipino Worker)",
        "Minor",
        "Infant",
        "Other",
    ];

    const selectedFamily = existingFamilies.find(
        (family) => family.id === parseInt(selectedFamilyId)
    );

    const onSubmit = async (data) => {
        try {
            await create_family_members_service(data);
            await Swal.fire({
                icon: "success",
                title: "Family members saved successfully",
                showConfirmButton: false,
                timer: 1500,
            });

            reset();
            setMemberSearchStates({});
        } catch (error) {
            console.error("Error saving family members:", error);
            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: "Please try again later",
            });
        }
    };

    // Debounce timer for search
    useEffect(() => {
        const timers = {};

        Object.keys(memberSearchStates).forEach((index) => {
            const state = memberSearchStates[index];
            if (state.searchQuery !== undefined) {
                timers[index] = setTimeout(() => {
                    handleMemberSearch(parseInt(index), state.searchQuery);
                }, 300);
            }
        });

        return () => {
            Object.values(timers).forEach((timer) => clearTimeout(timer));
        };
    }, [Object.values(memberSearchStates).map((s) => s?.searchQuery).join(",")]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Hash className="inline w-4 h-4 mr-1" />
                    Select Family *
                </label>

                <div className="w-full">
                    <div className="relative">
                        <Users className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10" />
                        <select
                            {...register("family_id", {
                                required: "Field is required",
                            })}
                            disabled={loadingFamilies}
                            className="w-full pl-10 pr-4 py-2.5 border bg-white rounded-md focus:outline-none transition-all appearance-none"
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
                    {errors.family_id && (
                        <p className="text-sm text-red-500 mt-1 ml-1">
                            {errors.family_id.message}
                        </p>
                    )}
                </div>

                {selectedFamily && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                            <strong>Selected Family:</strong>{" "}
                            {selectedFamily.headOfFamily} - {selectedFamily.sitio}
                            , {selectedFamily.street}
                        </p>
                    </div>
                )}
            </div>

            {/* Family Members */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                        Family Members
                    </h3>
                    <Button
                        type="button"
                        onClick={() => {
                            append({
                                residentId: "",
                                relationship: "",
                                role: "",
                            });
                        }}
                        variant="primary"
                        outline
                        size="sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Member
                    </Button>
                </div>

                {fields.map((member, index) => {
                    // Initialize search state if not exists
                    if (!memberSearchStates[index]) {
                        initMemberSearch(index);
                    }

                    const searchState = memberSearchStates[index] || {
                        residents: [],
                        searchQuery: "",
                        showDropdown: false,
                        selectedResident: null,
                    };

                    return (
                        <div
                            key={member.id}
                            className="border border-gray-200 rounded-lg p-4 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-800">
                                    Member {index + 1}
                                </h4>
                                {index !== 0 && (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            remove(index);
                                            // Remove search state
                                            setMemberSearchStates((prev) => {
                                                const newState = { ...prev };
                                                delete newState[index];
                                                return newState;
                                            });
                                        }}
                                        variant="danger"
                                        outline
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {/* Resident Search */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Resident Name *
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                                        <input
                                            type="text"
                                            value={searchState.searchQuery}
                                            onChange={(e) => {
                                                const query = e.target.value;
                                                setMemberSearchStates((prev) => ({
                                                    ...prev,
                                                    [index]: {
                                                        ...prev[index],
                                                        searchQuery: query,
                                                    },
                                                }));
                                            }}
                                            onFocus={() => {
                                                if (searchState.residents.length > 0) {
                                                    setMemberSearchStates((prev) => ({
                                                        ...prev,
                                                        [index]: {
                                                            ...prev[index],
                                                            showDropdown: true,
                                                        },
                                                    }));
                                                }
                                            }}
                                            placeholder="Search resident by name..."
                                            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Dropdown Results */}
                                    {searchState.showDropdown &&
                                        searchState.residents.length > 0 && (
                                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {searchState.residents.map(
                                                    (resident) => (
                                                        <button
                                                            key={resident.id}
                                                            type="button"
                                                            onClick={() =>
                                                                handleResidentSelect(
                                                                    index,
                                                                    resident
                                                                )
                                                            }
                                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                    <User className="w-5 h-5 text-blue-600" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-gray-900 truncate">
                                                                        {
                                                                            resident.firstName
                                                                        }{" "}
                                                                        {resident.middleName ||
                                                                            ""}{" "}
                                                                        {
                                                                            resident.lastName
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 truncate">
                                                                        Age:{" "}
                                                                        {resident.age ||
                                                                            "N/A"}{" "}
                                                                        •{" "}
                                                                        {resident.sex ||
                                                                            "N/A"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        )}

                                    {/* No results message */}
                                    {searchState.showDropdown &&
                                        searchState.searchQuery.length > 0 &&
                                        searchState.residents.length === 0 && (
                                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                                                <p className="text-sm text-gray-500 text-center">
                                                    No residents found. Try a different
                                                    search term.
                                                </p>
                                            </div>
                                        )}

                                    {/* Selected Resident Info */}
                                    {searchState.selectedResident && (
                                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                <strong>Selected:</strong>{" "}
                                                {
                                                    searchState.selectedResident
                                                        .firstName
                                                }{" "}
                                                {searchState.selectedResident
                                                    .middleName || ""}{" "}
                                                {
                                                    searchState.selectedResident
                                                        .lastName
                                                }
                                                {searchState.selectedResident.age && (
                                                    <span>
                                                        {" "}
                                                        • Age:{" "}
                                                        {
                                                            searchState
                                                                .selectedResident.age
                                                        }
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {/* Hidden input for validation */}
                                    <input
                                        type="hidden"
                                        {...register(
                                            `family_members.${index}.residentId`,
                                            {
                                                required: "Resident is required",
                                            }
                                        )}
                                    />
                                    {errors.family_members?.[index]?.residentId && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {
                                                errors.family_members[index].residentId
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Relationship */}
                                    <div>
                                        <Select
                                            register={register(
                                                `family_members.${index}.relationship`,
                                                {
                                                    required: "Field is required",
                                                }
                                            )}
                                            error={
                                                errors.family_members?.[index]
                                                    ?.relationship?.message
                                            }
                                            options={relationships.map((rel) => ({
                                                label: rel,
                                                value: rel,
                                            }))}
                                            name={`family_members.${index}.relationship`}
                                            label="Relationship to Head"
                                            iconLeft={
                                                <Heart className="w-4 h-4 text-gray-500" />
                                            }
                                        />
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <Select
                                            register={register(
                                                `family_members.${index}.role`,
                                                {
                                                    required: "Field is required",
                                                }
                                            )}
                                            error={
                                                errors.family_members?.[index]?.role
                                                    ?.message
                                            }
                                            name={`family_members.${index}.role`}
                                            options={roles.map((role) => ({
                                                label: role,
                                                value: role,
                                            }))}
                                            label="Role/Status"
                                            iconLeft={
                                                <Briefcase className="w-4 h-4 text-gray-500" />
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
                <div className="flex gap-3">
                    <Button
                        disabled={isSubmitting}
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="flex-1 flex items-center justify-center space-x-2"
                    >
                        <Users className="w-5 h-5" />
                        <span>
                            {isSubmitting
                                ? "Saving..."
                                : `Save Family Members (${fields.length})`}
                        </span>
                    </Button>

                    <Button
                        type="button"
                        onClick={() => {
                            reset();
                            setMemberSearchStates({});
                        }}
                        variant="secondary"
                        outline
                        size="lg"
                    >
                        Reset Form
                    </Button>
                </div>
            </div>
        </form>
    );
}
