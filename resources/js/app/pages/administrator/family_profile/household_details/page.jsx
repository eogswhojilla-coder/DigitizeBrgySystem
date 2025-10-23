import { useState } from "react";
import { Home, DollarSign, Hash, Users, Zap, Droplets, Wifi, Trash, FileText, Building } from "lucide-react";
import Layout from "../../layout";
import AddHouseholdDetailSection from "./sections/add-household-detail-section";


function HouseholdDetailsForm() {
  return (
    <div className="max-w-9xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full">
          <Home className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Household Details</h1>
          <p className="text-gray-600 text-sm">Complete household information and living conditions</p>
        </div>
      </div>

      {/* Family House Hold */}
      <AddHouseholdDetailSection />
    </div>
  );
}
export default function Page() {
  return (
    <Layout>
      <HouseholdDetailsForm />
    </Layout>
  );
}