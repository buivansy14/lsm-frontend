import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Header({ isLoggedIn, handleLogout, fullName }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const role = useSelector((state) => state?.auth?.role);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header className="bg-gray-800 text-white p-5">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          EduPlatform
        </Link>
        <nav className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-yellow-500">
            Trang chủ
          </Link>
          <Link to="/courses" className="hover:text-yellow-500">
            Khóa học
          </Link>
          <Link to="/about" className="hover:text-yellow-500">
            Giới thiệu
          </Link>
          <Link to="/contact" className="hover:text-yellow-500">
            Liên hệ
          </Link>

          {!isLoggedIn && (
            <>
              <Link to="/login">
                <button className="ml-4 bg-yellow-500 px-4 py-2 rounded-md font-medium text-sm hover:bg-yellow-600 transition duration-300">
                  Đăng nhập
                </button>
              </Link>
              <Link to="/signup">
                <button className="ml-2 border border-yellow-500 px-4 py-2 rounded-md font-medium text-sm hover:bg-yellow-600 transition duration-300">
                  Đăng ký
                </button>
              </Link>
            </>
          )}

          {isLoggedIn && (
            <div className="relative z-10">
              <button
                className="flex items-center space-x-2"
                onClick={toggleDropdown}
              >
                <FaUserCircle className="text-2xl" />
                <span className="text-sm">{fullName}</span>
              </button>
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-gray-700 text-white rounded-md shadow-lg">
                  <Link
                    to="/user/profile"
                    className="block px-4 py-2 hover:bg-gray-600"
                  >
                    Hồ sơ
                  </Link>
                  {isLoggedIn && role == 'ADMIN' && (
                    <Link
                      to="/admin/deshboard"
                      className="block px-4 py-2 hover:bg-gray-600"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {isLoggedIn && role === 'ADMIN' && (
                    <Link
                      to="/course/create"
                      className="block px-4 py-2 hover:bg-gray-600"
                    >
                      Tạo khóa học
                    </Link>
                  )}
                  {isLoggedIn && role === 'ADMIN' && (
                    <Link
                      to="/admin/course-progress"
                      className="block px-4 py-2 hover:bg-gray-600"
                    >
                      Kích hoạt khóa học
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 hover:bg-gray-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
