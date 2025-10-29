import React, { useEffect } from 'react';
import Layout from '../../layout';
import InventoryTabsSection from './sections/inventory-tabs-section';
import { get_inventories_thunk } from "@/app/redux/inventories-thunk";
import store from "@/app/store/store";

export default function Page() {
  useEffect(() => {
    // Fetch inventories when page loads
    store.dispatch(get_inventories_thunk());
  }, []);

  return (
    <Layout>
      <InventoryTabsSection />
    </Layout>
  );
}

