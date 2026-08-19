import { FiCheckCircle, FiCreditCard, FiX } from 'react-icons/fi';
import { LoadingButton } from './Loading';

const Modal = ({ isOpen, onClose, isLoading, onSubmit, info }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-[#131b2e] text-slate-100 rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <FiCreditCard className="text-amber-400" size={20} />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Đăng ký khóa học
            </h2>
          </div>
          <button
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Col: Course Info */}
            <div className="md:col-span-7 space-y-4 text-start">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Thông tin khóa học
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {info?.title || 'Khóa học'}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0b0f19]/60 p-4 rounded-xl border border-slate-800/60">
                {info?.description || 'Tham gia khóa học để bắt đầu lộ trình học tập bài bản cùng giảng viên chuyên nghiệp.'}
              </p>

              <div className="space-y-2 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-400 shrink-0" size={14} />
                  <span>Quyền truy cập toàn bộ bài giảng</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-400 shrink-0" size={14} />
                  <span>Tài liệu & mã nguồn thực hành đi kèm</span>
                </div>
              </div>
            </div>

            {/* Right Col: Pricing & Payment Summary */}
            <div className="md:col-span-5 bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-sm text-white mb-3 pb-2 border-b border-slate-800">
                  Chi tiết thanh toán
                </h4>

                <div className="space-y-2.5 text-xs">
                  {info?.oldPrice && info.oldPrice > (info?.price || 0) && (
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Giá gốc</span>
                      <span className="line-through font-mono">
                        {info.oldPrice.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Học phí khóa học</span>
                    <span className="font-bold text-amber-400 font-mono text-sm">
                      {info?.price && info.price > 0
                        ? `${info.price.toLocaleString('vi-VN')}₫`
                        : 'Miễn phí'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center font-bold text-sm text-white">
                    <span>TỔNG CỘNG</span>
                    <span className="text-base text-emerald-400 font-mono">
                      {info?.price && info.price > 0
                        ? `${info.price.toLocaleString('vi-VN')}₫`
                        : '0₫'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <LoadingButton
                  isLoading={isLoading}
                  label="Tiếp tục thanh toán"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
