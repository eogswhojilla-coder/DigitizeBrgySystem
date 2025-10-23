import Button from "@/app/_components/button";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Plus,
    Trash2,
    Edit,
    X,
    User,
    Users,
    MapPin,
    Calendar,
    FileText,
    AlertCircle,
    MessageSquare,
} from "lucide-react";
import { create_blotters_service } from "@/app/services/blotter-service";
import Swal from "sweetalert2";
import store from "@/app/store/store";
import { get_blotters_thunk } from "@/app/redux/blotter-thunk";

// Moved components outside to prevent redefinition on every render
const EnhancedModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

const FormSection = ({ icon: Icon, title, children }) => (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
                <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {children}
    </div>
);

const InputField = ({
    label,
    id,
    type = "text",
    placeholder,
    rows,
    required = false,
    register,
    error,
    ...props
}) => (
    <div>
        <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-2"
        >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {type === "textarea" ? (
            <textarea
                id={id}
                name={id}
                rows={rows}
                className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder={placeholder}
                {...register(id, {
                    required: required ? "This field is required" : false,
                })}
                {...props}
            />
        ) : (
            <input
                type={type}
                id={id}
                name={id}
                className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder={placeholder}
                {...register(id, {
                    required: required ? "This field is required" : false,
                })}
                {...props}
            />
        )}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

const ActionButton = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    ...props
}) => {
    const baseClasses =
        "px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
        danger: "bg-red-600 hover:bg-red-700 text-white",
    };
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default function NewRecordSection() {
    // Hooks
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const records = [
        {
            id: 1,
            blotterNumber: "2066133803768924",
            status: "NEW",
            remarks: "OPEN",
            incident: "qewr",
            location: "San Carlos",
            dateIncident: "04/25/2025 - 05:43 PM",
            dateReported: "04/25/2025 - 05:43 PM",
        },
        {
            id: 2,
            blotterNumber: "4108081920533098",
            status: "NEW",
            remarks: "OPEN",
            incident: "Sdaasd",
            location: "Sad",
            dateIncident: "04/11/2025 - 04:09 PM",
            dateReported: "04/25/2025 - 07:10 AM",
        },
    ];

    const handleSelectAll = (checked) => {
        setSelectedItems(checked ? records.map((r) => r.id) : []);
    };

    const handleSelectItem = (id, checked) => {
        setSelectedItems((prev) =>
            checked ? [...prev, id] : prev.filter((item) => item !== id)
        );
    };
    const submitForm = async (data) => {
        try {
            await create_blotters_service(data);
            await store.dispatch(get_blotters_thunk());
            await Swal.fire({
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
            });
            reset();
            setShowModal(false); // ✅ close modal here
        } catch (error) {
            console.error(
                "Error saving blotter:",
                error.response?.data || error.message
            );
            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: error.response?.data?.message || "Please try again later",
            });
        }
    };

    const filteredRecords = records.filter((record) =>
        Object.values(record).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div>
            <div>
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-800">
                        List of Records
                    </h1>

                    <Button onClick={() => setShowModal(true)}>
                        <Plus size={16} />
                        New Record
                    </Button>
                </div>

                <EnhancedModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                >
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                New Blotter Record
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Fill in the details for the incident report
                            </p>
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit(submitForm)} // ✅ fixed here
                        className="max-w-7xl mx-auto"
                    >
                        <div className="p-6 space-y-8">
                            {/* Complainant Section */}
                            <FormSection
                                icon={User}
                                title="Complainant Information"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="Resident Complainant"
                                        id="complainant_resident"
                                        placeholder="Enter resident complainant name"
                                        register={register}
                                        error={
                                            errors.complainant_resident?.message
                                        }
                                        required
                                    />
                                    <InputField
                                        label="Non-Resident Complainant"
                                        id="complainant_not_resident"
                                        placeholder="Enter non-resident complainant name"
                                        register={register}
                                        error={
                                            errors.complainant_not_resident
                                                ?.message
                                        }
                                        required
                                    />
                                </div>
                                <InputField
                                    label="Complainant Statement"
                                    id="complainant_statement"
                                    type="textarea"
                                    rows={4}
                                    placeholder="Provide detailed statement from the complainant..."
                                    register={register}
                                    error={
                                        errors.complainant_statement?.message
                                    }
                                    required
                                />
                            </FormSection>

                            {/* Respondent & Involved Persons */}
                            <FormSection
                                icon={Users}
                                title="Respondent & Involved Persons"
                            >
                                <InputField
                                    label="Respondent"
                                    id="respondent"
                                    placeholder="Enter respondent's full name"
                                    register={register}
                                    error={errors.respondent?.message}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="Resident Involved"
                                        id="person_involved_resident"
                                        placeholder="Enter resident involved"
                                        register={register}
                                        error={
                                            errors.person_involved_resident
                                                ?.message
                                        }
                                        required
                                    />
                                    <InputField
                                        label="Non-Resident Involved"
                                        id="person_involved_not_resident"
                                        placeholder="Enter non-resident involved"
                                        register={register}
                                        error={
                                            errors.person_involved_not_resident
                                                ?.message
                                        }
                                        required
                                    />
                                </div>
                                <InputField
                                    label="Statement from Involved Person"
                                    id="person_statement"
                                    type="textarea"
                                    rows={4}
                                    placeholder="Provide statement from the involved person..."
                                    register={register}
                                    error={errors.person_statement?.message}
                                    required
                                />
                            </FormSection>

                            {/* Incident Details */}
                            <FormSection
                                icon={AlertCircle}
                                title="Incident Details"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="Location of Incident"
                                        id="location_of_incident"
                                        placeholder="Enter specific location"
                                        register={register}
                                        error={
                                            errors.location_of_incident?.message
                                        }
                                        required
                                    />
                                    <InputField
                                        label="Date of Incident"
                                        id="date_of_incident"
                                        type="date"
                                        register={register}
                                        error={errors.date_of_incident?.message}
                                        required
                                    />
                                </div>
                                <InputField
                                    label="Incident Description"
                                    id="incident"
                                    type="textarea"
                                    rows={5}
                                    placeholder="Provide detailed description of what happened..."
                                    register={register}
                                    error={errors.incident?.message}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="Current Status"
                                        id="status"
                                        placeholder="e.g., Under Investigation, Resolved, Pending"
                                        register={register}
                                        error={errors.status?.message}
                                        required
                                    />
                                    <InputField
                                        label="Date Reported"
                                        id="date_reported"
                                        type="date"
                                        register={register}
                                        error={errors.date_reported?.message}
                                        required
                                    />
                                </div>
                            </FormSection>

                            {/* Additional Information */}
                            <FormSection
                                icon={MessageSquare}
                                title="Additional Information"
                            >
                                <InputField
                                    label="Remarks"
                                    id="remarks"
                                    type="textarea"
                                    rows={3}
                                    placeholder="Any additional notes, observations, or follow-up actions..."
                                    register={register}
                                    error={errors.remarks?.message}
                                    required
                                />
                            </FormSection>

                            {/* Action Buttons */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 -mx-6 -mb-6">
                                <ActionButton
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    variant="secondary"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </ActionButton>
                                <ActionButton
                                    type="submit"
                                    variant="primary"
                                    disabled={isSubmitting}
                                >
                                    <FileText className="h-4 w-4" />
                                    {isSubmitting
                                        ? "Creating..."
                                        : "Create Record"}
                                </ActionButton>
                            </div>
                        </div>
                    </form>
                </EnhancedModal>
            </div>
        </div>
    );
}
