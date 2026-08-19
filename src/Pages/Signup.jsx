import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { BsPersonCircle } from 'react-icons/bs';
import { FiArrowRight, FiCamera, FiEye, FiEyeOff, FiLock, FiMail, FiUser, FiUserPlus } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { isEmail, isPassword } from '../Helpers/regexMatcher';
import HomeLayout from '../Layouts/HomeLayout';
import { creatAccount } from '../Redux/Slices/AuthSlice';

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [prevImage, setPrevImage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    avatar: '',
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  }

  function getImage(event) {
    event.preventDefault();
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      setSignupData({
        ...signupData,
        avatar: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener('load', function () {
        setPrevImage(this.result);
      });
    }
  }

  async function createNewAccount(event) {
    event.preventDefault();
    if (!signupData.email || !signupData.fullName || !signupData.password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (signupData.fullName.length < 5) {
      toast.error('Tên phải có ít nhất 5 ký tự');
      return;
    }

    if (!isEmail(signupData.email)) {
      toast.error('Địa chỉ email không hợp lệ');
      return;
    }

    if (!isPassword(signupData.password)) {
      toast.error(
        'Mật khẩu phải dài từ 6 - 16 ký tự với ít nhất một số và ký tự đặc biệt'
      );
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('fullName', signupData.fullName);
    formData.append('email', signupData.email);
    formData.append('password', signupData.password);
    formData.append('avatar', signupData.avatar);

    const response = await dispatch(creatAccount(formData));
    setLoading(false);
    if (response?.payload?.success) {
      navigate('/');
      setSignupData({
        fullName: '',
        email: '',
        password: '',
        avatar: '',
      });
      setPrevImage('');
    }
  }

  return (
    <HomeLayout>
      <div className="min-h-[85vh] bg-[#0b0f19] text-slate-100 antialiased flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          <form
            noValidate
            onSubmit={createNewAccount}
            className="bg-[#131b2e]/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md space-y-5"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <FiUserPlus size={22} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t('lbl_register_account') || 'Tạo Tài Khoản'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Đăng ký tài khoản để truy cập các khóa học và tài nguyên
              </p>
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center pt-1">
              <label htmlFor="image_uploads" className="relative cursor-pointer group">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-slate-600 group-hover:border-blue-400 flex items-center justify-center bg-slate-900 transition-all">
                  {prevImage ? (
                    <img className="w-full h-full object-cover" src={prevImage} alt="Avatar preview" />
                  ) : (
                    <BsPersonCircle className="w-16 h-16 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-blue-600 text-white shadow-md group-hover:scale-110 transition-transform">
                  <FiCamera size={12} />
                </div>
              </label>
              <input
                className="hidden"
                type="file"
                name="image_uploads"
                id="image_uploads"
                accept=".jpg, .jpeg, .png, .svg"
                onChange={getImage}
              />
              <span className="text-[11px] text-slate-500 mt-1.5">Nhấp vào ảnh để tải ảnh đại diện</span>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1 text-start">
                <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {t('lbl_full_name') || 'Họ và tên'}
                </label>
                <div className="relative flex items-center">
                  <FiUser className="absolute left-4 text-slate-500" size={16} />
                  <input
                    type="text"
                    required
                    name="fullName"
                    id="fullName"
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    onChange={handleUserInput}
                    value={signupData.fullName}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1 text-start">
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
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    onChange={handleUserInput}
                    value={signupData.email}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1 text-start">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {t('lbl_password') || 'Mật khẩu'}
                </label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 text-slate-500" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    onChange={handleUserInput}
                    value={signupData.password}
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
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-md shadow-amber-500/20 hover:scale-[1.01] active:scale-99"
              >
                {loading ? 'Đang tạo tài khoản...' : (t('btn_create_account') || 'Tạo tài khoản')}
              </button>
            </div>

            {/* Footer / Switch to Login */}
            <div className="pt-2 border-t border-slate-800/80 text-center text-xs sm:text-sm text-slate-400">
              <span>{t('msg_already_registered') || 'Đã có tài khoản?'} </span>
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-1 ml-1"
              >
                <span>{t('btn_login') || 'Đăng nhập ngay'}</span>
                <FiArrowRight size={12} />
              </Link>
            </div>

          </form>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Signup;
