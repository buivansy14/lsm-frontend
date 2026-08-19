import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaLock, FaPlay } from 'react-icons/fa';
import { FiBookOpen, FiClock, FiEye, FiLayers, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { getImageUrl } from '../Helpers/imageHelper';
import { convertSecondsToDuration, insertDashEveryTwoChars } from '../Utils';

function CourseCard({ data }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lectureId = data?.lectures?.[0]?._id;

  const onCardClick = () => {
    if (data?.isActive) {
      navigate(`/course/${data._id}/lectures/${lectureId}`);
    } else {
      navigate(`/gioi-thieu-khoa-hoc/${insertDashEveryTwoChars(data?._id)}`);
    }
  };

  const onLearnClick = (e) => {
    e.stopPropagation();
    if (!data?.isActive) return;
    navigate(`/course/${data._id}/lectures/${lectureId}`);
  };

  const onDetailClick = (e) => {
    e.stopPropagation();
    navigate(`/gioi-thieu-khoa-hoc/${insertDashEveryTwoChars(data?._id)}`);
  };

  return (
    <div
      onClick={onCardClick}
      className="group relative flex flex-col h-full bg-slate-900/90 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      {/* Thumbnail Box */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            data?.isActive ? '' : 'brightness-75'
          }`}
          src={getImageUrl(data?.thumbnail?.secure_url) || '/placeholder-course.jpg'}
          alt={data?.title || 'Course thumbnail'}
          loading="lazy"
        />

        {/* Gradient Overlay on Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          {data?.isActive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-semibold tracking-wide backdrop-blur-md shadow-md">
              <FaCheckCircle size={11} /> Đã kích hoạt
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[11px] font-semibold tracking-wide backdrop-blur-md shadow-md">
              <FaLock size={10} /> Chưa kích hoạt
            </span>
          )}
        </div>

        {/* Category Pill */}
        {data?.category && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 text-blue-300 border border-slate-700/60 text-[11px] font-medium backdrop-blur-md">
              <FiLayers size={11} /> {data.category}
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2 text-start">
          <h2
            className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 line-clamp-2 transition-colors duration-200 leading-snug"
            title={data?.title}
          >
            {data?.title}
          </h2>

          <p
            className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed"
            title={data?.description}
          >
            {data?.description || 'Khám phá kiến thức bổ ích từ khóa học này.'}
          </p>
        </div>

        {/* Meta Info Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
          {data?.numberOfLectures ? (
            <div className="flex items-center gap-1.5">
              <FiBookOpen size={13} className="text-blue-400" />
              <span>{data.numberOfLectures} bài học</span>
            </div>
          ) : null}

          {data?.totalDuration ? (
            <div className="flex items-center gap-1.5">
              <FiClock size={13} className="text-amber-400" />
              <span>{convertSecondsToDuration(data.totalDuration)}</span>
            </div>
          ) : null}

          {data?.totalStudents ? (
            <div className="flex items-center gap-1.5">
              <FiUsers size={13} className="text-indigo-400" />
              <span>{data.totalStudents} học viên</span>
            </div>
          ) : null}
        </div>

        {/* Card Footer: Pricing & Action Button */}
        <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-3">
          {/* Price */}
          <div className="flex flex-col text-start">
            {data?.oldPrice && data.oldPrice > (data?.price || 0) && (
              <span className="text-xs text-slate-500 line-through font-mono">
                {data.oldPrice.toLocaleString('vi-VN')}₫
              </span>
            )}
            <span className="text-base sm:text-lg font-bold text-amber-400 font-mono leading-none">
              {data?.price && data.price > 0
                ? `${data.price.toLocaleString('vi-VN')}₫`
                : 'Miễn phí'}
            </span>
          </div>

          {/* Action CTA Button */}
          {data?.isActive ? (
            <button
              onClick={onLearnClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md shadow-blue-600/30 hover:scale-105 active:scale-95 shrink-0"
            >
              <FaPlay size={10} />
              <span>{t('lbl_learn_now') || 'Học ngay'}</span>
            </button>
          ) : (
            <button
              onClick={onDetailClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
            >
              <FiEye size={13} />
              <span>{t('lbl_details') || 'Chi tiết'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
