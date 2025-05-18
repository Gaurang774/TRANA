
import React from 'react';
import Layout from '@/components/Layout';

const Settings = () => {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">Configure your preferences</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">System Settings</h2>
        <p className="text-gray-600">
          This page will contain system configuration options.
        </p>
      </div>
    </Layout>
  );
};

export default Settings;
