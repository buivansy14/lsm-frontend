import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import HomeLayout from '../../Layouts/HomeLayout';

function Profile() {
  const { t } = useTranslation();
  const userData = useSelector((state) => state?.auth?.data);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="my-10 flex flex-col gap-6 rounded-lg p-6 bg-gray-800 text-white shadow-lg w-full sm:w-96">
          {/* Avatar */}
          <img
            className="w-40 h-40 m-auto rounded-full border-4 border-yellow-500 shadow-xl"
            src={userData?.avatar?.secure_url}
            alt="User Avatar"
          />

          {/* Full Name */}
          <h3 className="text-2xl font-semibold text-center capitalize">
            {userData?.fullName}
          </h3>

          {/* Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p className="font-medium">Email:</p>
            <p>{userData?.email}</p>
            <p className="font-medium">Role:</p>
            <p>{userData?.role}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mt-6">
            <Link
              to="/change-password"
              className="bg-yellow-600 hover:bg-yellow-500 text-center py-3 rounded-md font-semibold transition-all ease-in-out duration-300"
            >
              {t('lbl_change_password')}
            </Link>

            <Link
              to="/user/editprofile"
              className="bg-yellow-600 hover:bg-yellow-500 text-center py-3 rounded-md font-semibold transition-all ease-in-out duration-300"
            >
              {t('lbl_edit_profile')}
            </Link>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Profile;
