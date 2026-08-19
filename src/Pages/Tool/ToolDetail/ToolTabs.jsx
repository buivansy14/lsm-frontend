import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiFileText, FiMessageSquare, FiStar, FiTool } from 'react-icons/fi';

export default function ToolTabs({ tool }) {
  const [activeTab, setActiveTab] = useState('desc');
  const { t } = useTranslation();

  const tabs = [
    { id: 'desc', label: t('lbl_detailed_description') || 'Mô tả chi tiết', icon: <FiFileText /> },
    { id: 'install', label: t('lbl_installation_guide') || 'Hướng dẫn cài đặt', icon: <FiTool /> },
    {
      id: 'comment',
      label: `${t('lbl_comments') || 'Bình luận'} (0)`,
      icon: <FiMessageSquare />,
    },
    { id: 'review', label: `${t('lbl_reviews') || 'Đánh giá'} (0)`, icon: <FiStar /> },
  ];

  return (
    <div className="mt-12 mb-8 bg-[#131b2e]/80 rounded-2xl shadow-xl border border-slate-800/80 overflow-hidden backdrop-blur-md">
      {/* Tabs header */}
      <div className="flex overflow-x-auto border-b border-slate-800 bg-[#0b0f19]/80 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'text-blue-400 border-blue-500 bg-[#131b2e]/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850'
            }`}
          >
            <span className="text-base sm:text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tabs content */}
      <div className="p-6 sm:p-8 text-slate-300 min-h-[220px] text-sm sm:text-base leading-relaxed">
        {activeTab === 'desc' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FiFileText className="text-blue-400" />
              <span>{t('lbl_detailed_introduction') || 'Giới thiệu chi tiết'}</span>
            </h2>
            <div
              className="prose prose-invert max-w-none text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: tool?.description || '<p>Chưa có mô tả chi tiết cho công cụ này.</p>',
              }}
            />
          </div>
        )}

        {activeTab === 'install' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FiTool className="text-amber-400" />
              <span>{t('lbl_installation_guide') || 'Hướng dẫn cài đặt'}</span>
            </h2>
            {tool?.installationGuide ? (
              <div
                className="prose prose-invert max-w-none text-slate-300 leading-relaxed bg-[#0b0f19]/50 p-5 rounded-xl border border-slate-800/60"
                dangerouslySetInnerHTML={{
                  __html: tool.installationGuide,
                }}
              />
            ) : (
              <p className="text-slate-500 italic">
                {t('lbl_no_installation_guide') || 'Chưa có hướng dẫn cài đặt.'}
              </p>
            )}
          </div>
        )}

        {activeTab === 'comment' && (
          <div className="text-slate-500 italic text-center py-8 bg-[#0b0f19]/30 rounded-xl border border-slate-800/40">
            {t('lbl_comment_feature_in_dev') || 'Tính năng bình luận đang được phát triển.'}
          </div>
        )}

        {activeTab === 'review' && (
          <div className="text-slate-500 italic text-center py-8 bg-[#0b0f19]/30 rounded-xl border border-slate-800/40">
            {t('lbl_comment_feature_in_dev') || 'Tính năng đánh giá đang được phát triển.'}
          </div>
        )}
      </div>
    </div>
  );
}
