import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaLock, FaUnlock, FaUsers } from 'react-icons/fa';

import LoadingOverlay from '../../Compontents/LoadingOverlay';
import axiosInstance from '../../Helpers/axiosinstance';
import HomeLayout from '../../Layouts/HomeLayout';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/user/getAll');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLockUnlock = async (id, locked) => {
    const confirmDelete = window.confirm(
      locked
        ? 'Bạn có chắc muốn mở khóa người dùng này?'
        : 'Bạn có chắc muốn khóa người dùng này?'
    );
    if (confirmDelete) {
      try {
        const res = await axiosInstance.post(`/user/lock-user`, {
          userId: id,
          locked,
        });
        if (res.data) {
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error('Khóa thất bại. Vui lòng thử lại.');
      }
      fetchUsers();
    }
  };

  if (loading) return <LoadingOverlay isLoading={loading} />;

  return (
    <HomeLayout>
      <div className="p-6 w-ful mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          📋 Quản lý người dùng
        </h1>

        <div className="flex items-center justify-center mb-4 bg-blue-100 text-blue-800 rounded-lg p-3 shadow-md">
          <FaUsers className="text-2xl mr-2" />
          <span className="text-lg font-semibold">
            Tổng số người dùng: {users.length}
          </span>
        </div>

        <div className="shadow-lg rounded-xl overflow-hidden border border-gray-200 bg-white">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-800 text-white text-md">
              <tr>
                <th className="px-6 py-3 text-left">Tên</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Vai trò</th>
                <th className="px-6 py-3 text-left">Trạng thái</th>
                <th className="px-6 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-6 py-4 font-medium">{user.fullName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      user.role === 'Admin'
                        ? 'bg-red-100 text-red-600'
                        : user.role === 'Moderator'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        user.locked
                          ? 'bg-red-100 text-red-600' // Locked
                          : 'bg-green-100 text-green-600' // Active
                      }`}
                    >
                      {user.locked ? 'Đã khóa' : 'Hoạt động'}
                    </span>
                  </td>
                  <td className="flex px-6 py-4 text-center space-x-2 justify-center">
                    <button
                      onClick={() => handleLockUnlock(user._id, user.locked)}
                      className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md transition duration-300"
                    >
                      {user.locked ? (
                        <>
                          <FaUnlock className="mr-1" /> Mở khóa
                        </>
                      ) : (
                        <>
                          <FaLock className="mr-1" /> Khóa
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HomeLayout>
  );
}
