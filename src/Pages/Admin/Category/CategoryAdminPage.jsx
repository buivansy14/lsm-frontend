import { useEffect, useState } from 'react';
import { BsPlus, BsTrash } from 'react-icons/bs';
import { FaEdit } from 'react-icons/fa';

import Breadcrumb from '../../../Compontents/Common/Breadcrumb';
import axiosInstance from '../../../Helpers/axiosinstance';
import HomeLayout from '../../../Layouts/HomeLayout';
import CreateCategoryModal from './CreateCategoryModal';

const CategoryAdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [current, setCurrent] = useState({
    _id: '',
    name: '',
    description: '',
  });

  const [isEdit, setIsEdit] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/categories');
      setCategories(res.data.data || []);
    } catch (error) {
      console.error('Lỗi tải danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (data) => {
    try {
      await axiosInstance.post('/categories', data);
      await fetchCategories();
      setOpenModal(false);
    } catch (error) {
      console.error('Lỗi khi tạo danh mục:', error);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await axiosInstance.put(`/categories/${current._id}`, data);
      await fetchCategories();
      setOpenModal(false);
    } catch (error) {
      console.error('Lỗi khi tạo danh mục:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này không?')) return;
    try {
      await axiosInstance.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
    }
  };

  const handleOpenEdit = (category) => {
    setCurrent(category);
    setIsEdit(true);
    setOpenModal(true);
  };

  return (
    <HomeLayout>
      <div className="min-h-[90vh] container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Quản lý Marketplace' }]} />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-white">
            Quản lý danh mục
          </h1>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            <BsPlus size={18} className="mr-2" /> Tạo danh mục
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-900 font-semibold">
              <tr>
                <th className="py-3 px-4 text-left">Tên</th>
                <th className="py-3 px-4 text-left">Mô tả</th>
                <th className="px-6 py-3 text-right text-sm">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat._id}>
                    <td className="px-6 py-4 text-gray-800">{cat.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {cat.description || '—'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                        title="Chỉnh sửa"
                        onClick={() => handleOpenEdit(cat)}
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                        title="Xóa"
                      >
                        <BsTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    Không có danh mục nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {openModal && (
          <CreateCategoryModal
            onClose={() => setOpenModal(false)}
            onSubmit={handleCreate}
          />
        )}
        {openModal && isEdit && (
          <CreateCategoryModal
            onClose={() => {
              setOpenModal(false);
              setIsEdit(false);
              setCurrent({ _id: '', name: '', description: '' });
            }}
            onSubmit={handleUpdate}
            current={current}
          />
        )}
      </div>
    </HomeLayout>
  );
};

export default CategoryAdminPage;
