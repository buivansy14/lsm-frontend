import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FiClock, FiGlobe, FiHeadphones, FiMail, FiMessageSquare, FiSend, FiUser } from 'react-icons/fi';

import axiosInstance from '../Helpers/axiosinstance';
import { isEmail } from '../Helpers/regexMatcher';
import HomeLayout from '../Layouts/HomeLayout';

function Contact() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    name: '',
    email: '',
    message: '',
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!userInput.email || !userInput.name || !userInput.message) {
      toast.error('Vui lòng điền đầy đủ các thông tin');
      return;
    }
    if (!isEmail(userInput.email)) {
      toast.error('Địa chỉ email không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/contact', userInput);
      if (response?.data?.success) {
        toast.success('Gửi tin nhắn liên hệ thành công!');
        setUserInput({
          name: '',
          email: '',
          message: '',
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể gửi tin nhắn, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <HomeLayout>
      <div className="min-h-[85vh] bg-[#0b0f19] text-slate-100 antialiased py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl w-full mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Contact Information */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <FiHeadphones size={13} /> {t('lbl_contact') || 'Liên Hệ & Hỗ Trợ'}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Chúng tôi luôn sẵn sàng lắng nghe bạn
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Mọi thắc mắc về khóa học, kích hoạt tài khoản hoặc đề xuất hợp tác, xin vui lòng gửi tin nhắn hoặc liên hệ trực tiếp với chúng tôi.
              </p>

              <div className="space-y-4 pt-2 text-start">
                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <FiMail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Email liên hệ</p>
                    <a href="mailto:sybuivan1429@gmail.com" className="text-sm font-semibold text-white font-mono hover:text-blue-400 transition-colors">
                      sybuivan1429@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <FiGlobe size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Nền tảng trực tuyến</p>
                    <p className="text-sm font-semibold text-white">techonline.edu.vn</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <FiClock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Thời gian phản hồi</p>
                    <p className="text-sm font-semibold text-white">Trong vòng 24 giờ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <form
                noValidate
                onSubmit={onFormSubmit}
                className="bg-[#131b2e]/90 border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-md space-y-5 text-start"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Gửi tin nhắn cho chúng tôi
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Điền biểu mẫu bên dưới và chúng tôi sẽ phản hồi sớm nhất
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {t('lbl_full_name') || 'Họ và tên'}
                    </label>
                    <div className="relative flex items-center">
                      <FiUser className="absolute left-4 text-slate-500" size={16} />
                      <input
                        className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Nguyễn Văn A"
                        onChange={handleInputChange}
                        value={userInput.name}
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Email
                    </label>
                    <div className="relative flex items-center">
                      <FiMail className="absolute left-4 text-slate-500" size={16} />
                      <input
                        className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="name@example.com"
                        onChange={handleInputChange}
                        value={userInput.email}
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Nội dung tin nhắn
                    </label>
                    <div className="relative">
                      <textarea
                        className="w-full p-4 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none h-32"
                        name="message"
                        id="message"
                        placeholder="Nhập nội dung cần hỗ trợ hoặc tư vấn..."
                        onChange={handleInputChange}
                        value={userInput.message}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-99 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Đang gửi tin nhắn...</span>
                    ) : (
                      <>
                        <FiSend size={15} />
                        <span>Gửi Tin Nhắn</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Contact;
