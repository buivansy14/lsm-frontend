import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBookOpen, FiCompass, FiGrid, FiSearch, FiSliders, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import CourseCard from '../../Compontents/CourseCard';
import HomeLayout from '../../Layouts/HomeLayout';
import { getAllCourse, getAllCourseUser } from '../../Redux/Slices/CourseSlice';

function CourseList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { courseData, inactiveCourses, activeCourses } = useSelector(
    (state) => state.course
  );
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'INACTIVE'

  async function loadCourses() {
    if (isLoggedIn) {
      await dispatch(getAllCourseUser());
    } else {
      await dispatch(getAllCourse());
    }
  }

  useEffect(() => {
    loadCourses();
  }, [isLoggedIn]);

  // Merge courses based on login state
  const rawList = useMemo(() => {
    if (isLoggedIn) {
      return [...(inactiveCourses || []), ...(activeCourses || [])];
    }
    return courseData || [];
  }, [isLoggedIn, inactiveCourses, activeCourses, courseData]);

  // Filter courses by search keyword & status filter
  const filteredCourses = useMemo(() => {
    return rawList.filter((course) => {
      // Status filter
      if (selectedFilter === 'ACTIVE' && !course.isActive) return false;
      if (selectedFilter === 'INACTIVE' && course.isActive) return false;

      // Search keyword
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const titleMatch = course.title?.toLowerCase().includes(term);
      const descMatch = course.description?.toLowerCase().includes(term);
      const categoryMatch = course.category?.toLowerCase().includes(term);
      return titleMatch || descMatch || categoryMatch;
    });
  }, [rawList, searchTerm, selectedFilter]);

  return (
    <HomeLayout>
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 antialiased pb-20">
        
        {/* Modern Hero Section */}
        <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-[#0b0f19]/80 to-[#0b0f19]">
          <div className="max-w-5xl mx-auto text-center space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <FiCompass size={14} /> Khám phá tri thức
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {t('course_list_title') || 'Danh Sách Khóa Học'}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
                Chất Lượng Cao
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Trang bị các kỹ năng công nghệ thực chiến từ chuyên gia, học mọi lúc mọi nơi với lộ trình bài bản.
            </p>

            {/* Search Box */}
            <div className="pt-4 max-w-xl mx-auto">
              <div className="relative flex items-center">
                <FiSearch className="absolute left-4 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm khóa học theo tên, công nghệ hoặc nội dung..."
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xl"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all"
                  >
                    <FiX size={14} />
                  </button>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Courses Main Grid Container */}
        <main className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          {/* Controls Bar: Filter Tabs & Course Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedFilter('ALL')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  selectedFilter === 'ALL'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                Tất cả ({rawList.length})
              </button>

              {isLoggedIn && (
                <>
                  <button
                    onClick={() => setSelectedFilter('ACTIVE')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                      selectedFilter === 'ACTIVE'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    Đã kích hoạt ({activeCourses?.length || 0})
                  </button>

                  <button
                    onClick={() => setSelectedFilter('INACTIVE')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                      selectedFilter === 'INACTIVE'
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    Chưa kích hoạt ({inactiveCourses?.length || 0})
                  </button>
                </>
              )}
            </div>

            {/* Results Count Badge */}
            <div className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 shrink-0">
              <FiGrid size={14} className="text-blue-400" />
              <span>
                Hiển thị <strong className="text-white">{filteredCourses.length}</strong> khóa học
              </span>
            </div>
          </div>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} data={course} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-900/40 border border-slate-800/60 rounded-3xl max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 shadow-inner">
                <FiBookOpen size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  {searchTerm
                    ? 'Không tìm thấy khóa học phù hợp'
                    : t('no_courses_available') || 'Hiện tại chưa có khóa học nào!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                  {searchTerm
                    ? `Không có kết quả nào khớp với từ khóa "${searchTerm}". Vui lòng thử tìm kiếm bằng từ khóa khác.`
                    : 'Các khóa học mới sẽ được cập nhật sớm nhất.'}
                </p>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 text-xs sm:text-sm font-medium transition-all"
                >
                  Xóa bộ lọc tìm kiếm
                </button>
              )}
            </div>
          )}

        </main>
      </div>
    </HomeLayout>
  );
}

export default CourseList;
