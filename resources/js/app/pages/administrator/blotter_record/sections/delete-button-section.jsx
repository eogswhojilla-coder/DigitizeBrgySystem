import Button from '@/app/_components/button'
import React, { useState } from 'react'
import { Plus, Trash2, Edit, X, User, Users, MapPin, Calendar, FileText, AlertCircle, MessageSquare } from 'lucide-react';
export default function DeleteButtonSection() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const records = [
    {
      id: 1,
      blotterNumber: '2066133803768924',
      status: 'NEW',
      remarks: 'OPEN',
      incident: 'qewr',
      location: 'San Carlos',
      dateIncident: '04/25/2025 - 05:43 PM',
      dateReported: '04/25/2025 - 05:43 PM'
    },
    {
      id: 2,
      blotterNumber: '4108081920533098',
      status: 'NEW',
      remarks: 'OPEN',
      incident: 'Sdaasd',
      location: 'Sad',
      dateIncident: '04/11/2025 - 04:09 PM',
      dateReported: '04/25/2025 - 07:10 AM'
    }
  ];
    const filteredRecords = records.filter(record =>
        Object.values(record).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
   
    
    return (
        <div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        Showing 1 to {filteredRecords.length} of {records.length} entries
                    </span>
                    <Button
                        className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={selectedItems.length === 0}
                    >
                        <Trash2 size={16} />
                        <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs min-w-[20px]">
                            {selectedItems.length}
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
