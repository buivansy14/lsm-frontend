import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ onSearch }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // ⏳ Debounce input (chờ 500ms sau khi ngừng gõ)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // 🔍 Tự động gọi search khi debouncedQuery thay đổi
  useEffect(() => {
    if (onSearch && debouncedQuery !== undefined) {
      onSearch(debouncedQuery.trim());
    }
  }, [debouncedQuery]);

  // ⏎ Enter để search ngay
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(query.trim());
    }
  };

  return (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      {/* Ô nhập */}
      <div className="relative w-full sm:w-64">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder={t('lbl_search_tools_resources')}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-yellow-600 focus:border-yellow-500 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
