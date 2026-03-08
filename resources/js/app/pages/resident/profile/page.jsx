// resources/js/app/pages/resident/profile/page.jsx

import React, { useState, useEffect } from "react";
import Layout from "../layout";
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, Lock, Eye, EyeOff, X, Shield } from 'lucide-react';
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";

const zoneStreets = {
    "Don Juan Subdivision": [
        "Pres. Ramon Magsaysay St.", "Pres. Osmeña St.", "Pres. Aguinaldo St.",
        "Gen Romulo St.", "Pres. Quirino St.", "Pres. Garcia St.",
        "Pres. Jose Laurel St.", "Pres. Quezon St.",
    ],
    "Don Juan Extension": ["Extension Road", "Main Street", "Side Street", "Corner Street"],
    "Margarita Village": [
        "T.C. Lacson Ave.", "M.B. Ramas St.", "C.B. Rabacal St.", "E.A. Parana St.",
        "F.B. Kyamko St.", "O.V. Gaviola St.", "P/CPT. A.C. Lacson St.",
        "L.Y. Apuhin St.", "E.L Ramos St.", "C.Y. Antonio St.",
        "S.C. Carmona St.", "Margarita Extension",
    ],
    Mondragon: ["Mondragon St.", "Quisumbing St.", "Eusebio Rd."],
    Caballero: ["Magsaysay St.", "Caballero St.", "Jose Abad Santos St.", "Endrina St."],
    Mansfield: [
        "Beer St.", "Sake St.", "Wine St.", "Rum St.", "Tequila St.", "Cognac St.",
        "Champagne St.", "Absinthe St.", "Gin St.", "Vodka St.", "Whiskey St.", "Brandy St.",
    ],
    "San Julio": [
        "Nangka St.", "Caimito St.", "Mapa St.", "Chico St.", "Ilang Ilang St.",
        "Pili St.", "Campanilla St.", "Zenia St.", "Sampaguita St.", "Gumamela St.",
        "Dahlia St.", "Calachuchi St.", "Jasmin St.", "Santol St.", "Casoy St.",
    ],
    "Teachers Village": ["Sapphire St.", "Gold St.", "Silver St.", "Ruby St.", "Pearl St.", "Jade St."],
    Bulangan: ["Broce St."],
    Sumakwel: ["Sumakwel Avenue", "Tribal Street", "Heritage Road", "Cultural Street"],
};

