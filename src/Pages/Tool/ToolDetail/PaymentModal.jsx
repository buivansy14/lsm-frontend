import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FiAlertCircle, FiCheckCircle, FiClock, FiCreditCard, FiDownload, FiFolder, FiHardDrive, FiInfo, FiLayers, FiX } from 'react-icons/fi';
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
  const [timeLeft, setTimeLeft] = useState(TIMER_LEFT);
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
      toast.error(t('msg_please_login_to_continue') || 'Vui lòng đăng nhập để tiếp tục');
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
      toast.error(error?.response?.data?.message);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background blur */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#131b2e] text-slate-100 rounded-2xl w-full max-w-[850px] shadow-2xl border border-slate-800 z-10 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <FiCreditCard className="text-amber-400" size={18} />
            <h2 className="text-base sm:text-lg font-bold text-white">
              {step === 'info' ? (t('lbl_payment') || 'Thanh toán & Tải công cụ') : (t('lbl_scan_qr_to_pay') || 'Quét mã QR thanh toán')}
            </h2>
          </div>
          <button
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
            onClick={handleClose}
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {step === 'info' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {tool?.name}
                </h3>
                <p
                  className="text-xs sm:text-sm text-slate-300 mt-1"
                  dangerouslySetInnerHTML={{
                    __html: t('msg_download_notice', {
                      params1: `<span class="text-blue-400 font-semibold">${tool?.name}</span>`,
                    }) || `Bạn sắp tải xuống <strong>${tool?.name}</strong>. Vui lòng hoàn tất thanh toán.`,
                  }}
                />
              </div>

              {/* Thông tin tool */}
              <div className="bg-[#0b0f19]/60 rounded-xl border border-slate-800/80 p-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FiInfo className="text-blue-400" />
                  <span>{t('lbl_detail_info') || 'Thông tin chi tiết'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <p className="text-slate-500 text-xs">{t('lbl_category') || 'Danh mục'}</p>
                    <p className="font-semibold text-white mt-0.5">{tool?.categoryId?.name || '—'}</p>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <p className="text-slate-500 text-xs">{t('lbl_file_size') || 'Kích thước'}</p>
                    <p className="font-mono text-slate-200 mt-0.5">{tool?.size || '—'}</p>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <p className="text-slate-500 text-xs">{t('lbl_file_type') || 'Loại file'}</p>
                    <p className="font-mono text-slate-200 mt-0.5 uppercase">{tool?.typeFile || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Phí download */}
              <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 rounded-xl p-4 text-center border border-blue-500/30">
                <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  {t('lbl_download_fee') || 'Phí tải xuống'}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold mt-1 text-amber-400 font-mono block">
                  {tool?.price === 0
                    ? (t('lbl_free') || 'Miễn phí')
                    : `${tool?.price?.toLocaleString('vi-VN')}₫`}
                </span>
              </div>

              <button
                onClick={handleConfirmPayment}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-99"
              >
                {t('lbl_payment_and_download') || 'Tiếp tục thanh toán & Tải xuống'}
              </button>
            </div>
          )}

          {step === 'qr' && transactionInfo && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* QR Code Column */}
              <div className="md:col-span-5 flex flex-col items-center justify-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-700 shadow-md">
                <img
                  src={transactionInfo?.qrUrl}
                  alt="QR Code thanh toán"
                  className="object-contain w-full max-h-[260px] rounded-lg"
                />
                <span className="text-[11px] text-gray-500 mt-2 font-medium text-center">
                  Mở ứng dụng Ngân hàng để quét mã QR
                </span>
              </div>

              {/* Information Column */}
              <div className="md:col-span-7 space-y-4 text-xs sm:text-sm text-start">
                {/* Thông tin ngân hàng */}
                <div className="bg-[#0b0f19]/70 border border-slate-800 p-4 rounded-xl space-y-2">
                  <h4 className="font-semibold text-white text-xs sm:text-sm pb-1.5 border-b border-slate-800 flex items-center gap-1.5">
                    <FiCreditCard className="text-amber-400" />
                    <span>{t('lbl_transfer_info') || 'Thông tin chuyển khoản'}</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-y-1.5 text-slate-300">
                    <p className="text-slate-500">{t('lbl_bank') || 'Ngân hàng'}:</p>
                    <p className="font-semibold text-white">VietinBank</p>

                    <p className="text-slate-500">{t('lbl_account_number') || 'Số tài khoản'}:</p>
                    <p className="font-mono text-cyan-400 font-bold">103869790238</p>

                    <p className="text-slate-500">{t('lbl_account_name') || 'Chủ tài khoản'}:</p>
                    <p className="font-semibold text-white">BUI VAN SY</p>

                    <p className="text-slate-500">{t('lbl_price') || 'Số tiền'}:</p>
                    <p className="font-bold text-amber-400 font-mono">
                      {tool?.price?.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>

                {/* Hướng dẫn thanh toán */}
                <div className="bg-[#0b0f19]/50 p-4 rounded-xl border border-slate-800 space-y-2 text-slate-300 leading-relaxed text-xs">
                  <p className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <FiAlertCircle size={14} />
                    <span>Nội dung chuyển khoản bắt buộc:</span>
                  </p>
                  <p className="font-mono text-sm font-bold text-yellow-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 select-all text-center">
                    {transactionInfo.transactionId}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Hệ thống sẽ tự động xác nhận sau 5 - 10 giây khi nhận được tiền.
                  </p>
                </div>

                {/* Countdown / Download Action */}
                <div className="bg-[#0b0f19]/80 p-4 rounded-xl border border-slate-800 text-center space-y-2.5">
                  {isSuccessRef.current && isSuccess ? (
                    <div className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                      <FiCheckCircle size={16} />
                      <span>{t('msg_payment_success') || 'Thanh toán thành công!'}</span>
                    </div>
                  ) : (
                    <div className="text-slate-400 flex items-center justify-center gap-1.5">
                      <FiClock size={13} className="text-amber-400" />
                      <span>{t('lbl_time_left_to_scan_qr') || 'Thời gian quét QR'}:</span>
                      <span className="font-bold text-amber-400 font-mono text-sm">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  )}

                  {timeLeft > 0 && isSuccess && isSuccessRef.current && (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
                    >
                      <FiDownload size={14} />
                      <span>{t('btn_download_after_payment') || 'Tải xuống ngay'}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
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
