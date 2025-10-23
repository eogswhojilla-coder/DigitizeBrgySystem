import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import { Users, Search, Edit, Trash2, X, Plus, Camera } from "lucide-react";
import SearchAdministratorUserSection from "./sections/search-administrator-user-section";
import TableAdministratorUserSection from "./sections/table-administrator-user-section";


import ButtonAdministratorUserSection from "./sections/button-administrator-user-section";
import { get_administrator_thunk } from "@/app/redux/administrator-thunk";
import store from "@/app/store/store";
import PaginationSection from "./sections/pagination-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_administrator_thunk());
    }, []);
    return (
        <Layout>
            <AdminUserTable />
        </Layout>
    );
}

const AdminUserTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        username: "",
        password: "",
        contactNumber: "",
    });

    const users = [
        {
            id: 1,
            name: "Wacky D. Hojilla",
            username: "wackyhojilla",
            password: "wacky12345",
            image: "🧑‍💼",
        },
        {
            id: 2,
            name: "Secretary S. Secretary",
            username: "secretary123",
            password: "secretary123",
            image: "👩‍💼",
        },
    ];

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedImage(null);
        setFormData({
            firstName: "",
            middleName: "",
            lastName: "",
            username: "",
            password: "",
            contactNumber: "",
        });
    };

    const handleAddAdmin = () => {
        // Here you would typically handle the form submission
        console.log("Form data:", formData);
        console.log("Selected image:", selectedImage);
        handleCloseModal();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="">
                {/* Header */}
                <div className="flex justify-end mb-4">
                    <ButtonAdministratorUserSection />
                </div>
                {/* Main Table Container */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    

                    {/* Controls */}
                    <SearchAdministratorUserSection />

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <TableAdministratorUserSection />
                    </div>

                    {/* Footer */}
                    
                </div>
                <div className="mt-4"><PaginationSection/></div>
            </div>
        </div>
    );
};
