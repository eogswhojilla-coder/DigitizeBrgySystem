import React, { useState, useEffect } from 'react';
import { Edit2, X, Search, RotateCcw, FileText, Download } from 'lucide-react';
import Layout from '../../layout';
import Button from '@/app/_components/button';
import SearchTableArcSection from './sections/search-table-arc-section';
import ActionButtonArcSection from './sections/action-button-arc-section';
import TableArcSection from './sections/table-arc-section';
import Pagination from '@/app/_components/pagination';
import PaginationSection from './sections/pagination-section';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ResidentList = () => {
  const [filters, setFilters] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    voters: '',
    age: '',
    status: '',
    pwd: '',
    singleParent: '',
    senior: '',
    residentNumber: ''
  });
  
  const [archivedResidents, setArchivedResidents] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [archiveReasonFilter, setArchiveReasonFilter] = useState('');

  const fetchArchivedResidents = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        per_page: archivedResidents.per_page,
      });

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      if (archiveReasonFilter) {
        params.append('archive_reason', archiveReasonFilter);
      }

      const response = await axios.get(`/api/archived_residents?${params.toString()}`);
      setArchivedResidents(response.data);
    } catch (error) {
      console.error('Error fetching archived residents:', error);
      toast.error('Failed to load archived residents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedResidents();
  }, [searchQuery, archiveReasonFilter]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    fetchArchivedResidents(1);
  };

  const handleReset = () => {
    setFilters({
      firstName: '',
      middleName: '',
      lastName: '',
      voters: '',
      age: '',
      status: '',
      pwd: '',
      singleParent: '',
      senior: '',
      residentNumber: ''
    });
    setSearchQuery('');
    setArchiveReasonFilter('');
  };

  const handlePageChange = (page) => {
    fetchArchivedResidents(page);
  };

  const handleRestore = async (archivedId) => {
    try {
      const response = await axios.post(`/api/archived_residents/${archivedId}/restore`);
      if (response.data.success) {
        toast.success('Resident restored successfully');
        fetchArchivedResidents(archivedResidents.current_page);
      }
    } catch (error) {
      console.error('Error restoring resident:', error);
      toast.error('Failed to restore resident');
    }
  };

  const handleGeneratePDF = async (type) => {
    try {
      const params = new URLSearchParams();

      if (type === 'filtered' && !archiveReasonFilter) {
        Swal.fire({
          icon: 'warning',
          title: 'Select a Reason',
          text: 'Please select an archive reason filter to generate a filtered report.',
        });
        return;
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      if (type === 'filtered' && archiveReasonFilter) {
        params.append('archive_reason', archiveReasonFilter);
      }

      const url = `/api/archived_residents/generate-pdf?${params.toString()}`;
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `archived-residents-${type}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Archived Residents</h2>
            <p className="text-sm text-gray-600">
              Total Archived: {archivedResidents.total || 0}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleGeneratePDF('general')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              title="Generate General Report"
            >
              <FileText className="w-4 h-4" />
              General Report PDF
            </button>
            <button
              onClick={() => handleGeneratePDF('filtered')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
              title="Generate Report by Selected Reason"
            >
              <Download className="w-4 h-4" />
              Filtered Report PDF
            </button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or resident number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={archiveReasonFilter}
            onChange={(e) => setArchiveReasonFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Reasons</option>
            <option value="moved_out">Moved Out</option>
            <option value="passed_away">Passed Away</option>
            <option value="duplicate_entry">Duplicate Entry</option>
            <option value="lost_jurisdiction">Lost Jurisdiction</option>
            <option value="inactive_years">Inactive Years</option>
          </select>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
        {/* Table Header */}
        <div className="bg-blue-700 text-white min-w-[800px]">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium">
            <div className="col-span-1">IMAGE</div>
            <div className="col-span-2">RESIDENT NUMBER</div>
            <div className="col-span-2">NAME</div>
            <div className="col-span-2">ARCHIVE REASON</div>
            <div className="col-span-2">ARCHIVE DATE</div>
            <div className="col-span-1">WAS OFFICIAL</div>
            <div className="col-span-2">ACTION</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading...
            </div>
          ) : archivedResidents.data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No archived residents found
            </div>
          ) : (
            archivedResidents.data.map((resident, index) => (
              <div
                key={resident.id}
                className={`grid grid-cols-12 gap-4 px-4 py-3 items-center ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50 transition-colors`}
              >
                <TableArcSection 
                  resident={resident} 
                  onRestore={handleRestore}
                />
              </div>
            ))
          )}
        </div>
        </div>
      </div>
      
      <div className="mt-4">
        <PaginationSection 
          currentPage={archivedResidents.current_page}
          lastPage={archivedResidents.last_page}
          total={archivedResidents.total}
          perPage={archivedResidents.per_page}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Layout>
      <ResidentList />
    </Layout>
  );
}
