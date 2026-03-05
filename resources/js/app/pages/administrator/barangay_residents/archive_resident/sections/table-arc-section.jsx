// ./sections/table-arc-section.jsx
import React from 'react';
import { RotateCcw, Trash2, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

export default function TableArcSection({ resident, onRestore }) {
  const handleRestore = async () => {
    const result = await Swal.fire({
      title: 'Restore Resident?',
      html: `
        <p>Are you sure you want to restore this resident?</p>
        <p class="font-semibold mt-2">${resident.name}</p>
        <p class="text-sm text-gray-600 mt-1">This will move them back to the active residents list.</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, restore',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      onRestore(resident.id);
    }
  };

  const getReasonBadgeColor = (reason) => {
    const colors = {
      'moved_out': 'bg-blue-100 text-blue-800',
      'passed_away': 'bg-gray-100 text-gray-800',
      'duplicate_entry': 'bg-yellow-100 text-yellow-800',
      'lost_jurisdiction': 'bg-orange-100 text-orange-800',
      'inactive_years': 'bg-purple-100 text-purple-800',
    };
    return colors[reason] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <div className="col-span-1">
        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
          {resident.image ? (
            <img
              src={resident.image}
              alt={resident.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-600 text-xs font-semibold">
              {resident.name?.split(' ')[0]?.charAt(0)}
              {resident.name?.split(' ')[1]?.charAt(0)}
            </span>
          )}
        </div>
      </div>
      <div className="col-span-2 text-sm text-gray-700 font-mono">
        {resident.residentNumber || 'N/A'}
      </div>
      <div className="col-span-2 text-sm font-medium text-gray-900">
        {resident.name}
        {resident.wasOfficial && (
          <span className="ml-2 text-xs text-blue-600 font-semibold">
            (Former {resident.positionHeld})
          </span>
        )}
      </div>
      <div className="col-span-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getReasonBadgeColor(resident.archiveReason)}`}>
          {resident.archiveReasonLabel}
        </span>
      </div>
      <div className="col-span-2 text-sm text-gray-700">
        {resident.archiveDate}
      </div>
      <div className="col-span-1">
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          resident.wasOfficial 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {resident.wasOfficial ? 'YES' : 'NO'}
        </span>
      </div>
      <div className="col-span-2 flex space-x-2">
        <button 
          onClick={handleRestore}
          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
          title="Restore Resident"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}

