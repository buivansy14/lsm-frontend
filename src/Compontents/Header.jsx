import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBars, FaGlobe, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import axiosInstance from '../Helpers/axiosinstance';
import { useLockBodyScroll } from '../Hooks/useLockBodyScroll';
import i18n from '../i18n/i18n';

function Header({ isLoggedIn, handleLogout, fullName }) {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const role = useSelector((state) => state?.auth?.role);
  useLockBodyScroll(isMenuOpen);
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'vi'
  );

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const toggleLanguage = () => {
    const newLang = language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get('/settings');
        const all = res.data?.data || [];
        const mapped = Object.fromEntries(all.map((s) => [s.key, s.value]));
        setSettings(mapped);
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <header className="bg-gray-800 text-white shadow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-yellow-400">
          TechOnline
        </Link>

        {/* Nút menu mobile */}
        <button
          className="lg:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation */}
        <nav
          className={`${
            isMenuOpen
              ? 'fixed top-16 left-0 w-full bg-gray-900 z-20 block animate-slide-down'
              : 'hidden'
          } lg:flex lg:items-center lg:space-x-6 lg:bg-transparent lg:static`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-4 p-5 lg:p-0">
            {/* Links */}
            <Link
              to="/"
              className="hover:text-yellow-400 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('lbl_home')}
            </Link>
            <Link
              to="/courses"
              className="hover:text-yellow-400 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('lbl_course')}
            </Link>
            {settings?.marketplace_enabled && (
              <Link
                to="/marketplace"
                className="hover:text-yellow-400 transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('lbl_marketplace')}
              </Link>
            )}
            <Link
              to="/contact"
              className="hover:text-yellow-400 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('lbl_contact')}
            </Link>

            {/* Ngôn ngữ */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-3 py-1.5 rounded-md transition text-sm"
            >
              <FaGlobe className="text-lg" />
              <span>{language === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}</span>
            </button>

            {/* Login / Signup */}
            {!isLoggedIn && (
              <div className="flex flex-col lg:flex-row gap-2 mt-4 lg:mt-0">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <button className="bg-yellow-500 px-4 py-2 rounded-md font-medium text-sm hover:bg-yellow-600 transition duration-300 w-full lg:w-auto">
                    {t('btn_login')}
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <button className="border border-yellow-500 px-4 py-2 rounded-md font-medium text-sm hover:bg-yellow-600 transition duration-300 w-full lg:w-auto">
                    {t('btn_signup')}
                  </button>
                </Link>
              </div>
            )}

            {/* User Info */}
            {isLoggedIn && (
              <>
                {/* 🟡 Mobile */}
                <div className="block lg:hidden border-t border-gray-700 mt-4 pt-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaUserCircle className="text-2xl" />
                    <span className="text-sm font-medium">{fullName}</span>
                  </div>

                  <Link
                    to="/user/profile"
                    className="block px-2 py-2 rounded-md hover:bg-gray-700 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('lbl_profile')}
                  </Link>

                  {role === 'ADMIN' && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="block px-2 py-2 rounded-md hover:bg-gray-700 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/admin/setting"
                        className="block px-2 py-2 rounded-md hover:bg-gray-700 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('lbl_setting')}
                      </Link>
                      <Link
                        to="/admin/quan-ly-nguoi-dung"
                        className="block px-2 py-2 rounded-md hover:bg-gray-700 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('lbl_manage_users')}
                      </Link>
                      <Link
                        to="/admin/quan-ly-giao-dich"
                        className="block px-2 py-2 rounded-md hover:bg-gray-700 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('lbl_manage_transactions')}
                      </Link>
                      <Link
                        to="/course/create"
                        className="block px-2 py-2 rounded-md hover:bg-gray-700 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('lbl_create_course')}
                      </Link>
                      <Link
                        to="/admin/course-progress"
                        className="block px-2 py-2 rounded-md hover:bg-gray-700 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('lbl_activate_course')}
                      </Link>
                      <Link
                        to="/admin/marketplace"
                        className="block px-2 py-2 rounded-md hover:bg-gray-700 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('lbl_manage_marketplace')}
                      </Link>

                      <Link
                        to="/admin/categories"
                        className="block px-2 py-2 rounded-md hover:bg-gray-700 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('lbl_manage_categories')}
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-2 py-2 mt-2 rounded-md hover:bg-gray-700 transition"
                  >
                    {t('btn_logout')}
                  </button>
                </div>

                {/* 🟢 Desktop */}
                <div className="hidden lg:block relative" ref={dropdownRef}>
                  <button
                    className="flex items-center space-x-2 hover:text-yellow-400"
                    onClick={toggleDropdown}
                  >
                    <FaUserCircle className="text-2xl" />
                    <span className="text-sm">{fullName}</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-gray-700 text-white rounded-md shadow-lg z-20">
                      <Link
                        to="/user/profile"
                        className="block px-4 py-2 hover:bg-gray-600"
                      >
                        {t('lbl_profile')}
                      </Link>
                      {role === 'ADMIN' && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            className="block px-4 py-2 hover:bg-gray-600"
                          >
                            Admin Dashboard
                          </Link>
                          <Link
                            to="/admin/setting"
                            className="block px-4 py-2 hover:bg-gray-600"
                          >
                            {t('lbl_setting')}
                          </Link>
                          <Link
                            to="/admin/quan-ly-nguoi-dung"
                            className="block px-4 py-2 hover:bg-gray-600"
                          >
                            {t('lbl_manage_users')}
                          </Link>
                          <Link
                            to="/admin/quan-ly-giao-dich"
                            className="block px-4 py-2 hover:bg-gray-600"
                          >
                            {t('lbl_manage_transactions')}
                          </Link>
                          <Link
                            to="/course/create"
                            className="block px-4 py-2 hover:bg-gray-600"
                          >
                            {t('lbl_create_course')}
                          </Link>
                          <Link
                            to="/admin/course-progress"
                            className="block px-4 py-2 hover:bg-gray-600"
                          >
                            {t('lbl_activate_course')}
                          </Link>
                          <Link
                            to="/admin/translation"
                            className="block px-4 py-2 hover:bg-gray-600"
                          >
                            {t('lbl_manage_translation')}
                          </Link>
                          <Link
                            to="/admin/marketplace"
                            className="block px-4 py-2 hover:bg-gray-600"
                          >
                            {t('lbl_manage_marketplace')}
                          </Link>
                          <Link
                            to="/admin/categories"
                            className="block px-4 py-2 hover:bg-gray-600"
                          >
                            {t('lbl_manage_categories')}
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 hover:bg-gray-600"
                      >
                        {t('btn_logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
