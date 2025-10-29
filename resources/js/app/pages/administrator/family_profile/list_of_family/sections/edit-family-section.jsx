import React from "react";
import { X, Save } from "lucide-react";

export default function EditFamilySection({ family, isOpen, onClose }) {
  if (!isOpen || !family) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Edit Family</h2>
              <p className="text-blue-100 mt-1">Family #{family.familyNumber}</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:text-blue-200 bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Save size={32} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Edit Functionality Coming Soon
            </h3>
            <p className="text-gray-600">
              This feature will allow you to edit family information, members, and household details.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-b-xl border-t border-blue-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}