export default function Page() {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [residentData, setResidentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm();

    const {
        register: pwRegister,
        handleSubmit: handlePwSubmit,
        reset: pwReset,
        formState: { errors: pwErrors, isSubmitting: isPwSubmitting },
    } = useForm();

    const selectedZone = watch("zone");
    const availableStreets = selectedZone ? zoneStreets[selectedZone] || [] : [];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get("/api/my-profile");
            const { user, resident } = response.data.data;
            setUserData(user);
            setResidentData(resident);
            resetForm(user, resident);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = (user, resident) => {
        reset({
            email: user?.email || "",
            contact: user?.contact || "",
            contactNumber: resident?.contactNumber || "",
            emailAddress: resident?.emailAddress || "",
            civilStatus: resident?.civilStatus || "",
            houseNumber: resident?.houseNumber || "",
            street: resident?.street || "",
            zone: resident?.zone || "",
            permanentAddress: resident?.permanentAddress || "",
        });
    };

    const onSubmit = async (data) => {
        try {
            const response = await axios.put("/api/my-profile", data);
            await Swal.fire({
                icon: "success",
                title: "Profile Updated",
                text: "Your profile has been updated successfully",
                showConfirmButton: false,
                timer: 1500,
            });
            setIsEditing(false);
            const { user, resident } = response.data.data;
            setUserData(user);
            setResidentData(resident);
            resetForm(user, resident);
        } catch (error) {
            const errorMessage = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat().join('\n')
                : error.response?.data?.message || "Failed to update profile.";
            Swal.fire({ icon: "error", title: "Error", text: errorMessage });
        }
    };

    const onPasswordSubmit = async (data) => {
        try {
            await axios.post("/api/change-password", {
                current_password: data.current_password,
                new_password: data.new_password,
                new_password_confirmation: data.new_password_confirmation,
            });
            await Swal.fire({
                icon: "success",
                title: "Password Changed",
                text: "Your password has been changed successfully",
                showConfirmButton: false,
                timer: 1500,
            });
            pwReset();
            setShowPasswordModal(false);
        } catch (error) {
            const errorMessage = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat().join('\n')
                : error.response?.data?.message || "Failed to change password.";
            Swal.fire({ icon: "error", title: "Error", text: errorMessage });
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    const InfoRow = ({ label, value }) => (
        <div>
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900">{value || "-"}</dd>
        </div>
    );

    const profileImageUrl = residentData?.profileImage
        ? (residentData.profileImage.startsWith('data:') ? residentData.profileImage : `/images/residents/${residentData.profileImage}`)
        : "/images/admin (1).png";

    return (
        <Layout>
            <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                            My Profile
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage your personal information</p>
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Lock className="w-4 h-4" />
                            <span className="hidden sm:inline">Change</span> Password
                        </button>
                        <button
                            onClick={() => {
                                if (isEditing) {
                                    setIsEditing(false);
                                    resetForm(userData, residentData);
                                } else {
                                    setIsEditing(true);
                                }
                            }}
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

                {/* Profile Card with Photo */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            <img
                                src={profileImageUrl}
                                alt="Profile"
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white object-cover shadow-lg"
                            />
                            <div className="text-white text-center sm:text-left">
                                <h2 className="text-lg sm:text-2xl font-bold">
                                    {residentData?.firstName} {residentData?.middleName} {residentData?.lastName} {residentData?.suffix || ""}
                                </h2>
                                <p className="text-blue-200 mt-1 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {userData?.email || "-"}
                                </p>
                                <p className="text-blue-200 mt-1 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    {residentData?.residentType || "Resident"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                            {/* Personal Information (Read-only) */}
                            <div>
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
                                        value={residentData?.dateOfBirth ? moment(residentData.dateOfBirth).format("MMMM D, YYYY") : null}
                                    />
                                    <InfoRow label="Place of Birth" value={residentData?.placeOfBirth} />
                                    <InfoRow label="Nationality" value={residentData?.nationality} />
                                    <InfoRow label="Voters Status" value={residentData?.voters === "YES" ? "Registered" : residentData?.voters === "NO" ? "Unregistered" : residentData?.voters} />
                                    <InfoRow label="PWD" value={residentData?.pwd} />
                                    <InfoRow label="Single Parent" value={residentData?.singleParent} />
                                    {!isEditing && (
                                        <InfoRow
                                            label="Civil Status"
                                            value={residentData?.civilStatus}
                                        />
                                    )}
                                    {isEditing && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Civil Status</label>
                                            <select
                                                {...register("civilStatus")}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Divorced">Divorced</option>
                                            </select>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 border-b pb-2">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                    Contact Information
                                </h3>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            {...register("emailAddress")}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Contact Number</label>
                                        <input
                                            type="text"
                                            {...register("contactNumber")}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-900"
                                        />
                                    </div>
                                </dl>
                            </div>

                            {/* Address Information */}
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 border-b pb-2">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    Address Information
                                </h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">House Number</label>
                                        <input
                                            type="text"
                                            {...register("houseNumber")}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Zone</label>
                                        {isEditing ? (
                                            <select
                                                {...register("zone")}
                                                onChange={(e) => {
                                                    setValue("zone", e.target.value);
                                                    setValue("street", "");
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Zone</option>
                                                {Object.keys(zoneStreets).map((zone) => (
                                                    <option key={zone} value={zone}>{zone}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={residentData?.zone || "-"}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-900"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Street</label>
                                        {isEditing ? (
                                            <select
                                                {...register("street")}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Street</option>
                                                {availableStreets.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={residentData?.street || "-"}
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
                                <div className="mt-4 sm:mt-6">
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Permanent Address</label>
                                    <textarea
                                        {...register("permanentAddress")}
                                        disabled={!isEditing}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Residency Information (Read-only) */}
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 border-b pb-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    Residency Information
                                </h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    <InfoRow label="Residency Status" value={residentData?.residencyStatus} />
                                    <InfoRow
                                        label="Date Started Living"
                                        value={residentData?.dateStartedLiving ? moment(residentData.dateStartedLiving).format("MMMM D, YYYY") : null}
                                    />
                                    <InfoRow label="Resident Type" value={residentData?.residentType} />
                                </dl>
                            </div>

                            {/* Guardian Information (Read-only) */}
                            <div>
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
                            </div>

                            {/* Account Information (Read-only) */}
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 border-b pb-2">
                                    <Lock className="w-5 h-5 text-blue-600" />
                                    Account Information
                                </h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    <InfoRow label="Username" value={userData?.username} />
                                    <InfoRow label="Account Status" value={
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            userData?.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                            {userData?.status?.charAt(0).toUpperCase() + userData?.status?.slice(1)}
                                        </span>
                                    } />
                                    <InfoRow label="Member Since" value={userData?.created_at ? moment(userData.created_at).format("MMMM D, YYYY") : null} />
                                </dl>
                            </div>

                            {/* Save Button */}
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

                {/* Change Password Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-blue-600" />
                                    Change Password
                                </h2>
                                <button
                                    onClick={() => { setShowPasswordModal(false); pwReset(); }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handlePwSubmit(onPasswordSubmit)} className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPw ? "text" : "password"}
                                            {...pwRegister("current_password", { required: "Current password is required" })}
                                            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                pwErrors.current_password ? "border-red-500" : "border-gray-300"
                                            }`}
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPw(!showCurrentPw)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {pwErrors.current_password && (
                                        <p className="text-sm text-red-500 mt-1">{pwErrors.current_password.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPw ? "text" : "password"}
                                            {...pwRegister("new_password", {
                                                required: "New password is required",
                                                minLength: { value: 8, message: "Password must be at least 8 characters" }
                                            })}
                                            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                pwErrors.new_password ? "border-red-500" : "border-gray-300"
                                            }`}
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPw(!showNewPw)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {pwErrors.new_password && (
                                        <p className="text-sm text-red-500 mt-1">{pwErrors.new_password.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPw ? "text" : "password"}
                                            {...pwRegister("new_password_confirmation", {
                                                required: "Please confirm your new password",
                                            })}
                                            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                pwErrors.new_password_confirmation ? "border-red-500" : "border-gray-300"
                                            }`}
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPw(!showConfirmPw)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {pwErrors.new_password_confirmation && (
                                        <p className="text-sm text-red-500 mt-1">{pwErrors.new_password_confirmation.message}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => { setShowPasswordModal(false); pwReset(); }}
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