import React, { useState } from "react";
import TabsSection from "./sections/tabs-section";
import BackSection from "./sections/back-section";

function RegisterationForm() {
    const [formData, setFormData] = useState({
        // Basic Info

        voters: "",
        dateOfBirth: "",
        placeOfBirth: "",
        pwd: "",
        singleParent: "",
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        gender: "Male",
        civilStatus: "Single",
        religion: "",
        nationality: "",
        // Other Info (Address)
        municipality: "",
        zip: "",
        barangay: "",
        houseNumber: "",
        street: "",
        address: "",
        contactNumber: "",
        emailAddress: "",
        // Guardian
        fatherName: "",
        motherName: "",
        guardianName: "",
        guardianContact: "",
        // Account
        username: "",
        password: "",
        confirmPassword: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return <></>;
}

export default function Page() {
    return <TabsSection />;
}
