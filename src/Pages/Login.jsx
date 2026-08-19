import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiLogIn, FiMail } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '../Compontents/Loading';
import { useIsRequestPending } from '../Hooks/useStatus';
import HomeLayout from '../Layouts/HomeLayout';
import { login } from '../Redux/Slices/AuthSlice';

function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useIsRequestPending('auth', 'login');
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setloginData] = useState({
    email: '',
    password: '',
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setloginData({
      ...loginData,
      [name]: value,
    });
  }

  async function onLogin(event) {
    event.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('Vui lòng nhập đầy đủ Email và Mật khẩu');
      return;
    }

    const response = await dispatch(login(loginData));
    if (response?.payload?.success) {
      navigate('/');
      setloginData({
        email: '',
        password: '',
      });
    }
  }

  return (
    <HomeLayout>
      <div className="min-h-[85vh] bg-[#0b0f19] text-slate-100 antialiased flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          <form
            noValidate
            onSubmit={onLogin}
            className="bg-[#131b2e]/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md space-y-6"
          >
            {/* Header / Logo */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
                <FiLogIn size={22} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t('btn_login') || 'Đăng Nhập'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {t('msg_welcome_to_edu_platform') || 'Chào mừng bạn quay trở lại với TechOnline'}
              </p>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5 text-start">
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Email
                </label>
                <div className="relative flex items-center">
                  <FiMail className="absolute left-4 text-slate-500" size={16} />
                  <input
                    type="email"
                    required
                    name="email"
                    id="email"
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    onChange={handleUserInput}
                    value={loginData.email}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 text-start">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {t('lbl_password') || 'Mật khẩu'}
                  </label>
                  <Link
                    to="/forget-password"
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
                  >
                    {t('lbl_forgot_password') || 'Quên mật khẩu?'}
                  </Link>
                </div>
                
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 text-slate-500" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    onChange={handleUserInput}
                    value={loginData.password}
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
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <LoadingButton isLoading={isLoading} label={t('btn_login') || 'Đăng Nhập'} />
            </div>

            {/* Footer / Switch to Signup */}
            <div className="pt-2 border-t border-slate-800/80 text-center text-xs sm:text-sm text-slate-400">
              <span>{t('msg_no_account_yet') || 'Chưa có tài khoản?'} </span>
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-1 ml-1"
              >
                <span>{t('btn_signup') || 'Đăng ký ngay'}</span>
                <FiArrowRight size={12} />
              </Link>
            </div>

          </form>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Login;
