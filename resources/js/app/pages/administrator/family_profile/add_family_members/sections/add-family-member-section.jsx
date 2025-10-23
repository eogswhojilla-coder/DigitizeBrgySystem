import Button from "@/app/_components/button";
import React, { useState } from "react";
import {
    Plus,
    Users,
    Search,
    Trash2,
    UserPlus,
    Hash,
    Heart,
    Briefcase,
} from "lucide-react";
import Input from "@/app/_components/input";
import { useFieldArray, useForm } from "react-hook-form";
import Select from "@/app/_components/select";
import Swal from "sweetalert2";
import { create_family_members_service } from "@/app/services/family-member";
export default function AddFamilyMemberSection() {
    const {
        register,
        control,
        handleSubmit,
        reset,
        isSubmitting,
        formState: { errors },
    } = useForm({
        defaultValues: {
            family_members: [
                {
                    family_id: null,
                    residentId: "",
                    isExistingResident: true,
                    newResidentName: "",
                    relationship: "",
                    role: "",
                    searchTerm: "",
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "family_members", // ✅ this is the key from defaultValues
    });

    const [selectedFamilyId, setSelectedFamilyId] = useState("");
    const [familyMembers, setFamilyMembers] = useState([]);
    console.log("familyMembers", familyMembers);

    // Sample data
    const existingFamilies = [
        {
            id: "FAM-202501",
            headOfFamily: "Juan Dela Cruz",
            address: "Sitio Maligaya, Main St.",
        },
        {
            id: "FAM-202502",
            headOfFamily: "Maria Santos",
            address: "Sitio Bagong Pag-asa, Church St.",
        },
        {
            id: "FAM-202503",
            headOfFamily: "Pedro Rodriguez",
            address: "Sitio Tahanan, Market St.",
        },
    ];

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
        (family) => family.id === selectedFamilyId
    );

    const onSubmit = async (data) => {
        try {
            await create_family_members_service(data);
            await Swal.fire({
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
            });

            reset();
        } catch (error) {}
    };
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
                            error={errors?.family_id?.message}
                            className="w-full pl-10 pr-4 py-2.5 border bg-white rounded-md focus:outline-none transition-all appearance-none"
                        >
                            <option value="">Select a family</option>
                            {existingFamilies.map((family) => (
                                <option
                                    key={family.family_id}
                                    value={family.family_id}
                                >
                                    {family.family_id} - {family.headOfFamily} (
                                    {family.address})
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.familyId && (
                        <p className="text-sm text-red-500 mt-1 ml-1">
                            {errors.familyId}
                        </p>
                    )}
                </div>

                {selectedFamily && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                            <strong>Selected Family:</strong>{" "}
                            {selectedFamily.headOfFamily} -{" "}
                            {selectedFamily.address}
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
                        onClick={() =>
                            append({
                                family_id: null,
                                residentId: "",
                                isExistingResident: true,
                                newResidentName: "",
                                relationship: "",
                                role: "",
                                searchTerm: "",
                            })
                        }
                        variant="primary"
                        outline
                        size="sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Member
                    </Button>
                </div>

                {fields.map((member, index) => (
                    <div
                        key={member.id}
                        className="border border-gray-200 rounded-lg p-4 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-800">
                                Member {index + 1}
                            </h4>
                            {index != 0 && (
                                <Button
                                    onClick={() => remove(index)}
                                    variant="danger"
                                    outline
                                    size="sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Resident Selection/Input */}
                            <div className="relative">
                                <Input
                                    label="New Resident Name"
                                    error={
                                        errors.family_members?.[index]
                                            ?.residentId?.message
                                    }
                                    register={register(
                                        `family_members.${index}.residentId`,
                                        {
                                            required: "Field is required",
                                        }
                                    )}
                                    name={`family_members.${index}.residentId`}
                                />
                            </div>

                            {/* Relationship */}
                            <div>
                                <div className="relative">
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
                                        label="Select Relationship"
                                        iconLeft={
                                            <Heart className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10" />
                                        }
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                {errors[`member_${index}_role`] && (
                                    <p className="text-sm text-red-500 mt-1 ml-1">
                                        {errors[`member_${index}_role`]}
                                    </p>
                                )}

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
                                    options={roles.map((rel) => ({
                                        label: rel,
                                        value: rel,
                                    }))}
                                    label="Select role"
                                    iconLeft={
                                        <Briefcase className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10" />
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
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
                                : `Save Family Members (${familyMembers.length})`}
                        </span>
                    </Button>

                    <Button
                        onClick={() => reset()}
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
