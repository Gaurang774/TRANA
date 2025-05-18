
import React from 'react';
import Layout from '@/components/Layout';

const RoutePlanning = () => {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Route Planning</h1>
          <p className="text-gray-500">Plan optimal emergency routes</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Route Planning Tools</h2>
        <p className="text-gray-600">
          This page will contain route planning tools for emergency vehicles.
        </p>
      </div>
    </Layout>
  );
};

export default RoutePlanning;
