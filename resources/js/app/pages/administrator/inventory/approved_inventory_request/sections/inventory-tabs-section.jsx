import { Eye, Filter } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import store from '@/app/store/store';
import { get_borrow_requests_thunk } from '@/app/redux/borrow-requests-thunk';
import InventoryTableSection from './inventory-table-section';

export default function InventoryTabsSection() {
  const [selectedFilter, setSelectedFilter] = useState('Pending');
  const { borrowRequests, loading } = useSelector((state) => state.borrowRequests);

  useEffect(() => {
    // Fetch all borrow requests on component mount
    store.dispatch(get_borrow_requests_thunk());
  }, []);

  const requests = borrowRequests || [];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">Loading requests...</div>
        </div>
      ) : (
        <div className="mb-6 w-full flex flex-col gap-5">
          <div className="flex flex-wrap gap-2 w-full ">
            {['Pending', 'Approved', 'Declined', 'Returned'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedFilter(status)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${selectedFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
              >
                <Filter size={16} />
                {status}
                <span className="bg-opacity-20 bg-white px-2 py-1 rounded-full text-xs">
                  {requests.filter(r => r.status === status).length}
                </span>
              </button>
            ))}
          </div>
          <InventoryTableSection
            tab={selectedFilter}
            requests={requests}
          />
        </div>
      )}
    </>
  )
}
