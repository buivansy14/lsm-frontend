import { useTranslation } from 'react-i18next';
import { FiBookOpen, FiEdit3, FiKey, FiMail, FiShield, FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getImageUrl } from '../../Helpers/imageHelper';
import HomeLayout from '../../Layouts/HomeLayout';

function Profile() {
  const { t } = useTranslation();
  const userData = useSelector((state) => state?.auth?.data);

  return (
    <HomeLayout>
      <div className="min-h-[85vh] bg-[#0b0f19] text-slate-100 antialiased flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg">
          <div className="bg-[#131b2e]/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md space-y-6">
            
            {/* Header / Avatar Profile */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-blue-500/40 shadow-xl bg-slate-900 flex items-center justify-center">
                  {userData?.avatar?.secure_url ? (
                    <img
                      className="w-full h-full object-cover"
                      src={getImageUrl(userData?.avatar?.secure_url)}
                      alt={userData?.fullName || 'User Avatar'}
                    />
                  ) : (
                    <FiUser size={48} className="text-slate-500" />
                  )}
                </div>

                {/* Role Badge */}
                <span className="absolute bottom-0 right-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-md border border-amber-400/40">
                  {userData?.role === 'ADMIN' ? 'Quản trị viên' : 'Học viên'}
                </span>
              </div>

              <div className="pt-1">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {userData?.fullName || 'Tên người dùng'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {userData?.email}
                </p>
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="bg-[#0b0f19]/60 rounded-2xl p-5 border border-slate-800/80 space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                <span className="flex items-center gap-2 text-slate-400">
                  <FiUser className="text-blue-400" size={15} />
                  <span>{t('lbl_full_name') || 'Họ và tên'}</span>
                </span>
                <span className="font-semibold text-white">{userData?.fullName}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                <span className="flex items-center gap-2 text-slate-400">
                  <FiMail className="text-emerald-400" size={15} />
                  <span>Email</span>
                </span>
                <span className="font-mono text-slate-200">{userData?.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-400">
                  <FiShield className="text-amber-400" size={15} />
                  <span>Vai trò</span>
                </span>
                <span className="font-semibold text-amber-400 uppercase tracking-wide text-xs">
                  {userData?.role || 'USER'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                to="/user/editprofile"
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md shadow-blue-600/25 hover:scale-[1.02] active:scale-98"
              >
                <FiEdit3 size={15} />
                <span>{t('lbl_edit_profile') || 'Sửa thông tin'}</span>
              </Link>

              <Link
                to="/change-password"
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-98"
              >
                <FiKey size={15} />
                <span>{t('lbl_change_password') || 'Đổi mật khẩu'}</span>
              </Link>
            </div>

            {/* Quick Access to Courses */}
            <div className="pt-2 border-t border-slate-800/80 text-center">
              <Link
                to="/courses"
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors inline-flex items-center gap-1.5"
              >
                <FiBookOpen size={13} />
                <span>Xem danh sách khóa học của bạn</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Profile;
