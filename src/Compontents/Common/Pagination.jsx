import { useTranslation } from 'react-i18next';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();
  if (totalPages < 1) return null;

  // Tạo danh sách trang hiển thị (ẩn bớt bằng "...")
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) end = maxVisible;
      if (currentPage >= totalPages - 2) start = totalPages - (maxVisible - 1);

      for (let i = start; i <= end; i++) pages.push(i);
      if (start > 1) pages.unshift('...');
      if (end < totalPages) pages.push('...');
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 mt-10 mb-5 select-none">
      {/* Nút Trước */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-all 
          ${
            currentPage === 1
              ? 'text-gray-400 border-gray-200 cursor-not-allowed'
              : 'text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-indigo-600'
          }`}
      >
        <FiChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">{t('lbl_previous')}</span>
      </button>

      {/* Các số trang */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={idx} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-medium transition-all 
              ${
                page === currentPage
                  ? 'bg-yellow-600 text-white border-yellow-600 shadow-sm'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
              }`}
          >
            {page}
          </button>
        )
      )}

      {/* Nút Sau */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-all 
          ${
            currentPage === totalPages
              ? 'text-gray-400 border-gray-200 cursor-not-allowed'
              : 'text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-indigo-600'
          }`}
      >
        <span className="hidden sm:inline">{t('lbl_next')}</span>
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
