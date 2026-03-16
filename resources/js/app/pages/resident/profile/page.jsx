// resources/js/app/pages/resident/profile/page.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Layout from "../layout";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    Save,
    Lock,
    Eye,
    EyeOff,
    X,
    Shield,
} from "lucide-react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";

// ─── Constants ────────────────────────────────────────────────────────────────

const ZONE_STREETS = {
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

const ZONE_OPTIONS = Object.keys(ZONE_STREETS);

const DEFAULT_AVATAR = "/images/admin (1).png";

// ─── Sub-components (defined outside to avoid re-creation on each render) ─────

const InfoRow = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value || "-"}</dd>
    </div>
);

const PasswordField = ({ label, name, register, error, show, onToggle, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} *
        </label>
        <div className="relative">
            <input
                type={show ? "text" : "password"}
                {...register}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    error ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={placeholder}
            />
            <button
                type="button"
                onClick={onToggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

export default function Page() {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [residentData, setResidentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);

    // ── Profile form ──────────────────────────────────────────────────────────
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm();

    // ── Password form ─────────────────────────────────────────────────────────
    const {
        register: pwRegister,
        handleSubmit: handlePwSubmit,
        reset: pwReset,
        formState: { errors: pwErrors, isSubmitting: isPwSubmitting },
    } = useForm();

    const selectedZone = watch("zone");

    // Derive streets from the currently watched zone
    const availableStreets = useMemo(
        () => (selectedZone ? ZONE_STREETS[selectedZone] ?? [] : []),
        [selectedZone],
    );

    // ── Helpers ───────────────────────────────────────────────────────────────

    const buildFormDefaults = (user, resident) => ({
        emailAddress: resident?.emailAddress ?? "",
        contactNumber: resident?.contactNumber ?? "",
        civilStatus: resident?.civilStatus ?? "",
        houseNumber: resident?.houseNumber ?? "",
        street: resident?.street ?? "",
        zone: resident?.zone ?? "",
        permanentAddress: resident?.permanentAddress ?? "",
        // kept in form state but not editable by user
        email: user?.email ?? "",
        contact: user?.contact ?? "",
    });

    const resetForm = useCallback(
        (user, resident) => {
            reset(buildFormDefaults(user, resident));
        },
        [reset],
    );

    // ── Data fetching ─────────────────────────────────────────────────────────

    const fetchProfile = useCallback(async () => {
        try {
            const { data } = await axios.get("/api/my-profile");
            const { user, resident } = data.data;
            setUserData(user);
            setResidentData(resident);
            resetForm(user, resident);
        } catch (err) {
            console.error("Error fetching profile:", err);
        } finally {
            setLoading(false);
        }
    }, [resetForm]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // ── Cleanup object URLs to prevent memory leaks ───────────────────────────
    useEffect(() => {
        return () => {
            if (profileImagePreview) URL.revokeObjectURL(profileImagePreview);
        };
    }, [profileImagePreview]);

    // ── Memoised profile image URL ────────────────────────────────────────────
    const profileImageUrl = useMemo(() => {
        if (!residentData?.profileImage) return DEFAULT_AVATAR;
        return residentData.profileImage.startsWith("data:")
            ? residentData.profileImage
            : `/images/residents/${residentData.profileImage}`;
    }, [residentData?.profileImage]);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleCancelEdit = () => {
        setIsEditing(false);
        resetForm(userData, residentData);
    };

    const onSubmit = async (formData) => {
        try {
            const { data } = await axios.put("/api/my-profile", formData);
            await Swal.fire({
                icon: "success",
                title: "Profile Updated",
                text: "Your profile has been updated successfully",
                showConfirmButton: false,
                timer: 1500,
            });
            setIsEditing(false);
            const { user, resident } = data.data;
            setUserData(user);
            setResidentData(resident);
            resetForm(user, resident);
        } catch (err) {
            const errorMessage = err.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join("\n")
                : err.response?.data?.message ?? "Failed to update profile.";
            Swal.fire({ icon: "error", title: "Error", text: errorMessage });
        }
    };

    const onPasswordSubmit = async (formData) => {
        try {
            await axios.post("/api/change-password", {
                current_password: formData.current_password,
                new_password: formData.new_password,
                new_password_confirmation: formData.new_password_confirmation,
            });
            await Swal.fire({
                icon: "success",
                title: "Password Changed",
                text: "Your password has been changed successfully",
                showConfirmButton: false,
                timer: 1500,
            });
            closePasswordModal();
        } catch (err) {
            const errorMessage = err.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join("\n")
                : err.response?.data?.message ?? "Failed to change password.";
            Swal.fire({ icon: "error", title: "Error", text: errorMessage });
        }
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setShowCurrentPw(false);
        setShowNewPw(false);
        setShowConfirmPw(false);
        pwReset();
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Revoke previous preview before creating a new one
        if (profileImagePreview) URL.revokeObjectURL(profileImagePreview);
        setProfileImageFile(file);
        setProfileImagePreview(URL.createObjectURL(file));
    };

    const handleProfileImageUpload = async () => {
        if (!profileImageFile) return;
        const formData = new FormData();
        formData.append("profile_image", profileImageFile);
        try {
            await axios.post("/api/my-profile-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            await fetchProfile();
            setProfileImageFile(null);
            setProfileImagePreview(null);
            Swal.fire({
                icon: "success",
                title: "Profile Image Updated",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update profile image.",
            });
        }
    };

    // ── Derived display values ────────────────────────────────────────────────

    const fullName = [
        residentData?.firstName,
        residentData?.middleName,
        residentData?.lastName,
        residentData?.suffix,
    ]
        .filter(Boolean)
        .join(" ");

    const votersLabel =
        residentData?.voters === "YES"
            ? "Registered"
            : residentData?.voters === "NO"
            ? "Unregistered"
            : residentData?.voters;

    const permanentAddressDisplay = [
        residentData?.barangay,
        residentData?.municipality,
        residentData?.province,
    ]
        .filter(Boolean)
        .join(", ");

    // ── Loading state ─────────────────────────────────────────────────────────

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                </div>
            </Layout>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <Layout>
            <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                            My Profile
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            View and manage your personal information
                        </p>
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Lock className="w-4 h-4" />
                            <span className="hidden sm:inline">Change</span>{" "}
                            Password
                        </button>
                        <button
                            onClick={isEditing ? handleCancelEdit : () => setIsEditing(true)}
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {isEditing ? (
                                <><X className="w-5 h-5" /> Cancel</>
                            ) : (
                                <><Edit className="w-5 h-5" /> Edit Profile</>
                            )}
                        </button>
                    </div>
                </div>

                {/* ── Profile card ── */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Banner */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            <img
                                src={profileImagePreview ?? profileImageUrl}
                                alt="Profile"
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white object-cover shadow-lg"
                            />
                            {isEditing && (
                                <div className="flex flex-col items-center gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 file:rounded-full file:cursor-pointer"
                                    />
                                    {profileImageFile && (
                                        <button
                                            type="button"
                                            onClick={handleProfileImageUpload}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Upload Image
                                        </button>
                                    )}
                                </div>
                            )}
                            <div className="text-white text-center sm:text-left">
                                <h2 className="text-lg sm:text-2xl font-bold">{fullName}</h2>
                                <p className="text-blue-200 mt-1 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {userData?.email ?? "-"}
                                </p>
                                <p className="text-blue-200 mt-1 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    {residentData?.residentType ?? "Resident"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                            {/* ── Personal Information ── */}
                            <section>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 border-b pb-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    Personal Information
                                </h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    <InfoRow label="First Name" value={residentData?.firstName} />
                                    <InfoRow label="Middle Name" value={residentData?.middleName} />
                                    <InfoRow label="Last Name" value={residentData?.lastName} />
                                    <InfoRow label="Suffix" value={residentData?.suffix} />
                                    <InfoRow label="Gender" value={residentData?.gender} />
                                    <InfoRow
                                        label="Date of Birth"
                                        value={
                                            residentData?.dateOfBirth
                                                ? moment(residentData.dateOfBirth).format("MMMM D, YYYY")
                                                : null
                                        }
                                    />
                                    <InfoRow label="Place of Birth" value={residentData?.placeOfBirth} />
                                    <InfoRow label="Nationality" value={residentData?.nationality} />
                                    <InfoRow label="Voters Status" value={votersLabel} />
                                    <InfoRow label="PWD" value={residentData?.pwd} />
                                    <InfoRow label="Single Parent" value={residentData?.singleParent} />

                                    {/* Civil Status — read-only or editable */}
                                    {isEditing ? (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                Civil Status
                                            </label>
                                            <select
                                                {...register("civilStatus")}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select</option>
                                                {["Single", "Married", "Widowed", "Separated", "Divorced"].map(
                                                    (s) => (
                                                        <option key={s} value={s}>
                                                            {s}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>
                                    ) : (
                                        <InfoRow label="Civil Status" value={residentData?.civilStatus} />
                                    )}
                                </dl>
                            </section>

                            {/* ── Contact Information ── */}
                            <section>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 border-b pb-2">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                    Contact Information
                                </h3>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            {...register("emailAddress")}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Contact Number
                                        </label>
                                        <input
                                            type="text"
                                            {...register("contactNumber")}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-900"
                                        />
                                    </div>
                                </dl>
                            </section>

                            {/* ── Address Information ── */}
                            <section>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 border-b pb-2">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    Address Information
                                </h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            House Number
                                        </label>
                                        <input
                                            type="text"
                                            {...register("houseNumber")}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-900"
                                        />
                                    </div>

                                    {/* Zone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Zone
                                        </label>
                                        {isEditing ? (
                                            <select
                                                {...register("zone", {
                                                    onChange: () => setValue("street", ""),
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Zone</option>
                                                {ZONE_OPTIONS.map((zone) => (
                                                    <option key={zone} value={zone}>
                                                        {zone}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={residentData?.zone ?? "-"}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-900"
                                            />
                                        )}
                                    </div>

                                    {/* Street */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Street
                                        </label>
                                        {isEditing ? (
                                            <select
                                                {...register("street")}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Street</option>
                                                {availableStreets.map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={residentData?.street ?? "-"}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-900"
                                            />
                                        )}
                                    </div>
                                </dl>

                                <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
                                    <InfoRow label="Barangay" value={residentData?.barangay} />
                                    <InfoRow label="Municipality" value={residentData?.municipality} />
                                    <InfoRow label="Province" value={residentData?.province} />
                                </dl>

                                {/* FIX: use register properly — no conflicting `value` prop */}
                                <div className="mt-4 sm:mt-6">
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Permanent Address
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            {...register("permanentAddress")}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <textarea
                                            readOnly
                                            rows={2}
                                            value={permanentAddressDisplay}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                                        />
                                    )}
                                </div>
                            </section>

                            {/* ── Residency Information ── */}
                            <section>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 border-b pb-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    Residency Information
                                </h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    <InfoRow label="Residency Status" value={residentData?.residencyStatus} />
                                    <InfoRow
                                        label="Date Started Living"
                                        value={
                                            residentData?.dateStartedLiving
                                                ? moment(residentData.dateStartedLiving).format("MMMM D, YYYY")
                                                : null
                                        }
                                    />
                                    <InfoRow label="Resident Type" value={residentData?.residentType} />
                                </dl>
                            </section>

                            {/* ── Guardian / Family Information ── */}
                            <section>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 border-b pb-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    Guardian / Family Information
                                </h3>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <InfoRow label="Father's Name" value={residentData?.fatherName} />
                                    <InfoRow label="Mother's Name" value={residentData?.motherName} />
                                    <InfoRow label="Guardian's Name" value={residentData?.guardianName} />
                                    <InfoRow label="Guardian's Contact" value={residentData?.guardianContact} />
                                </dl>
                            </section>

                            {/* ── Account Information ── */}
                            <section>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 border-b pb-2">
                                    <Lock className="w-5 h-5 text-blue-600" />
                                    Account Information
                                </h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    <InfoRow label="Username" value={userData?.username} />
                                    <InfoRow
                                        label="Account Status"
                                        value={
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    userData?.status === "approved"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {userData?.status
                                                    ? userData.status.charAt(0).toUpperCase() +
                                                      userData.status.slice(1)
                                                    : "-"}
                                            </span>
                                        }
                                    />
                                    <InfoRow
                                        label="Member Since"
                                        value={
                                            userData?.created_at
                                                ? moment(userData.created_at).format("MMMM D, YYYY")
                                                : null
                                        }
                                    />
                                </dl>
                            </section>

                            {/* ── Save button ── */}
                            {isEditing && (
                                <div className="flex gap-3 pt-4 border-t">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 font-medium"
                                    >
                                        <Save className="w-5 h-5" />
                                        {isSubmitting ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* ── Change Password Modal ── */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-blue-600" />
                                    Change Password
                                </h2>
                                <button
                                    onClick={closePasswordModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handlePwSubmit(onPasswordSubmit)} className="p-4 space-y-4">
                                <PasswordField
                                    label="Current Password"
                                    register={pwRegister("current_password", {
                                        required: "Current password is required",
                                    })}
                                    error={pwErrors.current_password}
                                    show={showCurrentPw}
                                    onToggle={() => setShowCurrentPw((v) => !v)}
                                    placeholder="Enter current password"
                                />
                                <PasswordField
                                    label="New Password"
                                    register={pwRegister("new_password", {
                                        required: "New password is required",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters",
                                        },
                                    })}
                                    error={pwErrors.new_password}
                                    show={showNewPw}
                                    onToggle={() => setShowNewPw((v) => !v)}
                                    placeholder="Enter new password"
                                />
                                <PasswordField
                                    label="Confirm New Password"
                                    register={pwRegister("new_password_confirmation", {
                                        required: "Please confirm your new password",
                                    })}
                                    error={pwErrors.new_password_confirmation}
                                    show={showConfirmPw}
                                    onToggle={() => setShowConfirmPw((v) => !v)}
                                    placeholder="Confirm new password"
                                />

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={closePasswordModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPwSubmitting}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                                    >
                                        {isPwSubmitting ? "Changing..." : "Change Password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}