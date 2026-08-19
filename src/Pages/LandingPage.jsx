import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowRight, FaCheckCircle, FaLaptopCode, FaLock, FaPlay } from 'react-icons/fa';
import { FiBookOpen, FiClock, FiFileText, FiHeadphones, FiLayers, FiLock, FiPlayCircle, FiShield, FiTag, FiVideo } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumb from '../Compontents/Common/Breadcrumb';
import PaymentModal from '../Compontents/PaymentModal';
import axiosInstance from '../Helpers/axiosinstance';
import HomeLayout from '../Layouts/HomeLayout';
import { convertSecondsToDuration, removeDashes } from '../Utils';

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
        `/course/getInfoLectures/${removeDashes(courseId)}`
      );
      setCourseInfo(response?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể tải thông tin khóa học');
    }
  };

  const handleOrder = async (event) => {
    event.preventDefault();
    if (!isLoggedIn) return navigate('/login');

    setIsLoading(true);
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
      setIsLoading(false);
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo giao dịch');
    }
  };

  const features = [
    {
      icon: <FiVideo className="text-blue-400" size={22} />,
      title: 'Video bài giảng trực quan',
      desc: 'Nội dung chi tiết, hướng dẫn từng bước rõ ràng dễ tiếp thu.',
    },
    {
      icon: <FaLaptopCode className="text-cyan-400" size={22} />,
      title: 'Thực hành qua bài tập',
      desc: 'Áp dụng trực tiếp kiến thức vào các tình huống công việc thực tế.',
    },
    {
      icon: <FiClock className="text-amber-400" size={22} />,
      title: 'Học tập linh hoạt',
      desc: 'Tự do theo dõi bài học theo thời gian rảnh trên mọi thiết bị.',
    },
    {
      icon: <FiHeadphones className="text-emerald-400" size={22} />,
      title: 'Hỗ trợ giải đáp',
      desc: 'Được hỗ trợ và giải đáp thắc mắc trong suốt quá trình học tập.',
    },
  ];

  return (
    <HomeLayout>
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 antialiased pb-20">
        
        {/* Course Hero Banner */}
        <section className="relative pt-6 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/80 via-[#0b0f19]/90 to-[#0b0f19]">
          <div className="max-w-[1500px] mx-auto">
            <Breadcrumb
              items={[
                { label: 'lbl_course', to: '/courses' },
                { label: courseInfo?.title || 'Giới thiệu khóa học' },
              ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-4">
              
              {/* Left Column: Title, Description & Action */}
              <div className="lg:col-span-8 space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                  <FiBookOpen size={13} /> Giới Thiệu Khóa Học
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {courseInfo?.title || 'Khóa học chất lượng cao'}
                </h1>

                <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
                  {courseInfo?.description ||
                    'Khám phá khóa học, học tập và thực hành để nâng cao kỹ năng chuyên môn.'}
                </p>

                {/* Key Metadata Badges */}
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 pt-2">
                  <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
                    <FiLayers className="text-blue-400" size={15} />
                    <span>{courseInfo?.lectures?.length || 0} bài học</span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
                    <FiClock className="text-amber-400" size={15} />
                    <span>Học mọi lúc mọi nơi</span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
                    <FiShield className="text-emerald-400" size={15} />
                    <span>Hỗ trợ trực tiếp</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Pricing & Enrollment Card */}
              <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-5 backdrop-blur-md">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Học phí khóa học
                  </span>
                  
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-amber-400 font-mono">
                      {courseInfo?.price && courseInfo.price > 0
                        ? `${courseInfo.price.toLocaleString('vi-VN')}₫`
                        : 'Miễn phí'}
                    </span>
                    
                    {courseInfo?.oldPrice && courseInfo.oldPrice > (courseInfo?.price || 0) && (
                      <span className="text-sm text-slate-500 line-through font-mono">
                        {courseInfo.oldPrice.toLocaleString('vi-VN')}₫
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>Đăng ký tham gia ngay</span>
                    <FaArrowRight size={13} />
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-400 shrink-0" size={13} />
                    <span>Truy cập toàn bộ danh sách bài giảng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-400 shrink-0" size={13} />
                    <span>Xem video chất lượng cao HD</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
          
          {/* Features Highlights */}
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <FiShield className="text-blue-400" /> Điểm nổi bật của khóa học
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md space-y-2.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Curriculum / Syllabus Section */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <FiPlayCircle className="text-amber-400" /> Chương trình học chi tiết
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Khóa học bao gồm {courseInfo?.lectures?.length || 0} bài học theo lộ trình
                </p>
              </div>
            </div>

            {courseInfo?.lectures && courseInfo.lectures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseInfo.lectures
                  .slice()
                  .sort((a, b) => (a.orderDisplay || 0) - (b.orderDisplay || 0))
                  .map((lecture, index) => {
                    const lessonIndex = index + 1 < 10 ? `0${index + 1}` : index + 1;
                    return (
                      <div
                        key={lecture._id || index}
                        className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all shadow-sm"
                      >
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-400 shrink-0 mt-0.5">
                          {lessonIndex}
                        </span>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-200 line-clamp-2 leading-snug" title={lecture?.title}>
                            {lecture?.title || 'Bài học'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-sm">
                Danh sách bài giảng đang được cập nhật.
              </div>
            )}
          </section>

          {/* Bottom Call to Action */}
          <section className="rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-500/30 p-8 sm:p-10 text-center space-y-4 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Sẵn sàng bắt đầu học bài ngay?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Nhấn nút bên dưới để tiến hành thanh toán và kích hoạt khóa học tự động vào tài khoản của bạn.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95"
              >
                <span>Đăng ký khóa học ngay</span>
                <FaArrowRight size={13} />
              </button>
            </div>
          </section>

        </main>

        {/* Modal Thanh toán */}
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
