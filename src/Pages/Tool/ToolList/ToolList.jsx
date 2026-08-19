import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiDownload, FiFolder, FiHardDrive, FiInfo, FiLayers, FiTag } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import Breadcrumb from '../../../Compontents/Common/Breadcrumb';
import Pagination from '../../../Compontents/Common/Pagination';
import axiosInstance from '../../../Helpers/axiosinstance';
import { getImageUrl } from '../../../Helpers/imageHelper';
import HomeLayout from '../../../Layouts/HomeLayout';
import SearchBar from './SearchBar';

export default function ToolList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tools, setTools] = useState([]);
  const { t } = useTranslation();

  const fetchTools = async (name = '', page = 1) => {
    try {
      const res = await axiosInstance.get('/marketplace', {
        params: { name, page },
      });
      setTools(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleSearch = (searchQuery) => {
    fetchTools(searchQuery, 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTools('', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchTools();
  }, []);

  return (
    <HomeLayout>
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 antialiased pb-20">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'lbl_marketplace' }]} />

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2 pb-8 mb-8 border-b border-slate-800/80">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <FiLayers size={13} /> Kho Tiện Ích & Tài Nguyên
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {t('lbl_resource_marketplace') || 'Kho Chia Sẻ Công Cụ'}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
                {t('msg_discover_tools_resources') || 'Khám phá và tải về các công cụ, mã nguồn và tiện ích hữu ích cho công việc của bạn.'}
              </p>
            </div>

            {/* SearchBar */}
            <div className="shrink-0">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Tool Cards Grid */}
          {tools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {tools.map((tool) => (
                <div
                  key={tool._id}
                  className="group flex flex-col h-full bg-slate-900/90 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Image Container with Price Badge */}
                  <div className="relative aspect-[16/10] w-full bg-slate-950 flex items-center justify-center p-3 overflow-hidden border-b border-slate-800/80">
                    <img
                      src={getImageUrl(tool.image)}
                      alt={tool.name}
                      className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Price Badge */}
                    {tool.price !== undefined && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/90 text-amber-400 border border-amber-500/40 text-xs font-bold font-mono shadow-md backdrop-blur-md">
                        <FiTag className="w-3.5 h-3.5 text-amber-400" />
                        {tool.price === 0
                          ? t('lbl_free') || 'Miễn phí'
                          : `${tool.price.toLocaleString('vi-VN')}₫`}
                      </span>
                    )}
                  </div>

                  {/* Card Content Body */}
                  <div className="flex-1 flex flex-col p-5 justify-between space-y-4">
                    <div className="space-y-2 text-start">
                      <Link
                        to={`/marketplace/${tool._id}`}
                        className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 line-clamp-1 transition-colors leading-snug"
                        title={tool.name}
                      >
                        {tool.name}
                      </Link>
                      
                      <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed" title={tool.tagline}>
                        {tool.tagline || 'Công cụ hỗ trợ công việc tiện lợi và nhanh chóng.'}
                      </p>

                      {/* Tags */}
                      {tool.tags && tool.tags.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {tool.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700/60 font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                        <FiHardDrive size={13} className="text-slate-500" />
                        <span>{tool.size || 'N/A'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/marketplace/${tool._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 text-xs font-medium transition-all"
                        >
                          <FiInfo className="w-3.5 h-3.5" />
                          <span>{t('lbl_details') || 'Chi tiết'}</span>
                        </Link>
                        
                        <Link
                          to={`/marketplace/${tool._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
                        >
                          <FiDownload className="w-3.5 h-3.5" />
                          <span>{t('btn_download') || 'Tải'}</span>
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-900/40 border border-slate-800/60 rounded-3xl max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 shadow-inner">
                <FiFolder size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  {t('msg_no_tools_resources_found') || 'Không tìm thấy công cụ phù hợp'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                  Hiện tại chưa có công cụ hoặc tiện ích nào khớp với tìm kiếm của bạn.
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {tools.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

        </div>
      </div>
    </HomeLayout>
  );
}
