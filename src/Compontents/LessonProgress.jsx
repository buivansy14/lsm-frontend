import { useTranslation } from 'react-i18next';

const LessonProgress = ({ completedLessons = 0, totalLessons = 0 }) => {
  const { t } = useTranslation();
  const validTotal = totalLessons > 0 ? totalLessons : 1;
  const progressPercentage = Math.min(
    100,
    Math.max(0, Math.round((completedLessons / validTotal) * 100))
  );

  return (
    <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/60 py-1.5 px-3 rounded-full shadow-inner">
      <div className="hidden sm:block text-xs font-medium text-slate-300">
        <span className="text-blue-400 font-semibold">{completedLessons}</span>
        <span className="text-slate-500"> / </span>
        <span>{totalLessons}</span> {t('lbl_lesson')}
      </div>
      <div className="w-20 sm:w-28 bg-slate-900 rounded-full h-2 overflow-hidden relative border border-slate-700/40">
        <div
          className="bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 h-full rounded-full transition-all duration-500 ease-out shadow-sm shadow-blue-500/50"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <span className="text-xs font-bold text-cyan-400 min-w-[34px] text-right font-mono">
        {progressPercentage}%
      </span>
    </div>
  );
};

export default LessonProgress;
