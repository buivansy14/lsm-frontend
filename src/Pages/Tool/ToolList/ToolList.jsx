import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiDownload, FiInfo, FiTag } from 'react-icons/fi'; // icon nhẹ, hiện đại
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

  const fetchTools = async (name = '') => {
    try {
      const res = await axiosInstance.get('/marketplace', {
        params: { name }, // 👈 truyền query param name
      });
      setTools(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleSearch = (searchQuery) => {
    fetchTools(searchQuery);
  };

  useEffect(() => {
    fetchTools(); // tải tất cả ban đầu
  }, []);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'lbl_marketplace' }]} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          {/* Left section */}
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {t('lbl_resource_marketplace')}
            </h1>
            <p className="text-white mt-1 text-sm sm:text-base">
              {t('msg_discover_tools_resources')}
            </p>
          </div>

          {/* Right section (search or button) */}
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <div
              key={tool._id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Ảnh + Giá góc phải */}
              <div className="relative bg-gray-50 flex items-center justify-center aspect-[4/3] overflow-hidden border-b">
                <img
                  src={getImageUrl(tool.image)}
                  alt={tool.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                />
                {tool.price !== undefined && (
                  <span className="absolute top-2 right-2 flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm font-medium px-3.5 py-1.5 rounded-full shadow-md border border-yellow-300/70">
                    <FiTag className="w-4 h-4 opacity-90" />
                    {tool.price === 0
                      ? t('lbl_free')
                      : `${tool.price.toLocaleString()}₫`}
                  </span>
                )}
              </div>

              {/* Nội dung */}
              <div className="flex-1 flex flex-col p-4">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {tool.tagline}
                </p>

                {/* Tags */}
                <div className="mt-2 mb-1 flex flex-wrap gap-2">
                  {tool.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
                  <span className="text-xs text-gray-400">{tool.size}</span>
                  <div className="flex gap-2">
                    <Link
                      to={`/marketplace/${tool._id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:border-yellow-600 hover:text-yellow-700 transition-all"
                    >
                      <FiInfo className="w-4 h-4" />
                      {t('lbl_details')}
                    </Link>
                    <Link
                      to={`/marketplace/${tool._id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 transition-all"
                    >
                      <FiDownload className="w-4 h-4" />
                      {t('btn_download')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {tools.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <img
              src="https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127823.jpg?semt=ais_hybrid&w=740&q=80" // 👈 (có thể dùng ảnh minh họa rỗng)
              alt="No results"
              className="w-[500px] h-[300px] mx-auto mb-4 opacity-70"
            />
            <p className="text-sm text-gray-400 mt-1">
              {t('msg_no_tools_resources_found')}
            </p>
          </div>
        )}

        {tools.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </HomeLayout>
  );
}
