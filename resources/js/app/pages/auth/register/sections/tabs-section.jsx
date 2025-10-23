import React, { useState } from "react";
import BasicInfoSection from "./basic-info-section";
import OtherInfoSection from "./other-info-section";
import GuardianSection from "./guardian-section";
import AccountSection from "./account-section";
import { useForm } from "react-hook-form";
import { create_barangay_residents_service } from "@/app/services/barangay-resident-service";
import Swal from "sweetalert2";
import Button from "@/app/_components/button";
import NewResidentLayout from "../layout-resident";
import { ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";

export default function TabsSection() {
    const [activeTab, setActiveTab] = useState("basic");
    const [completedSteps, setCompletedSteps] = useState(["basic"]); // Track completed steps

    const {
        register,
        handleSubmit,
        isSubmitting,
        reset,
        trigger,
        formState: { errors },
    } = useForm();

    const tabs = [
        { id: "basic", label: "Basic Info" },
        { id: "other", label: "Other Info" },
        { id: "guardian", label: "Guardian" },
        { id: "account", label: "Account" },
    ];

    const getStepIndex = (tabId) => tabs.findIndex((tab) => tab.id === tabId);
    const currentStepIndex = getStepIndex(activeTab);

    const handleTabChange = async (tabId) => {
        const targetIndex = getStepIndex(tabId);
        const currentIndex = getStepIndex(activeTab);

        // Allow going back to previous steps
        if (targetIndex < currentIndex) {
            setActiveTab(tabId);
            return;
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
            await create_barangay_residents_service(data);
            await Swal.fire({
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
            });
            reset();
            setActiveTab("basic");
            setCompletedSteps(["basic"]);
        } catch (error) {}
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-7xl mx-auto"
            >
                {/* Step Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {tabs.map((tab, index) => (
                            <React.Fragment key={tab.id}>
                                <div className="flex flex-col items-center flex-1">
                                    <button
                                        type="button"
                                        onClick={() => handleTabChange(tab.id)}
                                        disabled={!isStepAccessible(tab.id)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
                                            index <= currentStepIndex
                                                ? "bg-blue-600 text-white"
                                                : isStepAccessible(tab.id)
                                                ? "bg-gray-300 text-gray-600 hover:bg-gray-400"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        } ${
                                            isStepAccessible(tab.id) &&
                                            "hover:scale-110"
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                    <span
                                        className={`mt-2 text-sm font-medium ${
                                            index <= currentStepIndex
                                                ? "text-blue-600"
                                                : isStepAccessible(tab.id)
                                                ? "text-gray-500"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {tab.label}
                                    </span>
                                </div>
                                {index < tabs.length - 1 && (
                                    <div className="flex-1 h-1 mx-4 -mt-8">
                                        <div
                                            className={`h-full transition-all duration-300 ${
                                                index < currentStepIndex
                                                    ? "bg-blue-600"
                                                    : "bg-gray-300"
                                            }`}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="py-6 flex items-center justify-between">
                    <div className="flex gap-2">
                        {currentStepIndex > 0 && (
                            <Button
                                type="button"
                                onClick={handlePrevious}
                                variant="secondary"
                            >
                                Previous
                            </Button>
                        )}
                        {currentStepIndex < tabs.length - 1 && (
                            <Button type="button" onClick={handleNext}>
                                Next
                            </Button>
                        )}
                    </div>
                    {activeTab === "account" && (
                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            variant="success"
                        >
                            <span className="text-lg">+</span>
                            <span>{isSubmitting ? "Saving..." : " Save"}</span>
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <NewResidentLayout errors={errors} register={register}>
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
                    {/* Back to Login Button */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
