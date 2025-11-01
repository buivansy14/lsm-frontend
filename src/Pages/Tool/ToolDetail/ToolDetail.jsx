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
  FiShare2,
  FiTrendingDown,
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Breadcrumb from '../../../Compontents/Common/Breadcrumb';
import axiosInstance from '../../../Helpers/axiosinstance';
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
  }, [id]);

  const handleDownloadClick = () => {
    setShowPayment(true);
  };

  const handleConfirmPayment = () => {
    setShowPayment(false);
    // Mở link download
    window.open(tool.downloadUrl, '_blank');
  };

  return (
    <HomeLayout>
      <div className="min-h-[90vh] container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'lbl_marketplace', to: '/marketplace' },
            { label: tool?.name },
          ]}
        />
        {/* --- PHẦN TRÊN: Ảnh slider + thông tin --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Slider ảnh */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm border bg-gray-50">
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
                  <div className="flex items-center justify-center aspect-[4/3] bg-gray-50">
                    <img
                      src={
                        img ||
                        'https://thumbs.dreamstime.com/b/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available-236105299.jpg'
                      }
                      alt={`${tool?.name} ${index + 1}`}
                      className="object-contain max-h-[600px] w-auto transition-transform duration-300"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Thông tin chi tiết */}
          <div className="flex flex-col justify-center space-y-5">
            <div>
              <h1 className="text-3xl text-white font-semibold mb-2">
                {tool?.name}
              </h1>
              <p className="text-white text-sm">{tool?.tagline}</p>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {tool?.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-white/10 text-gray-200 border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-3 text-sm text-white">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FiBox className="w-4 h-4 text-yellow-400" />{' '}
                  {t('lbl_category')}
                </span>
                <span className="font-medium">{tool?.categoryId?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FiFile className="w-4 h-4 text-green-400" />{' '}
                  {t('lbl_file_type')}
                </span>
                <span>{tool?.typeFile}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FiTrendingDown className="w-4 h-4 text-blue-400" />{' '}
                  {t('lbl_file_size')}
                </span>
                <span>{tool?.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-pink-400" />{' '}
                  {t('lbl_updated')}
                </span>
                <span>
                  {moment(tool?.updatedAt).format('DD/MM/YYYY HH:mm')}
                </span>
              </div>
            </div>

            {/* 🟨 Thống kê hoạt động */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mt-6">
              <div className="flex flex-col items-center bg-gradient-to-b from-gray-800 to-gray-900 border border-yellow-500/30 rounded-2xl p-4">
                <FiEye className="w-5 h-5 text-yellow-400 mb-1" />
                <p className="text-gray-400 text-sm">{t('lbl_views')}</p>
                <p className="text-xl font-semibold text-white">
                  {tool?.views?.toLocaleString() || 0}
                </p>
              </div>

              <div className="flex flex-col items-center bg-gradient-to-b from-gray-800 to-gray-900 border border-yellow-500/30 rounded-2xl p-4">
                <FiDownload className="w-5 h-5 text-yellow-400 mb-1" />
                <p className="text-gray-400 text-sm">{t('lbl_downloads')}</p>
                <p className="text-xl font-semibold text-white">
                  {tool?.downloads?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* 💰 Cụm hành động tải xuống */}
            <div className="bg-gradient-to-br text-white rounded-2xl shadow-lg border border-yellow-300/40 p-5 space-y-5">
              {/* 1️⃣ Phí tải xuống */}
              <div className="flex flex-col items-center text-center">
                <span className="text-sm uppercase tracking-wider text-yellow-100">
                  {t('lbl_download_fee')}
                </span>
                <div className="mt-1 text-4xl font-extrabold drop-shadow-sm">
                  {tool?.price === 0 ? (
                    <span className="text-green-100">{t('lbl_free')}</span>
                  ) : (
                    <span>{tool?.price?.toLocaleString()}₫</span>
                  )}
                </div>
                {tool?.discount && (
                  <span className="mt-1 text-xs text-yellow-200 line-through opacity-80">
                    {tool.discount?.toLocaleString()}₫
                  </span>
                )}
              </div>

              {/* 2️⃣ Các nút hành động */}
              <div className="flex flex-col gap-3">
                {tool?.demoUrl && (
                  <a
                    href={tool.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <FiExternalLink className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium">
                      {t('lbl_view_demo')}
                    </span>
                  </a>
                )}

                {tool?.isPaid ? (
                  // ✅ Nếu user đã thanh toán
                  <a
                    href={tool.downloadUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition-all shadow-md bg-green-500 hover:bg-green-600 text-white"
                  >
                    <FiDownload className="w-5 h-5" />
                    {t('lbl_download_now')}
                  </a>
                ) : (
                  <button
                    onClick={handleDownloadClick}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition-all shadow-md bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <FiDownload className="w-5 h-5" />
                    {tool?.price === 0 ? 'Tải miễn phí' : t('lbl_download_now')}
                  </button>
                )}

                <button
                  onClick={() =>
                    navigator.share?.({
                      title: tool.name,
                      url: window.location.href,
                    })
                  }
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <FiShare2 className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium">{t('lbl_share')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 🧭 Tabs nội dung */}
        <ToolTabs tool={tool} />

        {showPayment && (
          <PaymentModal
            open={showPayment}
            onClose={() => setShowPayment(false)}
            tool={tool}
            onConfirm={handleConfirmPayment}
          />
        )}
      </div>
    </HomeLayout>
  );
}
