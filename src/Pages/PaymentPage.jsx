import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

import Footer from '../Compontents/Footer';
import axiosInstance from '../Helpers/axiosinstance';
import { formatTime, removeDashes } from '../Utils';

const PaymentPage = () => {
  const [timeLeft, setTimeLeft] = useState(300);
  const location = useLocation();
  const { qrUrl, transactionId, courseId, amount } = location.state || {};
  const intervalIdRef = useRef(null);

  const navigate = useNavigate();
  const checkPaymentStatus = async () => {
    try {
      const response = await axiosInstance.get(
        '/transaction/get-payment-status',
        {
          params: { transactionId, courseId: removeDashes(courseId) },
        }
      );

      if (response.data.result.status === 'success') {
        toast.success('Thanh toán thành công!');
        clearInterval(intervalIdRef.current);
        navigate('/thanh-toan-thanh-cong', {
          state: { id: response.data.result?.id },
        });
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message =
        'Bạn có chắc chắn muốn rời khỏi trang này? Thông tin thanh toán sẽ bị mất';
      event.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (transactionId) {
        deleteTransaction();
      }
    };
  }, []);

  useEffect(() => {
    if (!transactionId) return navigate('/');
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      deleteTransaction();
      navigate('/gioi-thieu-khoa-hoc');
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft, navigate]);

  useEffect(() => {
    if (!transactionId) return;

    intervalIdRef.current = setInterval(() => {
      checkPaymentStatus();
    }, 4000);

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [transactionId]);

  const deleteTransaction = async () => {
    try {
      await axiosInstance.post('/transaction/delete-transaction', {
        transactionId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gray-100 border-b border-gray-300 fixed w-full top-0 z-10">
        <div className="container mx-auto flex items-center justify-center py-3 px-4">
          <div className="text-sm text-gray-600">
            Đơn hàng sẽ bị hủy sau:{' '}
            <span
              className={`font-semibold ${
                timeLeft <= 60 ? 'text-red-600' : ''
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        <div className="container mx-auto flex flex-col items-center px-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            {/* QR Code */}
            <div className="flex justify-center">
              <div>
                <h2 className="text-center">Quét mã QR để thanh toán</h2>

                {qrUrl ? (
                  <img src={qrUrl} alt="QR Code" width={300} height={300} />
                ) : (
                  <p>Đang tạo mã QR...</p>
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-2 flex flex-col items-center">
              <div>
                <span className="block text-gray-700 font-semibold text-center">
                  Ngân hàng:
                </span>
                <span className="block text-gray-900 text-center">
                  VietinBank
                </span>
              </div>
              <div>
                <span className="block text-gray-700 font-semibold text-center">
                  Số tài khoản:
                </span>
                <span className="block text-gray-900 text-center">
                  103869790238
                </span>
              </div>
              <div>
                <span className="block text-gray-700 font-semibold text-center">
                  Tên tài khoản:
                </span>
                <span className="block text-gray-900 text-center">
                  BUI VAN SY
                </span>
              </div>
              <div>
                <span className="block text-gray-700 font-semibold text-center">
                  Số tiền:
                </span>
                <span className="block text-gray-900 text-red-600 font-bold text-center ">
                  {amount?.toLocaleString() + 'đ'}
                </span>
              </div>
              <div>
                <span className="block text-gray-700 font-semibold text-center">
                  Nội dung:
                </span>
                <span className="block text-gray-900 font-bold text-center">
                  {transactionId}
                </span>
              </div>
            </div>

            {/* Note */}
            <p className="text-sm text-gray-500 mt-4">
              Lưu ý: Nếu đơn hàng của bạn không tự động kích hoạt sau khi chuyển
              khoản 5 phút, vui lòng liên hệ với chúng tôi để được hỗ trợ.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPage;
