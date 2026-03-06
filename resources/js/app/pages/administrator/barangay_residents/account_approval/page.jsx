import React, { useEffect, useState } from 'react'
import Layout from '../../layout'
import { useDispatch, useSelector } from 'react-redux';
import { get_pending_accounts_thunk } from '@/app/redux/pending-accounts-thunk';
import { approve_account_service, reject_account_service } from '@/app/services/registration-service';
import Swal from 'sweetalert2';
import { Check, X, Eye, Clock, CheckCircle2 } from 'lucide-react';
import ViewRegistrationDetailSection from './sections/view-registration-detail-section';
import ApprovedAccountHistory from './sections/approved-account-history';

export default function Page() {
  const dispatch = useDispatch();
  const { accounts } = useSelector((store) => store.pendingAccounts);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'

  useEffect(() => {
    if (activeTab === 'pending') {
      dispatch(get_pending_accounts_thunk());
    }
  }, [activeTab]);

  const handleViewDetails = (id) => {
    setSelectedUserId(id);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedUserId(null);
  };

  const handleSuccess = () => {
    dispatch(get_pending_accounts_thunk());
  };

  const handleApprove = async (id, name) => {
    const result = await Swal.fire({
      title: 'Approve Account?',
      text: `Are you sure you want to approve ${name}'s account?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    });

    if (result.isConfirmed) {
      try {
        await approve_account_service(id);
        await Swal.fire('Approved!', 'Account has been approved.', 'success');
        dispatch(get_pending_accounts_thunk());
      } catch (error) {
        Swal.fire('Error!', 'Failed to approve account.', 'error');
      }
    }
  };

  const handleReject = async (id, name) => {
    const result = await Swal.fire({
      title: 'Reject Account?',
      text: `Are you sure you want to reject ${name}'s account?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Yes, reject it!'
    });

    if (result.isConfirmed) {
      try {
        await reject_account_service(id);
        await Swal.fire('Rejected!', 'Account has been rejected.', 'success');
        dispatch(get_pending_accounts_thunk());
      } catch (error) {
        Swal.fire('Error!', 'Failed to reject account.', 'error');
      }
    }
  };

  const pendingData = Array.isArray(accounts?.data) ? accounts.data : [];

  return (
    <Layout>
      <div className="bg-white min-h-screen p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Account Approval Management</h1>
          <p className="text-gray-600">Manage resident registration requests and approved accounts</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                ${activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Clock className="w-5 h-5" />
              Pending Accounts
              {accounts?.total > 0 && (
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {accounts.total}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                ${activeTab === 'approved'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <CheckCircle2 className="w-5 h-5" />
              Approved History
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'pending' ? (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Registered Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No pending accounts found
                    </td>
                  </tr>
                ) : (
                  pendingData.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {account.first_name} {account.middle_name} {account.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{account.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{account.contact || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(account.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {account.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(account.id)}
                            className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(account.id, `${account.first_name} ${account.last_name}`)}
                            className="p-2 text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(account.id, `${account.first_name} ${account.last_name}`)}
                            className="p-2 text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination info */}
        {accounts?.total > 0 && (
          <div className="mt-4 text-sm text-gray-700">
            Showing {accounts.from} to {accounts.to} of {accounts.total} entries
          </div>
        )}

        {/* View Details Modal */}
        <ViewRegistrationDetailSection
          isOpen={showDetailModal}
          onClose={handleCloseModal}
          userId={selectedUserId}
          onSuccess={handleSuccess}
        />
          </>
        ) : (
          <ApprovedAccountHistory />
        )}
      </div>
    </Layout>
  )
}
