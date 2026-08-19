import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiEye, FiEyeOff, FiKey, FiLock } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { isPassword } from '../../Helpers/regexMatcher';
import HomeLayout from '../../Layouts/HomeLayout';
import { changePassword } from '../../Redux/Slices/AuthSlice';

function ChangePassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userPassword, setUserPassword] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setUserPassword({
      ...userPassword,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!userPassword.oldPassword || !userPassword.newPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin mật khẩu cũ và mới');
      return;
    }
    if (!isPassword(userPassword.newPassword)) {
      toast.error(
        'Mật khẩu phải dài từ 6 - 16 ký tự với ít nhất một số và ký tự đặc biệt'
      );
      return;
    }

    setLoading(true);
    const response = await dispatch(changePassword(userPassword));
    setLoading(false);
    if (response?.payload?.success) {
      navigate('/user/profile');
      setUserPassword({
        oldPassword: '',
        newPassword: '',
      });
    }
  };

  return (
    <HomeLayout>
      <div className="min-h-[85vh] bg-[#0b0f19] text-slate-100 antialiased flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

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
                {t('btn_update_password') || 'Đổi Mật Khẩu'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Nhập mật khẩu hiện tại và thiết lập mật khẩu mới
              </p>
            </div>

            <div className="space-y-4">
              {/* Old Password */}
              <div className="space-y-1.5 text-start">
                <label htmlFor="oldPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {t('lbl_old_password') || 'Mật khẩu cũ'}
                </label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 text-slate-500" size={16} />
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    name="oldPassword"
                    id="oldPassword"
                    placeholder={t('ph_enter_old_password') || 'Nhập mật khẩu hiện tại'}
                    className="w-full pl-11 pr-11 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={userPassword.oldPassword}
                    onChange={handlePasswordChange}
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

              {/* New Password */}
              <div className="space-y-1.5 text-start">
                <label htmlFor="newPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {t('lbl_new_password') || 'Mật khẩu mới'}
                </label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 text-slate-500" size={16} />
                  <input
                    required
                    type={showPasswordNew ? 'text' : 'password'}
                    name="newPassword"
                    id="newPassword"
                    placeholder={t('ph_enter_new_password') || 'Nhập mật khẩu mới'}
                    className="w-full pl-11 pr-11 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={userPassword.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordNew(!showPasswordNew)}
                    className="absolute right-3.5 text-slate-500 hover:text-slate-300 p-1"
                  >
                    {showPasswordNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-md shadow-amber-500/20 hover:scale-[1.01] active:scale-99 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang cập nhật...' : (t('btn_update_password') || 'Cập nhật mật khẩu')}
              </button>
            </div>

            {/* Back to Profile */}
            <div className="pt-2 border-t border-slate-800/80 text-center text-xs sm:text-sm text-slate-400">
              <Link
                to="/user/profile"
                className="text-slate-300 hover:text-white font-medium transition-colors inline-flex items-center gap-1.5"
              >
                <FiArrowLeft size={14} />
                <span>Quay lại hồ sơ cá nhân</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </HomeLayout>
  );
}

export default ChangePassword;
