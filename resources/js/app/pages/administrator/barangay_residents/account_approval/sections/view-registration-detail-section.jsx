import React, { useState, useEffect } from 'react';
import Modal from "@/app/_components/modal";
import { get_resident_details_service, approve_account_service, reject_account_service, set_temporary_resident_service } from '@/app/services/registration-service';
import Swal from 'sweetalert2';
import { Check, X, Clock, User, MapPin, Calendar, Phone, Mail, Home } from 'lucide-react';

export default function ViewRegistrationDetailSection({ isOpen, onClose, userId, onSuccess }) {
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchResidentDetails();
    }
  }, [isOpen, userId]);

  const fetchResidentDetails = async () => {
    setLoading(true);
    try {
      const response = await get_resident_details_service(userId);
      setResident(response.data.data);
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch resident details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    const result = await Swal.fire({
      title: 'Approve Account?',
      text: 'Are you sure you want to approve this account?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, approve it!'
    });

    if (result.isConfirmed) {
      setProcessing(true);
      try {
        await approve_account_service(userId, adminRemarks);
        await Swal.fire('Approved!', 'Account has been approved successfully.', 'success');
        onSuccess();
        onClose();
      } catch (error) {
        Swal.fire('Error!', 'Failed to approve account.', 'error');
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleReject = async () => {
    const result = await Swal.fire({
      title: 'Reject Account?',
      html: 'Are you sure you want to reject this account?<br><small class="text-red-600">Please provide a reason in the remarks field.</small>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, reject it!'
    });

    if (result.isConfirmed) {
      if (!adminRemarks.trim()) {
        Swal.fire('Remarks Required', 'Please provide a reason for rejection.', 'warning');
        return;
      }

      setProcessing(true);
      try {
        await reject_account_service(userId, adminRemarks);
        await Swal.fire('Rejected!', 'Account has been rejected.', 'success');
        onSuccess();
        onClose();
      } catch (error) {
        Swal.fire('Error!', 'Failed to reject account.', 'error');
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleSetTemporary = async () => {
    const result = await Swal.fire({
      title: 'Set as Temporary Resident?',
      text: 'This will approve the account and mark the resident as temporary.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, set as temporary!'
    });

    if (result.isConfirmed) {
      setProcessing(true);
      try {
        await set_temporary_resident_service(userId, adminRemarks || 'Set as temporary resident');
        await Swal.fire('Success!', 'Account approved as temporary resident.', 'success');
        onSuccess();
        onClose();
      } catch (error) {
        Swal.fire('Error!', 'Failed to set temporary resident.', 'error');
      } finally {
        setProcessing(false);
      }
    }
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Loading..." width="max-w-4xl">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Modal>
    );
  }

  if (!resident) return null;

  const residentData = resident.resident || {};
  
  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return 'N/A';
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resident Registration Details" width="max-w-5xl">
      <div className="max-h-[75vh] overflow-y-auto">
        {/* Profile Photo */}
        {residentData.profileImage && (
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={residentData.profileImage.startsWith('data:') ? residentData.profileImage : `/images/residents/${residentData.profileImage}`}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                Pending
              </div>
            </div>
          </div>
        )}

        {/* Personal Information */}
        <div className="mb-6">
          <div className="flex items-center mb-3 pb-2 border-b-2 border-blue-500">
            <User className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <InfoField label="Full Name" value={`${residentData.firstName || ''} ${residentData.middleName || ''} ${residentData.lastName || ''} ${residentData.suffix || ''}`.trim()} />
            <InfoField label="Date of Birth" value={formatDate(residentData.dateOfBirth)} />
            <InfoField label="Age" value={calculateAge(residentData.dateOfBirth)} />
            <InfoField label="Gender" value={residentData.gender || 'N/A'} />
            <InfoField label="Civil Status" value={residentData.civilStatus || 'N/A'} />
            <InfoField label="Religion" value={residentData.religion || 'N/A'} />
            <InfoField label="Nationality" value={residentData.nationality || 'N/A'} />
            <InfoField label="Place of Birth" value={residentData.placeOfBirth || 'N/A'} />
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <div className="flex items-center mb-3 pb-2 border-b-2 border-green-500">
            <Phone className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-800">Contact Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <InfoField label="Mobile Number" value={residentData.contactNumber || 'N/A'} icon={<Phone className="w-4 h-4" />} />
            <InfoField label="Email Address" value={residentData.emailAddress || 'N/A'} icon={<Mail className="w-4 h-4" />} />
          </div>
        </div>

        {/* Address Information */}
        <div className="mb-6">
          <div className="flex items-center mb-3 pb-2 border-b-2 border-purple-500">
            <MapPin className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-800">Address Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <InfoField label="House Number" value={residentData.houseNumber || 'N/A'} />
            <InfoField label="Street" value={residentData.street || 'N/A'} />
            <InfoField label="Zone" value={residentData.zone || 'N/A'} />
            <InfoField label="Barangay" value={residentData.barangay || 'N/A'} />
            <InfoField label="Municipality" value={residentData.municipality || 'N/A'} />
            <InfoField label="Province" value={residentData.province || 'N/A'} />
            <InfoField label="ZIP Code" value={residentData.zip || 'N/A'} />
          </div>
          <div className="mt-3 bg-blue-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Complete Address:</p>
            <p className="text-sm text-gray-900 mt-1">{residentData.address || 'N/A'}</p>
          </div>
        </div>

        {/* Residency Information */}
        <div className="mb-6">
          <div className="flex items-center mb-3 pb-2 border-b-2 border-orange-500">
            <Home className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-800">Residency Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <InfoField label="Residency Status" value={residentData.residencyStatus || 'N/A'} />
            {residentData.residencyStatusOther && (
              <InfoField label="Other Residency Status" value={residentData.residencyStatusOther} />
            )}
            <InfoField label="Date Started Living" value={formatDate(residentData.dateStartedLiving)} icon={<Calendar className="w-4 h-4" />} />
            <InfoField 
              label="Resident Type" 
              value={
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  residentData.residentType === 'official' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {residentData.residentType === 'official' ? '✓ Official Resident' : '⏱ Temporary Resident'}
                </span>
              } 
            />
          </div>
          {residentData.permanentAddress && (
            <div className="mt-3 bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Permanent Address:</p>
              <p className="text-sm text-gray-900 mt-1">{residentData.permanentAddress}</p>
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="mb-6">
          <div className="flex items-center mb-3 pb-2 border-b-2 border-indigo-500">
            <Clock className="w-5 h-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-800">Account Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <InfoField label="Username" value={resident.username || 'N/A'} />
            <InfoField label="Registration Date" value={formatDate(resident.created_at)} />
            <InfoField label="Status" value={
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                {resident.status}
              </span>
            } />
          </div>
        </div>

        {/* Admin Remarks */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Remarks <span className="text-gray-400">(Optional for approval, Required for rejection)</span>
          </label>
          <textarea
            value={adminRemarks}
            onChange={(e) => setAdminRemarks(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter your remarks here..."
            disabled={processing}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 border-t pt-6">
          <button
            onClick={handleApprove}
            disabled={processing}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors shadow-md"
          >
            <Check className="w-5 h-5" />
            {processing ? 'Processing...' : 'Approve Account'}
          </button>
          
          <button
            onClick={handleSetTemporary}
            disabled={processing}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors shadow-md"
          >
            <Clock className="w-5 h-5" />
            {processing ? 'Processing...' : 'Set as Temporary'}
          </button>
          
          <button
            onClick={handleReject}
            disabled={processing}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors shadow-md"
          >
            <X className="w-5 h-5" />
            {processing ? 'Processing...' : 'Reject Account'}
          </button>
          
          <button
            onClick={onClose}
            disabled={processing}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors shadow-md ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Helper component for displaying information fields
function InfoField({ label, value, icon }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-400">{icon}</span>}
        <p className="text-sm text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  );
}

