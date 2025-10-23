import { useState } from "react";
import { Plus, Users, Search, Trash2, UserPlus, Hash, Heart, Briefcase } from "lucide-react";
import Layout from "../../layout"; // Make sure this path is correct
// import FamilySelectionSection from "./sections/family-selection-section";
// import FamilyMemberSection from "./sections/add-family-member-section";
// import SaveButtonSection from "./sections/save-button-section";
// import Button from "@/app/_components/button";
// import Input from "@/app/_components/input";
import AddFamilyMemberSection from "./sections/add-family-member-section";

// Custom Button Component

function AddFamilyMembersForm() {
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
          <UserPlus className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Family Members</h1>
          <p className="text-gray-600 text-sm">Add members to existing families</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Family Selection */}
        <AddFamilyMemberSection/>
      </div>
    </div>
  );
}
export default function FamilyMembersPage() {
  return (
    <Layout>
      <AddFamilyMembersForm />
    </Layout>
  );
}