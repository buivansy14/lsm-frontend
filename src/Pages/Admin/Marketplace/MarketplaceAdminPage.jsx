import moment from 'moment';
import { useEffect, useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import { FaEdit, FaUserPlus } from 'react-icons/fa';

import Breadcrumb from '../../../Compontents/Common/Breadcrumb';
import axiosInstance from '../../../Helpers/axiosinstance';
import { getImageUrl } from '../../../Helpers/imageHelper';
import HomeLayout from '../../../Layouts/HomeLayout';
import AddUserModal from './AddUserModal';
import CreateMarketplaceModal from './CreateMarketplaceModal';

const MarketplaceAdminPage = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [openAddUser, setOpenAddModal] = useState(false);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/marketplace');
      setTools(res.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleCreated = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (key === 'image') {
          if (value instanceof File) {
            formData.append('image', value);
          } else if (typeof value === 'string') {
            formData.append('image', value);
          }
          return;
        }

        if (key === 'images') {
          if (Array.isArray(value)) {
            value.forEach((file) => {
              if (file instanceof File) {
                formData.append('images', file);
              } else if (typeof file === 'string') {
                formData.append('images', file);
              }
            });
          }
          return;
        }

        if (key === 'tags') {
          formData.append(
            'tags',
            Array.isArray(value) ? value.join(',') : value || '',
          );
          return;
        }

        formData.append(key, value);
      });

      await axiosInstance.post('/marketplace', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      console.error('Lỗi khi tạo tool:', error);
    } finally {
      fetchTools();
      setOpenModal(false);
    }
  };
  const handleUpdate = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (key === 'image') {
          if (value instanceof File) {
            formData.append('image', value);
          } else if (typeof value === 'string') {
            formData.append('image', value);
          }
          return;
        }

        if (key === 'images') {
          if (Array.isArray(value)) {
            value.forEach((file) => {
              if (file instanceof File) {
                formData.append('images', file);
              } else if (typeof file === 'string') {
                formData.append('images', file);
              }
            });
          }
          return;
        }

        if (key === 'tags') {
          formData.append(
            'tags',
            Array.isArray(value) ? value.join(',') : value || '',
          );
          return;
        }

        formData.append(key, value);
      });

      await axiosInstance.put(`/marketplace/${currentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      console.error('Lỗi khi update tool:', error);
    } finally {
      fetchTools();
      setOpenModal(false);
      setIsEdit(false);
      setCurrentId('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tool này không?')) return;
    try {
      await axiosInstance.delete(`/marketplace/${id}`);
      fetchTools();
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
    }
  };

  const handleOpenEdit = (tool) => {
    setCurrentId(tool?._id);
    setIsEdit(true);
    setOpenModal(true);
  };

  const handleAddUser = (tool) => {
    setOpenAddModal(true);
    setCurrentId(tool?._id);
  };

  return (
    <HomeLayout>
      <div className="min-h-[90vh] container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Quản lý Marketplace' }]} />
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              Quản lý Marketplace
            </h1>
            <button
              onClick={() => setOpenModal(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
            >
              + Tạo mới
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-900 font-semibold">
                <tr>
                  <th className="py-3 px-4 text-left">Ảnh</th>
                  <th className="py-3 px-4 text-left">Tên tool</th>
                  <th className="py-3 px-4 text-left">Danh mục</th>
                  <th className="py-3 px-4 text-left">Giá</th>
                  <th className="py-3 px-4 text-left">Lượt tải</th>
                  <th className="py-3 px-4 text-left">Ngày tạo</th>
                  <th className="py-3 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-6 text-center text-gray-500">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : tools.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-6 text-center text-gray-500">
                      Chưa có tool nào.
                    </td>
                  </tr>
                ) : (
                  tools.map((tool) => (
                    <tr key={tool._id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <img
                          src={getImageUrl(tool.image) || '/no-image.png'}
                          alt={tool.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium">{tool.name}</td>
                      <td className="py-3 px-4">
                        {tool.categoryId?.name || '-'}
                      </td>
                      <td className="py-3 px-4 text-yellow-700 font-semibold">
                        {tool.price === 0
                          ? 'Miễn phí'
                          : `${tool.price.toLocaleString()}₫`}
                      </td>
                      <td className="py-3 px-4">{tool.downloads || 0}</td>
                      <td className="py-3 px-4">
                        {moment(tool.createdAt).format('DD/MM/YYYY HH:mm')}
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg text-green-600"
                          title="Thêm người dùng"
                          onClick={() => handleAddUser(tool)}
                        >
                          <FaUserPlus size={18} />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                          title="Chỉnh sửa"
                          onClick={() => handleOpenEdit(tool)}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(tool._id)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                          title="Xóa"
                        >
                          <BsTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Modal */}
        {openModal && (
          <CreateMarketplaceModal
            onClose={() => setOpenModal(false)}
            onSubmit={handleCreated}
            size="lg"
          />
        )}

        {openModal && isEdit && (
          <CreateMarketplaceModal
            onClose={() => {
              setOpenModal(false);
              setIsEdit(false);
              setCurrentId('');
            }}
            onSubmit={handleUpdate}
            currentId={currentId}
            size="lg"
          />
        )}

        {openAddUser && currentId && (
          <AddUserModal
            isOpen={openAddUser}
            marketplaceId={currentId}
            onClose={() => {
              setOpenAddModal(false);
              setCurrentId(null);
            }}
          />
        )}
      </div>
    </HomeLayout>
  );
};

export default MarketplaceAdminPage;
