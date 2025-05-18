
import React from 'react';
import Layout from '@/components/Layout';

const Reports = () => {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-gray-500">View and generate emergency reports</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Report Dashboard</h2>
        <p className="text-gray-600">
          This page will display reports and analytics for the emergency healthcare system.
        </p>
      </div>
    </Layout>
  );
};

export default Reports;
