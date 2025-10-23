import Input from '@/app/_components/input'
import Select from '@/app/_components/select'
import React, { useState } from 'react'

export default function BasicInfoSection({register, errors }) {
 
    return (
        <>


            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Details</h2>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input
                                    register={register("firstName", { required: "Field is required" })}
                                    error={errors?.firstName?.message}
                                    label="First Name"
                                    placeholder="Enter First Name"
                                    type="text"
                                    name="firstName"

                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    register={register("middleName", { required: "Field is required" })}
                                    error={errors?.middleName?.message}
                                    label="Middle Name"
                                    type="text"
                                    name="middleName"

                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input
                                    register={register("lastName", { required: "Field is required" })}
                                    error={errors?.lastName?.message}
                                    label="Last Name"
                                    type="text"
                                    name="lastName"

                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    register={register("suffix", { required: "Field is required" })}
                                    error={errors?.suffix?.message}
                                    label="Suffix"
                                    type="text"
                                    name="suffix"

                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Select
                                    register={register("gender", { required: "Field is required" })}
                                    error={errors?.gender?.message}
                                    name="gender"
                                    label="Gender"

                                    options={[
                                        { value: "Male", label: "Male" },
                                        { value: "Female", label: "Female" },
                                        { value: "Other", label: "Other" },
                                    ]}
                                />
                            </div>
                            <div className="space-y-2">
                                <Select
                                    register={register("civilStatus", { required: "Field is required" })}
                                    error={errors?.civilStatus?.message}
                                    name="civilStatus"
                                    label="Civil Status"

                                    options={[
                                        { value: "Single", label: "Single" },
                                        { value: "Married", label: "Married" },
                                        { value: "Divorced", label: "Divorced" },
                                        { value: "Widowed", label: "Widowed" },
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input
                                    register={register("religion", { required: "Field is required" })}
                                    error={errors?.religion?.message}
                                    label="Religion"
                                    type="text"
                                    name="religion"

                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    register={register("nationality", { required: "Field is required" })}
                                    error={errors?.nationality?.message}
                                    label="Nationality"
                                    type="text"
                                    name="nationality"
                                    
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </>
    )
}
