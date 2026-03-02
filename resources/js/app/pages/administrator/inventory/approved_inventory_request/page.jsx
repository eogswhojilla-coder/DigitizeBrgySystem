import React from 'react';
import Layout from '../../layout';
import InventoryTabsSection from './sections/inventory-tabs-section';

export default function Page() {
  return (
    <Layout>
      <BorrowRequestsManager />
    </Layout>
  );
}

const BorrowRequestsManager = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Borrow Requests
        </h1>
        <p className="text-gray-600">
          View and manage resident borrow requests for inventory items
        </p>
      </div>

      <InventoryTabsSection />
    </div>
  );
};

