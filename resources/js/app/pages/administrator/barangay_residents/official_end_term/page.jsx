import React, { useState } from 'react';
import Layout from '../../layout';
import { Edit2, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import SearchSection from './sections/search-section';
import TableSection from './sections/table-section';
import PaginationSection from './sections/pagination-section';

const DataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const officials = [
   
    {
      id: 2,
      image: '/api/placeholder/40/40',
      position: 'CHAIRMAN',
      positionColor: 'bg-green-600',
      officialNumber: '040320251137084573',
      name: 'Wacky D. Hojilla',
      pwd: 'NO',
      singleParent: 'NO',
      voters: 'YES',
      status: 'NOT ACTIVE'
    },
    
  ];

  const filteredOfficials = officials.filter(official =>
    official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    official.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Header */}
     <SearchSection/>

      {/* Table */}
     <TableSection/>
      {/* Pagination */}
      <PaginationSection/>
    </div>
  );
};

export default function Page() {
  return (
    <Layout>
      <DataTable />
    </Layout>
  );
}
