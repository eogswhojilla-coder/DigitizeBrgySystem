import React, { useState, useEffect } from 'react';
import Layout from '../../layout';
import Button from '@/app/_components/button';
import Input from '@/app/_components/input';
import { Plus, User, Home, MapPin, Hash, Users } from 'lucide-react';
import CreateFamSection from './sections/create-fam-section';
// import FamHoldSection from './sections/fam-hold-section';
// import HeadFamSection from './sections/head-fam-section';
// import AddressSection from './sections/address-section';
// import OwnershipSection from './sections/ownership-section';
import moment from 'moment';


function CreateNewFamilyForm() {
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
          <Plus className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Family</h1>
          <p className="text-gray-600 text-sm">Add a new family/household record</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Family Number Section */}
        <CreateFamSection />
      </div>
    </div>
  );
}
export default function Page() {
  return (
    <Layout>
      <CreateNewFamilyForm />
    </Layout>
  );
}
