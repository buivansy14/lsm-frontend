import moment from 'moment';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import LoadingOverlay from '../Compontents/LoadingOverlay';
import axiosInstance from '../Helpers/axiosinstance';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = location.state || {};

  useEffect(() => {
    if (!id) return navigate('/');
    const fetchTransactionDetails = async () => {
      try {
        const response = await axiosInstance.get('/order/get-order-id', {
          params: { id },
        });

        if (response.data.success) {
          setTransactionDetails(response.data.order);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transaction details:', error);
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id]);

  if (loading) {
    return <LoadingOverlay isLoading={loading} />;
  }

  return (
    <div className="max-w-xl mx-auto my-12 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-green-500 text-3xl font-bold mb-6 text-center">
        Thanh Toán Thành Công
      </h1>
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Chi Tiết Giao Dịch
        </h2>
        <p className="text-gray-600 mb-2">
          <strong className="text-gray-800">Mã giao dịch: </strong>
          {transactionDetails.transaction_id}
        </p>
        <p className="text-gray-600 mb-2">
          <strong className="text-gray-800">Số tiền thanh toán: </strong>
          {transactionDetails.amount_in.toLocaleString()} VND
        </p>
        <p className="text-gray-600 mb-2">
          <strong className="text-gray-800">Ngày giao dịch: </strong>
          {moment(transactionDetails.transaction_date).format(
            'YYYY-MM-DD, hh:mm:ss'
          )}
        </p>
        <p className="text-gray-600 mb-2">
          <strong className="text-gray-800">Nội dung: </strong>
          {transactionDetails.transaction_content}
        </p>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/')}
          className="bg-yellow-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Trở về trang chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
