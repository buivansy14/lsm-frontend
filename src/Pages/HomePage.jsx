import { useTranslation } from 'react-i18next';
import { FaArrowRight, FaCode, FaLaptopCode } from 'react-icons/fa';
import { FiBookOpen, FiDownloadCloud, FiHeadphones, FiPlay, FiSmartphone, FiVideo } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import homeimg from '../Assets/Images/homePageMainImage.png';
import HomeLayout from '../Layouts/HomeLayout';

function HomePage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <FiVideo className="text-blue-400" size={24} />,
      title: 'Video bài giảng trực quan',
      desc: 'Nội dung bài học được biên soạn rõ ràng, dễ hiểu, theo dõi tiến độ học tập tiện lợi.',
      border: 'border-blue-500/20',
    },
    {
      icon: <FiDownloadCloud className="text-cyan-400" size={24} />,
      title: 'Kho chia sẻ công cụ & tiện ích',
      desc: 'Nơi chia sẻ và tải về các công cụ, mã nguồn và tài liệu hữu ích cho công việc của bạn.',
      border: 'border-cyan-500/20',
    },
    {
      icon: <FiSmartphone className="text-amber-400" size={24} />,
      title: 'Học tập mọi lúc mọi nơi',
      desc: 'Giao diện tối ưu hiển thị mượt mà trên cả máy tính, máy tính bảng và điện thoại di động.',
      border: 'border-amber-500/20',
    },
    {
      icon: <FiHeadphones className="text-emerald-400" size={24} />,
      title: 'Hỗ trợ giải đáp thắc mắc',
      desc: 'Kênh liên hệ và hỗ trợ trực tiếp khi gặp khó khăn trong quá trình học và sử dụng công cụ.',
      border: 'border-emerald-500/20',
    },
  ];

  return (
    <HomeLayout>
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 antialiased overflow-hidden">
        
        {/* Hero Section */}
        <section className="relative pt-10 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
          {/* Subtle Ambient Light */}
          <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
            
            {/* Left Column: Heading & CTAs */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <FiBookOpen size={13} /> Nền tảng học trực tuyến
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {t('home_title') || 'Tìm kiếm các khóa học'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">
                  {t('lbl_best') || 'Phù Hợp'}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                {t('home_description') ||
                  'Chúng tôi cung cấp các khóa học và tài nguyên hữu ích, giúp bạn dễ dàng tiếp cận kiến thức và kỹ năng thực tế.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/courses">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 group">
                    <span>{t('btn_courses') || 'Xem khóa học'}</span>
                    <FaArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </Link>

                <Link to="/contact">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-medium text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95">
                    <span>{t('btn_contact_us') || 'Liên hệ'}</span>
                  </button>
                </Link>
              </div>

            </div>

            {/* Right Column: Hero Image */}
            <div className="lg:w-1/2 flex items-center justify-center">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800/80 p-3 sm:p-4 shadow-xl backdrop-blur-sm">
                <img
                  src={homeimg}
                  alt="TechOnline LMS"
                  className="w-full max-w-md object-contain rounded-xl drop-shadow-xl"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
          <div className="text-center space-y-2 max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Tính năng & Dịch vụ
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Hệ thống được thiết kế đơn giản, thuận tiện cho việc học tập và tra cứu tài nguyên.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((item, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-xl bg-slate-900/70 border ${item.border} hover:border-slate-700 shadow-md transition-all duration-200 space-y-3`}
              >
                <div className="w-10 h-10 rounded-lg bg-slate-800/90 border border-slate-700/60 flex items-center justify-center">
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

        {/* Simple CTA Section */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-[#131b2e] border border-slate-800 p-8 space-y-4 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Bắt đầu học tập ngay hôm nay
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
              Xem danh sách các khóa học hiện có và tham gia lớp học trực tuyến cùng chúng tôi.
            </p>
            <div className="pt-2">
              <Link to="/courses">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-blue-600/25 hover:scale-105 active:scale-95">
                  <span>Khám phá danh sách khóa học</span>
                  <FaArrowRight size={12} />
                </button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </HomeLayout>
  );
}

export default HomePage;
