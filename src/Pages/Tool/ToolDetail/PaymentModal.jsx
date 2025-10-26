import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ConfirmModal from '../../../Compontents/Common/ConfirmModal';
import axiosInstance from '../../../Helpers/axiosinstance';
import { useLockBodyScroll } from '../../../Hooks/useLockBodyScroll';

const TIMER_LEFT = 300; // 5 phút = 300s

export default function PaymentModal({ open, onClose, tool }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState('info'); // 'info' | 'qr'
  const [timeLeft, setTimeLeft] = useState(TIMER_LEFT); // 5 phút = 300s
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionInfo, setTransactionInfo] = useState(null);
  const intervalIdRef = useRef(null);
  const isSuccessRef = useRef(false);
  const [expired, setExpired] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const { isLoggedIn } = useSelector((state) => state.auth);

  useLockBodyScroll(open);

  useEffect(() => {
    if (open) {
      setStep('info');
      setTimeLeft(TIMER_LEFT);
    }
  }, [open]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleConfirmPayment = async () => {
    if (!isLoggedIn) {
      toast.error(t('msg_please_login_to_continue'));
      navigate('/login');
      return;
    }
    try {
      const response = await axiosInstance.post(
        '/transaction/create-qr-marketplace',
        {
          message: 'QR',
          marketplaceId: tool?._id,
        }
      );
      if (response?.data) {
        setTransactionInfo(response.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setStep('qr');
      setTimeLeft(TIMER_LEFT);
    }
  };

  const deleteTransaction = async () => {
    try {
      await axiosInstance.post('/transaction/delete-transaction', {
        transactionId: transactionInfo?.transactionId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await axiosInstance.get(
        '/transaction/get-payment-status-marketplace',
        {
          params: {
            transactionId: transactionInfo?.transactionId,
            marketplaceId: tool?._id,
          },
          showLoading: false,
        }
      );

      if (response.data.result.status === 'success') {
        toast.success('Thanh toán thành công!');
        clearInterval(intervalIdRef.current);
        isSuccessRef.current = true;
        setDownloadUrl(response.data.result.marketplace.downloadUrl);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      deleteTransaction();
      onClose();
    }
  };

  const checkTransaction = async () => {
    try {
      const response = await axiosInstance.post(
        '/transaction/check-transaction',
        {
          transactionId: transactionInfo?.transactionId,
        }
      );

      if (response.data.success) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
        onClose();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Có lỗi xảy ra khi kiểm tra giao dịch'
      );
    }
  };

  const handleDelete = () => {
    if (!isSuccessRef.current && transactionInfo?.transactionId) {
      deleteTransaction();
    }
    onClose();
  };

  const handleClose = () => {
    if (step === 'qr' && !isSuccessRef.current) {
      setOpenConfirm(true);
      return;
    }
    onClose();
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message =
        'Bạn có chắc chắn muốn rời khỏi trang này? Thông tin thanh toán sẽ bị mất';
      event.returnValue = message;
      return message;
    };
    if (open && step !== 'qr') return;

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (!isSuccessRef.current && transactionInfo?.transactionId) {
        deleteTransaction();
        onClose();
      }
    };
  }, []);

  useEffect(() => {
    if (!transactionInfo?.transactionId) return;
    checkTransaction();

    intervalIdRef.current = setInterval(() => {
      checkPaymentStatus();
    }, 4000);

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [transactionInfo]);

  useEffect(() => {
    if (step !== 'qr') return;
    if (timeLeft <= 0) {
      deleteTransaction();
      setExpired(true);
      setStep('info');
      setTransactionInfo(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  return !open ? null : (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-[900px] sm:w-5/6 p-6 shadow-2xl z-10 overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={handleClose}
        >
          <FiX className="w-6 h-6" />
        </button>

        {step === 'info' && (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t('lbl_payment')}
            </h2>

            <p
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{
                __html: t('msg_download_notice', {
                  params1: tool.name,
                }),
              }}
            />

            {/* Thông tin tool */}
            <div className="bg-white rounded-2xl border p-6 shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-information-line text-blue-500 text-xl"></i>
                {t('lbl_detail_info')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
                {/* Danh mục */}
                <div className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition rounded-xl p-4 border">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <i className="ri-folder-2-line text-lg"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('lbl_category')}</p>
                    <p className="font-medium">
                      {tool.categoryId?.name || '—'}
                    </p>
                  </div>
                </div>

                {/* Kích thước */}
                <div className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition rounded-xl p-4 border">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <i className="ri-ruler-line text-lg"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {t('lbl_file_size')}
                    </p>
                    <p className="font-medium">{tool.size || '—'}</p>
                  </div>
                </div>

                {/* Loại file */}
                <div className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition rounded-xl p-4 border">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <i className="ri-file-line text-lg"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {t('lbl_file_type')}
                    </p>
                    <p className="font-medium">{tool.typeFile || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phí download */}
            <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-2xl p-2 text-center mb-6 shadow-md">
              <span className="block text-sm uppercase text-yellow-100">
                {t('lbl_download_fee')}
              </span>
              <span className="text-3xl font-extrabold mt-1 text-white">
                {tool.price === 0
                  ? t('lbl_free')
                  : `${tool.price?.toLocaleString()}₫`}
              </span>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="w-full py-2 rounded-xl bg-yellow-600 text-white font-bold hover:bg-yellow-700 transition"
            >
              {t('lbl_payment_and_download')}
            </button>
          </>
        )}

        {step === 'qr' && transactionInfo && (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t('lbl_scan_qr_to_pay')}
            </h2>
            <div className="flex flex-col sm:flex-row gap-6">
              {/* QR Code */}
              <div className="flex-[5] flex items-center justify-center bg-white p-6 rounded-2xl border shadow-sm">
                <img
                  src={transactionInfo?.qrUrl}
                  alt="QR Code"
                  className="object-contain max-w-full max-h-[300px]"
                />
              </div>

              {/* Hướng dẫn và thông tin thanh toán */}
              <div className="flex-[7] flex flex-col gap-6">
                {/* Thông tin ngân hàng */}
                <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm text-gray-700 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {t('lbl_transfer_info')}
                  </h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:text-base">
                    <p className="font-medium">{t('lbl_bank')}:</p>
                    <p>VietinBank</p>

                    <p className="font-medium">{t('lbl_account_number')}:</p>
                    <p className="font-mono text-gray-800">103869790238</p>

                    <p className="font-medium">{t('lbl_account_name')}:</p>
                    <p>BUI VAN SY</p>

                    <p className="font-medium">{t('lbl_price')}:</p>
                    <p className="font-semibold text-yellow-600">
                      {tool.price?.toLocaleString() + '₫'}
                    </p>
                  </div>
                </div>

                {/* Hướng dẫn thanh toán */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                  <p>{t('msg_payment_instruction')}</p>
                  <p>
                    {t('msg_transfer_content_required')}{' '}
                    <span className="font-mono text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                      {transactionInfo.transactionId}
                    </span>
                  </p>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t('msg_transfer_note', {
                        params1: transactionInfo.transactionId,
                      }),
                    }}
                  ></p>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t('msg_transfer_reminder'),
                    }}
                  ></p>
                </div>

                {/* Countdown và nút tải */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center shadow-sm space-y-3">
                  {isSuccessRef.current && isSuccess ? (
                    <div className="text-green-600 font-bold">
                      {t('msg_payment_success')}
                    </div>
                  ) : (
                    <div className="text-gray-600">
                      {t('lbl_time_left_to_scan_qr')}:{' '}
                      <span className="font-bold text-yellow-600">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  )}

                  {timeLeft > 0 && isSuccess && isSuccessRef.current && (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block py-2.5 rounded-xl bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition"
                    >
                      {t('btn_download_after_payment')}
                    </a>
                  )}

                  <p className="text-xs text-red-500">
                    {t('lbl_qr_expired_note')}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <ConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
        title="confirm_cancel_payment"
        message="msg_cancel_payment_warning"
        confirmText="btn_confirm"
        type="danger"
        size="md"
      />
      <ConfirmModal
        open={expired}
        onClose={() => setExpired(false)}
        onConfirm={() => {
          setExpired(false);
          handleConfirmPayment();
        }}
        title="title_qr_expired"
        message="msg_qr_expired_message"
        confirmText="btn_retry_transaction"
        type="warning"
        size="sm"
        cancelText="btn_close"
      />
    </div>
  );
}
