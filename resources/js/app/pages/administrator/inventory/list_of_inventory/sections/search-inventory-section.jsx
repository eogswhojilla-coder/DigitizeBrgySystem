import React, { useState } from 'react'
import { Plus, Edit, Trash2, Package, Search, Filter } from 'lucide-react';
export default function SearchInventorySection() {
  
      const [showForm, setShowForm] = useState(false);
      const [editingItem, setEditingItem] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');
      const [statusFilter, setStatusFilter] = useState('All');
      const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: '',
        condition: 'New',
        location: '',
        status: 'Active'
      });
    
      const statuses = ['Active', 'Damaged', 'Retired'];
      const statusOptions = ['All', ...statuses];
    
 
    
  return (
    <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        
                    />
        
        
                  </div>
        
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
    </div>
  )
}

