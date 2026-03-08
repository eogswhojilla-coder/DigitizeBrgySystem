import React from 'react';
import Layout from '../../layout';
import TableSection from './sections/table-section';

export default function Page() {
  return (
    <Layout>
      <div className="p-3 sm:p-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Certificate Requests</h1>
        <TableSection />
      </div>
    </Layout>
  );
}
