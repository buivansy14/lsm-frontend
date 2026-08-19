import { useTranslation } from 'react-i18next';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();
  if (totalPages < 1) return null;

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
    <div className="flex justify-center items-center gap-2 mt-12 mb-6 select-none">
      {/* Nút Trước */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
          currentPage === 1
            ? 'text-slate-600 border-slate-800/60 cursor-not-allowed bg-slate-900/40'
            : 'text-slate-300 border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <FiChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">{t('lbl_previous') || 'Trước'}</span>
      </button>

      {/* Các số trang */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={idx} className="px-2 text-slate-500 font-mono text-sm">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
              page === currentPage
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white'
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
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
          currentPage === totalPages
            ? 'text-slate-600 border-slate-800/60 cursor-not-allowed bg-slate-900/40'
            : 'text-slate-300 border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <span className="hidden sm:inline">{t('lbl_next') || 'Sau'}</span>
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
