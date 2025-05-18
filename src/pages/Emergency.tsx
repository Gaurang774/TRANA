
import React from 'react';
import Layout from '@/components/Layout';

const Emergency = () => {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Emergency Management</h1>
          <p className="text-gray-500">Handle critical situations efficiently</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Emergency Response</h2>
        <p className="text-gray-600">
          This page will contain emergency management tools and features.
        </p>
      </div>
    </Layout>
  );
};

export default Emergency;
