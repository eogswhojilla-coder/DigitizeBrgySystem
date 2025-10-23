import Input from "@/app/_components/input";
import React, { useState } from "react";

export default function OtherInfoSection({ register, errors }) {
 
   
    return (
        <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    Address
                </h2>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                register={register("municipality", {
                                    required: "Field is required",
                                })}
                                error={errors?.municipality?.message}
                                label="Municipality"
                                type="text"
                                name="municipality"
                                className="w-full px-3 py-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                register={register("zip", {
                                    required: "Field is required",
                                })}
                                error={errors?.zip?.message}
                                label="Zip Code"
                                type="text"
                                name="zip"
                                className="w-full px-3 py-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                register={register("barangay", {
                                    required: "Field is required",
                                })}
                                error={errors?.barangay?.message}
                                label="Barangay"
                                type="text"
                                name="barangay"
                                className="w-full px-3 py-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                register={register("houseNumber", {
                                    required: "Field is required",
                                })}
                                error={errors?.houseNumber?.message}
                                label="House Number"
                                type="text"
                                name="houseNumber"
                                className="w-full px-3 py-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                register={register("street", {
                                    required: "Field is required",
                                })}
                                error={errors?.street?.message}
                                label="Street"
                                type="text"
                                name="street"
                                className="w-full px-3 py-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                register={register("address", {
                                    required: "Field is required",
                                })}
                                error={errors?.address?.message}
                                label="Address"
                                type="text"
                                name="address"
                                className="w-full px-3 py-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                register={register("contactNumber", {
                                    required: "Field is required",
                                })}
                                error={errors?.contactNumber?.message}
                                label="Contact Number"
                                type="text"
                                name="contactNumber"
                                className="w-full px-3 py-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                register={register("emailAddress", {
                                    required: "Field is required",
                                })}
                                error={errors?.emailAddress?.message}
                                label="Email Address"
                                type="text"
                                name="emailAddress"
                                className="w-full px-3 py-2 "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
