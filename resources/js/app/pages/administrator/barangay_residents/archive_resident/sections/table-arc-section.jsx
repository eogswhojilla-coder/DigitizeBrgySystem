// ./sections/table-arc-section.jsx
import React from 'react';
import { Edit2, X } from 'lucide-react';

export default function TableArcSection({ resident }) {
  return (
    <>
      <div className="col-span-1">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-xs">IMG</span>
        </div>
      </div>
      <div className="col-span-2 text-sm text-gray-700 font-mono">{resident.residentNumber}</div>
      <div className="col-span-2 text-sm font-medium text-gray-900">{resident.name}</div>
      <div className="col-span-1 text-sm text-gray-700">{resident.age || '-'}</div>
      <div className="col-span-1">
        <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
          {resident.pwd}
        </span>
      </div>
      <div className="col-span-1">
        <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
          {resident.singleParent}
        </span>
      </div>
      <div className="col-span-1">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            resident.voters === 'YES'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {resident.voters}
        </span>
      </div>
      <div className="col-span-1">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-700">{resident.status}</span>
        </div>
      </div>
      <div className="col-span-2 flex space-x-2">
        <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors">
          <Edit2 className="w-4 h-4" />
        </button>
        <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}
