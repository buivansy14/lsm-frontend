import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaGlobe } from 'react-icons/fa';

import LoadingOverlay from '../../Compontents/LoadingOverlay';
import axiosInstance from '../../Helpers/axiosinstance';
import HomeLayout from '../../Layouts/HomeLayout';
import { data } from './data';

export default function TranslationManagement() {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState('');
  const [newTranslation, setNewTranslation] = useState({ en: '', vi: '' });
  const [errors, setErrors] = useState({ key: '', en: '', vi: '' });

  const fetchTranslations = async () => {
    try {
      const response = await axiosInstance.get('/translation/get-translations');
      setTranslations(response.data.translations);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu dịch:', error.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  const validateInputs = () => {
    let valid = true;
    let newErrors = { key: '', en: '', vi: '' };

    if (!newKey.trim()) {
      newErrors.key = 'Key không được để trống';
      valid = false;
    }
    if (!newTranslation.en.trim()) {
      newErrors.en = 'Tiếng Anh không được để trống';
      valid = false;
    }
    if (!newTranslation.vi.trim()) {
      newErrors.vi = 'Tiếng Việt không được để trống';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAddTranslation = async () => {
    if (!validateInputs()) return;

    try {
      await axiosInstance.post('/translation/add-translation', {
        key: newKey,
        translations: newTranslation,
      });
      toast.success('Thêm bản dịch thành công!');
      setNewKey('');
      setNewTranslation({ en: '', vi: '' });
      setErrors({ key: '', en: '', vi: '' });
      fetchTranslations();
    } catch (error) {
      toast.error('Thêm bản dịch thất bại. Vui lòng thử lại.');
    }
  };

  const handleImport = async () => {
    try {
      await axiosInstance.post('/translation/import-translations', {
        data: data,
      });
      toast.success('Import bản dịch thành công!');
      fetchTranslations();
    } catch (error) {
      toast.error('Import bản dịch thất bại. Vui lòng thử lại.');
    }
  };

  if (loading) return <LoadingOverlay isLoading={loading} />;

  return (
    <HomeLayout>
      <div className="p-6 w-ful mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          🌍 Quản lý bản dịch
        </h1>

        <div className="flex items-center justify-center mb-4 bg-blue-100 text-blue-800 rounded-lg p-3 shadow-md">
          <FaGlobe className="text-2xl mr-2" />
          <span className="text-lg font-semibold">
            Tổng số bản dịch: {Object.keys(translations).length}
          </span>
        </div>

        <button
          className="bg-yellow-500 p-4 -3 rounded-lg text-white mb-6 hover:bg-yellow-600 transition"
          onClick={handleImport}
        >
          Import Translation
        </button>

        <div className="shadow-lg rounded-xl overflow-hidden border border-gray-200 bg-white">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-800 text-white text-md">
              <tr>
                <th className="px-6 py-3 text-left">Key</th>
                <th className="px-6 py-3 text-left">Tiếng Anh</th>
                <th className="px-6 py-3 text-left">Tiếng Việt</th>
              </tr>
            </thead>
            <tbody>
              {translations.map((item) => (
                <tr key={item.key} className="hover:bg-gray-100 transition">
                  <td className="px-6 py-4 font-medium">{item.key}</td>
                  <td className="px-6 py-4">{item.translations.en}</td>
                  <td className="px-6 py-4">{item.translations.vi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <input
            className="border p-2 rounded"
            placeholder="Key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
          {errors.key && <p className="text-red-500 text-sm">{errors.key}</p>}

          <input
            className="border p-2 rounded"
            placeholder="English"
            value={newTranslation.en}
            onChange={(e) =>
              setNewTranslation({ ...newTranslation, en: e.target.value })
            }
          />
          {errors.en && <p className="text-red-500 text-sm">{errors.en}</p>}

          <input
            className="border p-2 rounded"
            placeholder="Vietnamese"
            value={newTranslation.vi}
            onChange={(e) =>
              setNewTranslation({ ...newTranslation, vi: e.target.value })
            }
          />
          {errors.vi && <p className="text-red-500 text-sm">{errors.vi}</p>}

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleAddTranslation}
          >
            Thêm bản dịch
          </button>
        </div>
      </div>
    </HomeLayout>
  );
}
