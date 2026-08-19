import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { BsPersonCircle } from 'react-icons/bs';
import { FiArrowLeft, FiCamera, FiEdit3, FiUser } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import HomeLayout from '../../Layouts/HomeLayout';
import { getuserData, updateProfile } from '../../Redux/Slices/AuthSlice';

function EditProfile() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    previewImage: '',
    fullName: '',
    avatar: undefined,
    userId: useSelector((state) => state?.auth?.data?._id),
  });

  function handleImageUpload(e) {
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener('load', function () {
        setData({
          ...data,
          previewImage: this.result,
          avatar: uploadedImage,
        });
      });
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!data.fullName && !data.avatar) {
      toast.error('Vui lòng nhập họ tên hoặc chọn ảnh mới để cập nhật');
      return;
    }
    if (data.fullName && data.fullName.length < 5) {
      toast.error('Tên không được ít hơn 5 ký tự');
      return;
    }

    setLoading(true);
    const fromData = new FormData();
    if (data.fullName) fromData.append('fullName', data.fullName);
    if (data.avatar) fromData.append('avatar', data.avatar);

    await dispatch(updateProfile(fromData));
    await dispatch(getuserData());
    setLoading(false);
    navigate('/user/profile');
  }

  return (
    <HomeLayout>
      <div className="min-h-[85vh] bg-[#0b0f19] text-slate-100 antialiased flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          <form
            onSubmit={onFormSubmit}
            className="bg-[#131b2e]/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
                <FiEdit3 size={22} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t('lbl_edit_profile') || 'Chỉnh Sửa Thông Tin'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Cập nhật ảnh đại diện và họ tên của bạn
              </p>
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center pt-1">
              <label htmlFor="image_uploads" className="relative cursor-pointer group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-slate-600 group-hover:border-blue-400 flex items-center justify-center bg-slate-900 transition-all">
                  {data.previewImage ? (
                    <img className="w-full h-full object-cover" src={data.previewImage} alt="Avatar preview" />
                  ) : (
                    <BsPersonCircle className="w-20 h-20 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-blue-600 text-white shadow-md group-hover:scale-110 transition-transform">
                  <FiCamera size={13} />
                </div>
              </label>
              <input
                onChange={handleImageUpload}
                className="hidden"
                type="file"
                id="image_uploads"
                name="image_uploads"
                accept=".jpg, .png, .svg,.jpeg"
              />
              <span className="text-[11px] text-slate-500 mt-1.5">Nhấp vào ảnh để thay đổi ảnh đại diện</span>
            </div>

            {/* Full Name Field */}
            <div className="space-y-1.5 text-start">
              <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                {t('lbl_full_name') || 'Họ và tên'}
              </label>
              <div className="relative flex items-center">
                <FiUser className="absolute left-4 text-slate-500" size={16} />
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder={t('ph_enter_full_name') || 'Nhập họ và tên mới...'}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  onChange={handleInputChange}
                  value={data.fullName}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-md shadow-amber-500/20 hover:scale-[1.01] active:scale-99 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang cập nhật...' : (t('btn_update_profile') || 'Lưu thay đổi')}
              </button>
            </div>

            {/* Back to Profile */}
            <div className="pt-2 border-t border-slate-800/80 text-center text-xs sm:text-sm text-slate-400">
              <Link
                to="/user/profile"
                className="text-slate-300 hover:text-white font-medium transition-colors inline-flex items-center gap-1.5"
              >
                <FiArrowLeft size={14} />
                <span>{t('btn_back_to_profile') || 'Quay lại hồ sơ cá nhân'}</span>
              </Link>
            </div>

          </form>
        </div>
      </div>
    </HomeLayout>
  );
}

export default EditProfile;
