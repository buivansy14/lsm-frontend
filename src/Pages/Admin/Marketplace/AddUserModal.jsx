'use client';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import FormSelect from '../../../Compontents/Form/FormSelect';
import axiosInstance from '../../../Helpers/axiosinstance';

export default function AddUserModal({ isOpen, onClose, marketplaceId }) {
  const [purchasedUsers, setPurchasedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const methods = useForm({
    defaultValues: {
      name: '',
    },
    mode: 'onTouched',
  });

  const handleFormSubmit = async (data) => {
    console.log({ data });
    try {
      await axiosInstance.post('/order/create-order-marketplace', {
        userId: data.userId,
        marketplaceId,
      });
      toast.success('Thêm order thành công!');
      onClose();
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      throw error;
    }
  };

  const getUsersByMarketplace = async (marketplaceId) => {
    try {
      const res = await axiosInstance.get(
        `/marketplace/${marketplaceId}/users`,
        'GET'
      );
      return res.data.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (open && marketplaceId) {
      getUsersByMarketplace(marketplaceId).then((res) => {
        setPurchasedUsers(res.purchasedUsers || []);
        setAvailableUsers(res.availableUsers || []);
      });
    }
  }, [open, marketplaceId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[800px]">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Thêm người dùng</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div className="mb-4">
            <p className="font-medium mb-2">Người dùng đã mua:</p>
            <div className="flex flex-wrap gap-2">
              {purchasedUsers.length > 0 ? (
                purchasedUsers.map((user) => (
                  <span
                    key={user._id}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                  >
                    {user.email}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  Chưa có người dùng nào mua.
                </p>
              )}
            </div>
          </div>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <FormSelect
                name="userId"
                label="Người dùng"
                options={availableUsers?.map((user) => ({
                  label: user.email,
                  value: user._id,
                }))}
                placeholder="Chọn người dùng"
                required
              />
              <div className="flex justify-end border-t px-4 py-3 space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
