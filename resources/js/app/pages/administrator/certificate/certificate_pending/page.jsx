import React from 'react';
import Layout from '../../layout';
import TableSection from './sections/table-section';

export default function Page() {
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Certificate Requests</h1>
        <TableSection />
      </div>
    </Layout>
  );
}
