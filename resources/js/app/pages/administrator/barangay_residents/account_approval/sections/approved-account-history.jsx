import React, { useEffect, useState } from 'react';
import { 
  get_approved_accounts_service, 
  revert_to_pending_service, 
  cancel_account_service 
} from '@/app/services/registration-service';
import Swal from 'sweetalert2';
import { RotateCcw, Ban, Eye, CheckCircle } from 'lucide-react';
import moment from 'moment';

export default function ApprovedAccountHistory() {
  const [approvedAccounts, setApprovedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchApprovedAccounts();
  }, [currentPage]);

  const fetchApprovedAccounts = async () => {
    try {
      setLoading(true);
      const response = await get_approved_accounts_service();
      setApprovedAccounts(response.data.data);
      setPagination(response.data);
    } catch (error) {
      console.error('Error fetching approved accounts:', error);
      Swal.fire('Error!', 'Failed to fetch approved accounts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRevertToPending = async (id, name) => {
    const result = await Swal.fire({
      title: 'Revert to Pending?',
      text: `Are you sure you want to revert ${name}'s account back to pending status?`,
      icon: 'warning',
      input: 'textarea',
      inputLabel: 'Reason for reverting (optional)',
      inputPlaceholder: 'Enter reason for reverting this account...',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, revert it!',
      inputValidator: (value) => {
        // Optional validation - you can make this required if needed
        return null;
      }
    });

    if (result.isConfirmed) {
      try {
        await revert_to_pending_service(id, result.value || 'Reverted for review');
        await Swal.fire('Reverted!', 'Account has been moved back to pending.', 'success');
        fetchApprovedAccounts();
      } catch (error) {
        Swal.fire('Error!', 'Failed to revert account.', 'error');
      }
    }
  };

  const handleCancelAccount = async (id, name) => {
    const result = await Swal.fire({
      title: 'Cancel Account?',
      text: `Are you sure you want to cancel ${name}'s account? This action marks the account as cancelled.`,
      icon: 'error',
      input: 'textarea',
      inputLabel: 'Reason for cancellation (optional)',
      inputPlaceholder: 'Enter reason for cancelling this account...',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel it!',
      inputValidator: (value) => {
        return null;
      }
    });

    if (result.isConfirmed) {
      try {
        await cancel_account_service(id, result.value || 'Account cancelled by administrator');
        await Swal.fire('Cancelled!', 'Account has been cancelled.', 'success');
        fetchApprovedAccounts();
      } catch (error) {
        Swal.fire('Error!', 'Failed to cancel account.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-gray-800">Approved Account History</h1>
        <p className="text-gray-600">Manage approved resident accounts - revert or cancel if needed</p>
      </div>

      {approvedAccounts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No approved accounts yet</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                      Approved Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                      Approved By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvedAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-600 font-semibold">
                                {account.first_name?.[0]}{account.last_name?.[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {account.first_name} {account.middle_name} {account.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{account.username}
                            </div>
                          </div>
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
                          {account.approval_date 
                            ? moment(account.approval_date).format('MMM DD, YYYY h:mm A') 
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {account.approver 
                            ? `${account.approver.first_name} ${account.approver.last_name}`
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRevertToPending(account.id, `${account.first_name} ${account.last_name}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-all duration-200"
                            title="Revert to Pending"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span className="text-xs font-medium">Revert</span>
                          </button>
                          <button
                            onClick={() => handleCancelAccount(account.id, `${account.first_name} ${account.last_name}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200"
                            title="Cancel Account"
                          >
                            <Ban className="w-4 h-4" />
                            <span className="text-xs font-medium">Cancel</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{pagination.from}</span> to{' '}
                <span className="font-medium">{pagination.to}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </div>
              <div className="flex gap-2">
                {pagination.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (link.url) {
                        const page = new URL(link.url).searchParams.get('page');
                        setCurrentPage(parseInt(page));
                      }
                    }}
                    disabled={!link.url}
                    className={`px-3 py-1 rounded ${
                      link.active
                        ? 'bg-green-600 text-white'
                        : link.url
                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
