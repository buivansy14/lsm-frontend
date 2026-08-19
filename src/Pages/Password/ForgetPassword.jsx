import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiKey, FiMail } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { isEmail } from '../../Helpers/regexMatcher';
import HomeLayout from '../../Layouts/HomeLayout';
import { forgetPassword } from '../../Redux/Slices/AuthSlice';

function ForgetPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: '',
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!data.email) {
      toast.error('Vui lòng nhập địa chỉ email');
      return;
    }

    if (!isEmail(data.email)) {
      toast.error('Địa chỉ email không hợp lệ');
      return;
    }

    setLoading(true);
    const response = await dispatch(forgetPassword(data));
    setLoading(false);
    if (response?.payload?.success) {
      setData({
        email: '',
      });
    }
  };

  return (
    <HomeLayout>
      <div className="min-h-[85vh] bg-[#0b0f19] text-slate-100 antialiased flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          <form
            onSubmit={handleFormSubmit}
            className="bg-[#131b2e]/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <FiKey size={22} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t('lbl_forgot_password') || 'Quên Mật Khẩu'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t('msg_verification_link_sent') || 'Nhập địa chỉ email của bạn để nhận liên kết khôi phục mật khẩu qua email.'}
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5 text-start">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email
              </label>
              <div className="relative flex items-center">
                <FiMail className="absolute left-4 text-slate-500" size={16} />
                <input
                  required
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={data.email}
                  onChange={(event) => setData({ email: event.target.value })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-md shadow-amber-500/20 hover:scale-[1.01] active:scale-99 disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
              >
                {loading ? 'Đang gửi...' : (t('btn_get_verification_link') || 'Gửi liên kết khôi phục')}
              </button>
            </div>

            {/* Footer / Back to Login */}
            <div className="pt-2 border-t border-slate-800/80 text-center text-xs sm:text-sm text-slate-400">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white font-medium transition-colors inline-flex items-center gap-1.5"
              >
                <FiArrowLeft size={14} />
                <span>Quay lại trang Đăng nhập</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </HomeLayout>
  );
}

export default ForgetPassword;
