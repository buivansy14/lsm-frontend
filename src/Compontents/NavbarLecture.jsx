import { FiArrowLeft, FiBookOpen } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import LessonProgress from './LessonProgress';

const NavbarLecture = ({ title, completedLessons, totalLessons }) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-800/80 z-50 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-lg shadow-black/30">
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all duration-200 shadow-sm shrink-0 group"
          title="Quay lại danh sách khóa học"
        >
          <FiArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <FiBookOpen size={14} />
          </div>
          <h1 className="text-sm sm:text-base md:text-lg font-bold text-white truncate max-w-[220px] sm:max-w-md md:max-w-xl">
            {title || 'Đang tải khóa học...'}
          </h1>
        </div>
      </div>

      <div className="flex items-center shrink-0 pl-3">
        <LessonProgress
          completedLessons={completedLessons || 0}
          totalLessons={totalLessons || 0}
        />
      </div>
    </header>
  );
};

export default NavbarLecture;
