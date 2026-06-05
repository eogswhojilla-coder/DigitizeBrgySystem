import React, { useState, useRef } from "react";
import BasicInfoSection from "./basic-info-section";
import OtherInfoSection from "./other-info-section";
import GuardianSection from "./guardian-section";
import AccountSection from "./account-section";
import { useForm } from "react-hook-form";
import { register_resident_service } from "@/app/services/registration-service";
import Swal from "sweetalert2";
import Button from "@/app/_components/button";
import NewResidentLayout from "../layout-resident";
import { ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";

export default function TabsSection() {
    const [activeTab, setActiveTab] = useState("basic");
    const [completedSteps, setCompletedSteps] = useState(["basic"]); // Track completed steps
    const resetImageRef = useRef(null);

    const {
        register,
        handleSubmit,
        isSubmitting,
        reset,
        trigger,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const tabs = [
        { id: "basic", label: "Basic Info", icon: "1" },
        { id: "other", label: "Other Info", icon: "2" },
        { id: "guardian", label: "Guardian", icon: "3" },
        { id: "account", label: "Account", icon: "4" },
    ];

    // Define fields for each step
    const stepFields = {
        basic: [
            "voters",
            "dateOfBirth",
            "placeOfBirth",
            "pwd",
            "singleParent",
            "firstName",
            "middleName",
            "lastName",
            "suffix",
            "gender",
            "civilStatus",
            "religion",
            "nationality",
        ],
        other: [
            "residencyStatus",
            "dateStartedLiving",
            "zone",
            "street",
            "houseNumber",
            "contactNumber",
            "emailAddress",
        ],
        guardian: ["fatherName", "motherName", "guardian", "contact"],
        account: ["username", "password", "confirmPassword"],
    };

    const getStepIndex = (tabId) => tabs.findIndex((tab) => tab.id === tabId);
    const currentStepIndex = getStepIndex(activeTab);
    const progressPercentage = Math.round(((currentStepIndex + 1) / tabs.length) * 100);

    const handleTabChange = async (tabId) => {
        const targetIndex = getStepIndex(tabId);
        const currentIndex = getStepIndex(activeTab);

        // Allow going back to previous steps
        if (targetIndex < currentIndex) {
            setActiveTab(tabId);
            return;
        }

        // If trying to move forward, validate current step first
        if (targetIndex > currentIndex) {
            const fieldsToValidate = stepFields[activeTab];
            const isValid = await trigger(fieldsToValidate);

            if (!isValid) {
                await Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: "Please fill in all required fields correctly before proceeding.",
                    confirmButtonColor: "#ef4444",
                });
                return;
            }
        }

        // Check if the target step is unlocked
        if (
            completedSteps.includes(tabId) ||
            targetIndex === currentIndex + 1
        ) {
            setActiveTab(tabId);
            // Mark the new step as accessible
            if (!completedSteps.includes(tabId)) {
                setCompletedSteps([...completedSteps, tabId]);
            }
        } else {
            // Show alert if trying to skip steps
            await Swal.fire({
                icon: "warning",
                title: "Complete Previous Steps",
                text: "Please complete the previous step before proceeding.",
                confirmButtonColor: "#3b82f6",
            });
        }
    };

    const handleNext = async () => {
        // Validate current step fields
        const fieldsToValidate = stepFields[activeTab];
        const isValid = await trigger(fieldsToValidate);

        if (!isValid) {
            // Show validation error alert
            await Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please fill in all required fields correctly before proceeding.",
                confirmButtonColor: "#ef4444",
            });
            return;
        }

        // Proceed to next step
        const currentIndex = getStepIndex(activeTab);
        if (currentIndex < tabs.length - 1) {
            const nextTab = tabs[currentIndex + 1];
            if (!completedSteps.includes(nextTab.id)) {
                setCompletedSteps([...completedSteps, nextTab.id]);
            }
            setActiveTab(nextTab.id);
        }
    };

    const handlePrevious = () => {
        const currentIndex = getStepIndex(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1].id);
        }
    };

    const isStepAccessible = (tabId) => {
        const targetIndex = getStepIndex(tabId);
        const currentIndex = getStepIndex(activeTab);
        return completedSteps.includes(tabId) || targetIndex <= currentIndex;
    };

    const handleBackToLogin = () => {
        router.visit(route("login"));
    };

    const onSubmit = async (data) => {
        try {
            const response = await register_resident_service(data);
            
            await Swal.fire({
                icon: "success",
                title: "Registration Successful!",
                text: response?.data?.message || "Please wait for admin approval to access your account.",
                confirmButtonColor: "#3b82f6",
            });
            
            reset();
            if (resetImageRef.current) resetImageRef.current();
            setActiveTab("basic");
            setCompletedSteps(["basic"]);
            
            // Redirect to login page after successful registration
            setTimeout(() => {
                router.visit(route("login"));
            }, 2000);
            
        } catch (error) {
            console.error('Registration error:', error);
            
            let errorMessage = "An error occurred during registration. Please try again.";
            
            // Handle validation errors
            if (error?.response?.data?.errors) {
                const errors = error.response.data.errors;
                errorMessage = Object.values(errors).flat().join('\n');
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            await Swal.fire({
                icon: "error",
                title: "Registration Failed!",
                text: errorMessage,
                confirmButtonColor: "#3b82f6",
            });
        }
    };

    return (
        <div className="min-h-screen px-4 py-4 md:px-6 md:py-6 bg-gray-50">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-[95%] xl:max-w-[1600px] mx-auto"
            >
                {/* Back to Login Button */}
                <div className="mb-4">
                    <button
                        type="button"
                        onClick={handleBackToLogin}
                        className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Login</span>
                    </button>
                </div>

                {/* Modern Stepper Progress */}
                <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                    {/* Progress Percentage */}
                    <div className="flex justify-end mb-4">
                        <div className="text-xl md:text-2xl font-bold text-purple-600">
                            {progressPercentage}%
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200" 
                             style={{ 
                                 left: '2.5rem', 
                                 right: '2.5rem' 
                             }}>
                            <div 
                                className="h-full bg-purple-600 transition-all duration-500 ease-in-out"
                                style={{ 
                                    width: `${(currentStepIndex / (tabs.length - 1)) * 100}%` 
                                }}
                            />
                        </div>

                        {/* Steps */}
                        <div className="relative flex justify-between">
                            {tabs.map((tab, index) => {
                                const isActive = index === currentStepIndex;
                                const isCompleted = index < currentStepIndex;
                                const isAccessible = isStepAccessible(tab.id);
                                
                                return (
                                    <div key={tab.id} className="flex flex-col items-center" style={{ width: '100px' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleTabChange(tab.id)}
                                            disabled={!isAccessible}
                                            className={`
                                                relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center 
                                                font-semibold text-sm md:text-base transition-all duration-300 
                                                ${isActive 
                                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-300 scale-110' 
                                                    : isCompleted
                                                    ? 'bg-purple-600 text-white'
                                                    : isAccessible
                                                    ? 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }
                                                ${isAccessible && !isActive && 'hover:scale-105'}
                                            `}
                                        >
                                            {isCompleted ? (
                                                <svg 
                                                    className="w-5 h-5 md:w-6 md:h-6" 
                                                    fill="currentColor" 
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path 
                                                        fillRule="evenodd" 
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                                        clipRule="evenodd" 
                                                    />
                                                </svg>
                                            ) : (
                                                <span>{index + 1}</span>
                                            )}
                                        </button>
                                        <div className="mt-2 text-center">
                                            <p className={`
                                                text-xs md:text-sm font-medium transition-colors duration-300
                                                ${isActive 
                                                    ? 'text-purple-600' 
                                                    : isCompleted
                                                    ? 'text-purple-500'
                                                    : isAccessible
                                                    ? 'text-gray-600'
                                                    : 'text-gray-400'
                                                }
                                            `}>
                                                {tab.label}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <NewResidentLayout errors={errors} register={register} onResetImage={resetImageRef}>
                        {activeTab === "basic" && (
                            <BasicInfoSection
                                errors={errors}
                                register={register}
                            />
                        )}
                        {activeTab === "other" && (
                            <OtherInfoSection
                                errors={errors}
                                register={register}
                                watch={watch}
                                setValue={setValue}
                            />
                        )}
                        {activeTab === "guardian" && (
                            <GuardianSection
                                errors={errors}
                                register={register}
                            />
                        )}
                        {activeTab === "account" && (
                            <AccountSection
                                errors={errors}
                                register={register}
                            />
                        )}
                    </NewResidentLayout>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-6 flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <div className="flex gap-3">
                        {currentStepIndex > 0 && (
                            <Button
                                type="button"
                                onClick={handlePrevious}
                                variant="secondary"
                                className="px-6 py-2.5 rounded-lg font-medium transition-all hover:shadow-md"
                            >
                                Previous
                            </Button>
                        )}
                        {currentStepIndex < tabs.length - 1 && (
                            <Button 
                                type="button" 
                                onClick={handleNext}
                                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all hover:shadow-md"
                            >
                                Next
                            </Button>
                        )}
                    </div>
                    {activeTab === "account" && (
                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            variant="success"
                            className="px-6 py-2.5 rounded-lg font-medium transition-all hover:shadow-md flex items-center gap-2"
                        >
                            <span className="text-lg">+</span>
                            <span>{isSubmitting ? "Saving..." : "Submit Registration"}</span>
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
