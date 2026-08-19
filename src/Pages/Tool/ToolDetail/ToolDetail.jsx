import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiBox,
  FiClock,
  FiDownload,
  FiExternalLink,
  FiEye,
  FiFile,
  FiHardDrive,
  FiLayers,
  FiShare2,
  FiTag,
  FiTrendingDown,
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Breadcrumb from '../../../Compontents/Common/Breadcrumb';
import axiosInstance from '../../../Helpers/axiosinstance';
import { getImageUrl } from '../../../Helpers/imageHelper';
import HomeLayout from '../../../Layouts/HomeLayout';
import PaymentModal from './PaymentModal';
import ToolTabs from './ToolTabs';

export default function ToolDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tool, setTool] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  useEffect(() => {
    if (id) {
      const fetchTool = async () => {
        try {
          const API_DETAIL = !isLoggedIn
            ? `/marketplace/detail/${id}`
            : `/marketplace/detail/${id}/for-user`;
          const res = await axiosInstance.get(API_DETAIL);
          const tool = res.data.data;
          setTool(tool);
        } catch (error) {
          console.error('Lỗi khi tải tool:', error);
        }
      };
      fetchTool();
    }
  }, [id, isLoggedIn]);

  const handleDownloadClick = () => {
    setShowPayment(true);
  };

  const handleConfirmPayment = () => {
    setShowPayment(false);
    window.open(tool?.downloadUrl, '_blank');
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 antialiased pb-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'lbl_marketplace', to: '/marketplace' },
              { label: tool?.name || 'Chi tiết công cụ' },
            ]}
          />

          {/* Main Top Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-4 items-start">
            
            {/* Image Slider Column (7 cols) */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={20}
                  slidesPerView={1}
                  className="rounded-2xl"
                >
                  {(tool?.images && tool?.images.length > 0
                    ? tool.images
                    : [tool?.image]
                  ).map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="flex items-center justify-center aspect-[16/10] bg-slate-950 p-4 sm:p-6">
                        <img
                          src={
                            getImageUrl(img) ||
                            'https://thumbs.dreamstime.com/b/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available-236105299.jpg'
                          }
                          alt={`${tool?.name} ${index + 1}`}
                          className="object-contain max-h-[480px] w-auto transition-transform duration-300"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* Tool Metadata & Action Card Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col space-y-5">
              
              {/* Header Title */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                  <FiLayers size={13} /> {tool?.categoryId?.name || 'Công cụ & Tiện ích'}
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  {tool?.name || 'Đang tải...'}
                </h1>
                
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {tool?.tagline || 'Công cụ hỗ trợ công việc tiện lợi và nhanh chóng.'}
                </p>

                {/* Tags */}
                {tool?.tags && tool.tags.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 text-xs rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Attributes Specs Card */}
              <div className="bg-[#131b2e]/80 rounded-2xl p-5 border border-slate-800/80 space-y-3 text-xs sm:text-sm shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-2 text-slate-400">
                    <FiBox className="w-4 h-4 text-amber-400" />
                    {t('lbl_category') || 'Danh mục'}
                  </span>
                  <span className="font-semibold text-white">{tool?.categoryId?.name || '—'}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-2 text-slate-400">
                    <FiFile className="w-4 h-4 text-emerald-400" />
                    {t('lbl_file_type') || 'Loại file'}
                  </span>
                  <span className="font-mono text-slate-200 uppercase">{tool?.typeFile || '—'}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-2 text-slate-400">
                    <FiHardDrive className="w-4 h-4 text-blue-400" />
                    {t('lbl_file_size') || 'Kích thước'}
                  </span>
                  <span className="font-mono text-slate-200">{tool?.size || '—'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400">
                    <FiClock className="w-4 h-4 text-purple-400" />
                    {t('lbl_updated') || 'Cập nhật'}
                  </span>
                  <span className="text-slate-300 font-mono">
                    {moment(tool?.updatedAt).format('DD/MM/YYYY')}
                  </span>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center bg-[#131b2e]/80 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
                  <FiEye className="w-4 h-4 text-blue-400 mb-1" />
                  <p className="text-slate-400 text-xs">{t('lbl_views') || 'Lượt xem'}</p>
                  <p className="text-base sm:text-lg font-bold text-white font-mono">
                    {tool?.views?.toLocaleString('vi-VN') || 0}
                  </p>
                </div>

                <div className="flex flex-col items-center bg-[#131b2e]/80 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
                  <FiDownload className="w-4 h-4 text-emerald-400 mb-1" />
                  <p className="text-slate-400 text-xs">{t('lbl_downloads') || 'Lượt tải'}</p>
                  <p className="text-base sm:text-lg font-bold text-white font-mono">
                    {tool?.downloads?.toLocaleString('vi-VN') || 0}
                  </p>
                </div>
              </div>

              {/* Purchase / Download Action Card */}
              <div className="bg-gradient-to-br from-slate-900 via-[#131b2e] to-slate-900 rounded-2xl shadow-xl border border-blue-500/30 p-5 space-y-4">
                {/* Price Display */}
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    {t('lbl_download_fee') || 'Phí tải xuống'}
                  </span>
                  
                  <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">
                    {tool?.price === 0 ? (
                      <span className="text-emerald-400">{t('lbl_free') || 'Miễn phí'}</span>
                    ) : (
                      <span>{tool?.price?.toLocaleString('vi-VN')}₫</span>
                    )}
                  </div>

                  {tool?.discount && tool.discount > 0 && (
                    <span className="mt-0.5 text-xs text-slate-500 line-through font-mono">
                      {tool.discount.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2.5 pt-1">
                  {tool?.demoUrl && (
                    <a
                      href={tool.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-xs sm:text-sm font-medium"
                    >
                      <FiExternalLink className="w-4 h-4 text-blue-400" />
                      <span>{t('lbl_view_demo') || 'Xem demo'}</span>
                    </a>
                  )}

                  {tool?.isPaid ? (
                    <a
                      href={tool.downloadUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold transition-all shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm"
                    >
                      <FiDownload className="w-4 h-4" />
                      <span>{t('lbl_download_now') || 'Tải xuống ngay'}</span>
                    </a>
                  ) : (
                    <button
                      onClick={handleDownloadClick}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white text-sm hover:scale-[1.02] active:scale-98"
                    >
                      <FiDownload className="w-4 h-4" />
                      <span>{tool?.price === 0 ? 'Tải miễn phí' : t('lbl_download_now') || 'Tải xuống ngay'}</span>
                    </button>
                  )}

                  <button
                    onClick={() =>
                      navigator.share?.({
                        title: tool?.name,
                        url: window.location.href,
                      })
                    }
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80 transition-all text-xs"
                  >
                    <FiShare2 className="w-3.5 h-3.5" />
                    <span>{t('lbl_share') || 'Chia sẻ'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Content Tabs (Description & Installation) */}
          <ToolTabs tool={tool} />

          {/* Payment Modal */}
          {showPayment && (
            <PaymentModal
              open={showPayment}
              onClose={() => setShowPayment(false)}
              tool={tool}
              onConfirm={handleConfirmPayment}
            />
          )}

        </div>
      </div>
    </HomeLayout>
  );
}
