import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
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
      toast.error('All fields are mandatory');
      return;
    }
    if (!isPassword(userPassword.newPassword)) {
      toast.error(
        'Password should be 6 - 16 character long with atleast a number and special character'
      );
      return;
    }
    const response = await dispatch(changePassword(userPassword));
    if (response?.payload?.success) {
      navigate('/user/profile');
      setUserPassword({
        oldPassword: '',
        newPassword: '',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordNewVisibility = () => {
    setShowPasswordNew(!showPasswordNew);
  };

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center gap-6 rounded-lg p-4 text-white w-[400px] h-[26rem] shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">
            {t('btn_update_password')}
          </h1>

          <div className="flex flex-col gap-1">
            <label htmlFor="oldPassword" className="font-semibold">
              {t('lbl_old_password')}
            </label>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                name="oldPassword"
                id="oldPassword"
                placeholder={t('ph_enter_old_password')}
                className="bg-transparent px-4 py-2 border rounded-md w-full"
                value={userPassword.oldPassword}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-3 text-white "
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}{' '}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold" htmlFor="newPassword">
              {t('lbl_new_password')}
            </label>
            <div className="relative">
              <input
                required
                type={showPasswordNew ? 'text' : 'password'}
                name="newPassword"
                id="newPassword"
                placeholder={t('ph_enter_new_password')}
                className="bg-transparent px-4 py-2 border rounded-md w-full"
                value={userPassword.newPassword}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                onClick={togglePasswordNewVisibility}
                className="absolute right-2 top-3 text-white "
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}{' '}
              </button>
            </div>
          </div>

          <Link to={'/user/profile'}>
            <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
              <AiOutlineArrowLeft /> {t('btn_back')}
            </p>
          </Link>

          <button
            className="w-full bg-yellow-600 hover:bg-yellow-700 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
            type="submit"
          >
            {t('btn_update_password')}
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}
export default ChangePassword;
