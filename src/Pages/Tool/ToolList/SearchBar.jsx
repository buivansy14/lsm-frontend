import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ onSearch }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce input (chờ 400ms sau khi ngừng gõ)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  // Tự động gọi search khi debouncedQuery thay đổi
  useEffect(() => {
    if (onSearch && debouncedQuery !== undefined) {
      onSearch(debouncedQuery.trim());
    }
  }, [debouncedQuery]);

  // Enter để search ngay
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(query.trim());
    }
  };

  return (
    <div className="flex items-center gap-3 w-full sm:w-80">
      <div className="relative w-full">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder={t('lbl_search_tools_resources') || 'Tìm kiếm công cụ...'}
          className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-md transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white bg-slate-800 transition-all"
          >
            <FiX size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
