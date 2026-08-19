import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiEye, FiEyeOff, FiLock, FiShield } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { isPassword } from '../../Helpers/regexMatcher';
import HomeLayout from '../../Layouts/HomeLayout';
import { resetPassword } from '../../Redux/Slices/AuthSlice';

function ResetPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    password: '',
    cnfPassword: '',
    resetToken: useParams().resetToken,
  });

  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!isPassword(data.password)) {
      toast.error('Mật khẩu phải dài từ 6 - 16 ký tự với ít nhất một số và ký tự đặc biệt');
      return;
    }

    if (!data.password || !data.cnfPassword || !data.resetToken) {
      toast.error('Vui lòng nhập đầy đủ mật khẩu mới');
      return;
    }

    if (data.password !== data.cnfPassword) {
      toast.error('Hai mật khẩu không khớp nhau');
      return;
    }

    setLoading(true);
    const response = await dispatch(resetPassword(data));
    setLoading(false);
    if (response?.payload?.success) {
      navigate('/login');
      setData({
        password: '',
        cnfPassword: '',
      });
    }
  };

  return (
    <HomeLayout>
      <div className="min-h-[85vh] bg-[#0b0f19] text-slate-100 antialiased flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          <form
            onSubmit={handleFormSubmit}
            className="bg-[#131b2e]/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <FiShield size={22} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Đặt Lại Mật Khẩu
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Tạo mật khẩu mới an toàn cho tài khoản của bạn
              </p>
            </div>

            <div className="space-y-4">
              {/* New Password */}
              <div className="space-y-1.5 text-start">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Mật khẩu mới
                </label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 text-slate-500" size={16} />
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={data.password}
                    onChange={handleUserInput}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-500 hover:text-slate-300 p-1"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5 text-start">
                <label htmlFor="cnfPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 text-slate-500" size={16} />
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    name="cnfPassword"
                    id="cnfPassword"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={data.cnfPassword}
                    onChange={handleUserInput}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-md shadow-amber-500/20 hover:scale-[1.01] active:scale-99 disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </div>

            {/* Back to Login */}
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

export default ResetPassword;