import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';

import { useLockBodyScroll } from '../../Hooks/useLockBodyScroll';

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Xác nhận hành động',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này không?',
  confirmText = 'Đồng ý',
  cancelText = 'btn_cancel',
  size = 'sm',
  loading = false,
  type = 'danger', // 'danger' | 'info' | 'success'
}) {
  const { t } = useTranslation();
  useLockBodyScroll();

  if (!open) return null;

  const colorClasses = {
    danger: 'bg-red-600 hover:bg-red-700',
    info: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} p-6 z-10`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">{t(title)}</h3>
        <p className="text-gray-600 mb-6">{t(message)}</p>

        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            {t(cancelText)}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg transition ${colorClasses[type]} disabled:opacity-50`}
          >
            {loading ? 'Đang xử lý...' : t(confirmText)}
          </button>
        </div>
      </div>
    </div>
  );
}
