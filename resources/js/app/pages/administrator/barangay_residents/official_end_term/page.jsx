import React, { useState } from 'react';
import Layout from '../../layout';
import { router } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import SearchSection from './sections/search-section';
import TableSection from './sections/table-section';
import PaginationSection from './sections/pagination-section';
import ViewDetailSection from './sections/view-detail-section';

export default function Page({ officials, filters }) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [positionFilter, setPositionFilter] = useState(filters?.position || 'ALL POSITION');
  const [rowsPerPage, setRowsPerPage] = useState(filters?.per_page || 10);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState(null);

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    performSearch(value, positionFilter, rowsPerPage);
  };

  // Handle position filter
  const handlePositionFilter = (value) => {
    setPositionFilter(value);
    performSearch(searchTerm, value, rowsPerPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    performSearch(searchTerm, positionFilter, value);
  };

  // Perform search with all filters
  const performSearch = (search, position, perPage) => {
    router.get(
      route('official_end_term.index'),
      {
        search: search || undefined,
        position: position !== 'ALL POSITION' ? position : undefined,
        per_page: perPage,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  // Handle view details
  const handleViewDetails = (official) => {
    setSelectedOfficial(official);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = (value) => {
    setIsViewModalOpen(value);
    if (!value) {
      setSelectedOfficial(null);
    }
  };

  // Handle PDF generation
  const handleGeneratePDF = () => {
    try {
      const params = new URLSearchParams();

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (positionFilter && positionFilter !== 'ALL POSITION') {
        params.append('position', positionFilter);
      }

      const url = `/api/official_end_term/generate-pdf?${params.toString()}`;
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `official-end-term-${new Date().toISOString().split('T')[0]}.pdf`;
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
    <Layout>
      <div className="bg-white min-h-screen p-6">
        <SearchSection 
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          totalCount={officials?.total || 0}
          onGeneratePDF={handleGeneratePDF}
        />

        <TableSection 
          officials={officials?.data || []}
          positionFilter={positionFilter}
          onPositionFilterChange={handlePositionFilter}
          onViewDetails={handleViewDetails}
        />

        <PaginationSection 
          pagination={officials}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <ViewDetailSection 
          isOpen={isViewModalOpen}
          onClose={handleCloseModal}
          official={selectedOfficial}
        />
      </div>
    </Layout>
  );
}


