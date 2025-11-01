import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiFileText, FiMessageSquare, FiStar, FiTool } from 'react-icons/fi';

export default function ToolTabs({ tool }) {
  const [activeTab, setActiveTab] = useState('desc');
  const { t } = useTranslation();

  const tabs = [
    { id: 'desc', label: t('lbl_detailed_description'), icon: <FiFileText /> },
    { id: 'install', label: t('lbl_installation_guide'), icon: <FiTool /> },
    {
      id: 'comment',
      label: `${t('lbl_comments')} (0)`,
      icon: <FiMessageSquare />,
    },
    { id: 'review', label: `${t('lbl_reviews')} (0)`, icon: <FiStar /> },
  ];

  return (
    <div className="mt-10 mb-5 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 🟨 Tabs header */}
      <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50/80 scrollbar-thin scroll-smooth">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm md:text-base font-semibold tracking-wide transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-yellow-700 border-b-2 border-yellow-600 bg-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/70'
            }`}
          >
            <span className="text-lg sm:text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 🟩 Tabs content */}
      <div className="p-4 sm:p-6 text-gray-700 min-h-[200px] animate-fadeIn text-sm sm:text-base leading-relaxed">
        {activeTab === 'desc' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800">
              {t('lbl_detailed_introduction')}
            </h2>
            <div
                dangerouslySetInnerHTML={{
                  __html: tool?.description,
                }}
              />
          </div>
        )}

        {activeTab === 'install' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800">
              {t('lbl_installation_guide')}
            </h2>
            {tool?.installationGuide ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: tool.installationGuide,
                }}
              />
            ) : (
              <p className="text-gray-500 italic">
                {t('lbl_no_installation_guide')}
              </p>
            )}
          </div>
        )}

        {activeTab === 'comment' && (
          <div className="text-gray-500 italic">
            {t('lbl_comment_feature_in_dev')}
          </div>
        )}

        {activeTab === 'review' && (
          <div className="text-gray-500 italic">
            {t('lbl_comment_feature_in_dev')}
          </div>
        )}
      </div>
    </div>
  );
}
