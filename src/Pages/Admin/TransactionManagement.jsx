import moment from 'moment';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import LoadingOverlay from '../../Compontents/LoadingOverlay';
import axiosInstance from '../../Helpers/axiosinstance';
import HomeLayout from '../../Layouts/HomeLayout';

export default function TransactionManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/order/getAll');
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Lỗi khi lấy dữ liệu giao dịch');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <LoadingOverlay isLoading={loading} />;

  return (
    <HomeLayout>
      <div className="p-6 w-full mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          💳 Quản lý giao dịch
        </h1>

        <div className="shadow-lg rounded-xl overflow-hidden border border-gray-200 bg-white">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-800 text-white text-md">
              <tr>
                <th className="px-6 py-3 text-left">Mã giao dịch</th>
                <th className="px-6 py-3 text-left">Người dùng</th>
                <th className="px-6 py-3 text-left">Số tiền vào</th>
                <th className="px-6 py-3 text-left">Số tiền ra</th>
                <th className="px-6 py-3 text-left">Ngày giao dịch</th>
                <th className="px-6 py-3 text-left">Nội dung</th>
                <th className="px-6 py-3 text-left">Mã tham chiếu</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-6 py-4 font-medium">
                    {order.transaction_id}
                  </td>
                  <td className="px-6 py-4">
                    {order.userId ? order.userId.fullName : 'N/A'}
                  </td>
                  <td className="px-6 py-4">{order.amount_in} VND</td>
                  <td className="px-6 py-4">{order.amount_out} VND</td>
                  <td className="px-6 py-4">
                    {moment(order.transaction_date).format('DD/MM/YYYY HH:mm')}
                  </td>
                  <td className="px-6 py-4">{order.transaction_content}</td>
                  <td className="px-6 py-4">{order.reference_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HomeLayout>
  );
}
