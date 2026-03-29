import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import PaymentModal from '../Compontents/PaymentModal';
import axiosInstance from '../Helpers/axiosinstance';
import HomeLayout from '../Layouts/HomeLayout';
import { removeDashes } from '../Utils';

const LandingPage = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [courseInfo, setCourseInfo] = useState();
  const { courseId } = useParams();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    getInfoDetail(courseId);
  }, [courseId]);

  const getInfoDetail = async (courseId) => {
    try {
      const response = await axiosInstance.get(
        `/course/getInfoLectures/${removeDashes(courseId)}`,
      );
      setCourseInfo(response?.data);
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const handleOrder = async (event) => {
    event.preventDefault();
    if (!isLoggedIn) return navigate('/login');

    try {
      const response = await axiosInstance.post('/transaction/create-qr', {
        message: 'QR',
        courseId: removeDashes(courseId),
      });
      if (response?.data) {
        const { qrUrl, transactionId, amount } = response.data;
        setIsLoading(false);
        navigate('/payment', {
          state: { qrUrl, transactionId, courseId, amount },
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <HomeLayout>
      <div className="bg-gray-100 font-sans">
        {/* Hero Section */}
        <header className="bg-blue-600 text-white text-center py-16">
          <h1 className="text-4xl font-bold">
            {courseInfo?.title || 'Khóa học của bạn'}
          </h1>
          <p className="mt-4 text-lg">
            {courseInfo?.description ||
              'Khám phá khóa học, học tập và thực hành ngay hôm nay!'}
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="mt-8 px-6 py-3 bg-yellow-500 text-white font-semibold rounded shadow hover:bg-yellow-400 transition"
          >
            Đăng ký ngay
          </button>
        </header>

        {/* About Section */}
        <section className="py-16 px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-600">
              {courseInfo?.title
                ? `Giới thiệu ${courseInfo.title}`
                : 'Giới thiệu khóa học'}
            </h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              {courseInfo?.description ||
                'Thông tin chi tiết về khóa học sẽ có ở đây.'}
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-blue-700 mb-2">
                Kiến thức từ cơ bản đến nâng cao
              </h3>
              <p className="text-gray-600">Phù hợp với mọi cấp độ học viên.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-blue-700 mb-2">
                Học qua dự án thực tế
              </h3>
              <p className="text-gray-600">
                Xây dựng các ứng dụng tự động hóa thực tế.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-blue-700 mb-2">
                Hỗ trợ 1:1
              </h3>
              <p className="text-gray-600">
                Tương tác trực tiếp với giảng viên.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-blue-700 mb-2">
                Học online
              </h3>
              <p className="text-gray-600">Học mọi lúc, mọi nơi.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-blue-700 mb-2">
                Ứng dụng ngay lập tức
              </h3>
              <p className="text-gray-600">
                Áp dụng kiến thức vào dự án thực tế.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-blue-700 mb-2">
                Cập nhật kiến thức liên tục
              </h3>
              <p className="text-gray-600">
                Luôn được cập nhật với công nghệ mới nhất.
              </p>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section className="py-16 px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-600 text-center">
              Chương trình học
            </h2>
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseInfo?.lectures
                ?.sort((a, b) => a.orderDisplay - b.orderDisplay)
                .map((course, index) => (
                  <li className="bg-gray-100 p-6 rounded shadow" key={index}>
                    <p className="text-lg font-semibold text-gray-700">
                      {course?.title}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </section>

        {isOpen && (
          <PaymentModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            isLoading={isLoading}
            onSubmit={handleOrder}
            info={courseInfo}
          />
        )}
      </div>
    </HomeLayout>
  );
};

export default LandingPage;
