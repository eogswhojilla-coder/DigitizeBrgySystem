import React, { useState } from 'react';
import Layout from '../../layout';
import Input from '@/app/_components/input';
import Select from '@/app/_components/select';
import TabsSection from './sections/tabs-section';

function ProfileForm() {
  const [formData, setFormData] = useState({
    // Basic Info
    position: '',
    startDate: '',
    endDate: '',
    voters: '',
    dateOfBirth: '',
    placeOfBirth: '',
    pwd: '',
    singleParent: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    gender: 'Male',
    civilStatus: 'Single',
    religion: '',
    nationality: '',
    // Other Info (Address)
    municipality: '',
    zip: '',
    barangay: '',
    houseNumber: '',
    street: '',
    address: '',
    contactNumber: '',
    emailAddress: '',
    // Guardian
    fatherName: '',
    motherName: '',
    guardianName: '',
    guardianContact: '',
    // Account
    username: '',
    password: '',
    confirmPassword: ''
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };




  return (
  <>
  </>
  );
}

export default function Page() {
  return (
    <Layout>
      <TabsSection />
    </Layout>
  );
}