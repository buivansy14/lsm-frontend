import { useEffect, useState } from 'react';

import Breadcrumb from '../../Compontents/Common/Breadcrumb';
import axiosInstance from '../../Helpers/axiosinstance';
import HomeLayout from '../../Layouts/HomeLayout';

export default function AdminSettingPage() {
  const [enabled, setEnabled] = useState(false);

  // Lấy danh sách settings
  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await axiosInstance.get('/settings');
        const all = res.data?.data || [];

        const marketplace = all.find((s) => s.key === 'marketplace_enabled');
        if (marketplace) setEnabled(Boolean(marketplace.value));
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    fetchSetting();
  }, []);

  // Toggle marketplace
  const toggleMarketplace = async () => {
    const newVal = !enabled;
    setEnabled(newVal);

    try {
      await axiosInstance.put('/settings/marketplace_enabled', {
        value: newVal,
      });
    } catch (error) {
      console.error('Update failed', error);
      setEnabled(!newVal); // rollback nếu lỗi
    }
  };

  return (
    <HomeLayout>
      <div className="min-h-[90vh] container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Website Settings' }]} />
        <div className="py-6 max-w-lg">
          <h1 className="text-xl text-white font-semibold mb-4">
            Website Settings
          </h1>

          <div className="flex items-center justify-between border border-gray-700 bg-gray-800 text-white p-4 rounded-lg shadow-sm">
            <span>Enable Marketplace menu</span>
            <button
              onClick={toggleMarketplace}
              className={`px-4 py-2 rounded-md font-medium transition ${
                enabled
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
            >
              {enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
