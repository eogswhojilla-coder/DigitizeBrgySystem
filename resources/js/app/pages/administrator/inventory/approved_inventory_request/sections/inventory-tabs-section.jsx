import { Eye, Filter } from 'lucide-react';
import React, { useState } from 'react'
import InventoryTableSection from './inventory-table-section';

export default function InventoryTabsSection() {
  const [selectedFilter, setSelectedFilter] = useState('Pending');

  const [requests, setRequests] = useState([
    {
      id: 1,
      residentName: 'John Smith',
      itemName: 'Laptop Dell XPS',
      quantity: 1,
      reason: 'Work presentation preparation',
      dateNeeded: '2024-08-05',
      status: 'Pending',
      requestDate: '2024-08-03',
      availableStock: 3
    },
    {
      id: 2,
      residentName: 'Maria Garcia',
      itemName: 'Projector',
      quantity: 1,
      reason: 'Community meeting',
      dateNeeded: '2024-08-06',
      status: 'Approved',
      requestDate: '2024-08-02',
      availableStock: 2,
      borrowDate: '2024-08-03'
    },
    {
      id: 3,
      residentName: 'David Chen',
      itemName: 'Folding Tables',
      quantity: 3,
      reason: 'Birthday party setup',
      dateNeeded: '2024-08-07',
      status: 'Declined',
      requestDate: '2024-08-01',
      declineReason: 'Insufficient quantity available'
    },
    {
      id: 4,
      residentName: 'Sarah Johnson',
      itemName: 'Sound System',
      quantity: 1,
      reason: 'Wedding ceremony',
      dateNeeded: '2024-08-04',
      status: 'Approved',
      requestDate: '2024-07-30',
      availableStock: 1,
      borrowDate: '2024-08-01'
    }
  ]);

  return (
    <>
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
        />
      </div>

    </>
  )
}
