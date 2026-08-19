import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaLock, FaPlus } from 'react-icons/fa';
import { FiBookOpen, FiFileText, FiInfo, FiLayers, FiPlayCircle, FiSettings } from 'react-icons/fi';
import { RxVideo } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import LoadingOverlay from '../../Compontents/LoadingOverlay';
import NavbarLecture from '../../Compontents/NavbarLecture';
import SettingVideoHD from '../../Compontents/SettingVideoHD';
import VideoPlayer from '../../Compontents/VideoPlayer';
import YouTubePlayer from '../../Compontents/YouTubePlayer';
import axiosInstance from '../../Helpers/axiosinstance';
import { useIsRequestPending } from '../../Hooks/useStatus';
import {
  getCourseLectures,
  unlockNextLecture,
} from '../../Redux/Slices/LectureSlice';
import { formatSecondsToMMSS } from '../../Utils';

function LectureDetail() {
  const activeLectureRef = useRef(null);
  const sidebarRef = useRef(null);
  const scrollPosition = useRef(0);
  const [open, setOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isLoading = useIsRequestPending('course', 'getCourseLectures');
  const [videoUrl, setVideoUrl] = useState('');
  const dispatch = useDispatch();
  const { lectureId, courseId } = useParams();
  const { lectures } = useSelector((state) => state.lecture);
  const { role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCourseLectures({ courseId, lectureId })).then(() => {
      if (sidebarRef.current) {
        sidebarRef.current.scrollTop = scrollPosition.current;
      }
    });
  }, [lectureId]);

  useEffect(() => {
    if (activeLectureRef.current && sidebarRef.current) {
      const activeItem = activeLectureRef.current;
      const container = sidebarRef.current;

      const itemTop = activeItem.offsetTop;
      const itemBottom = itemTop + activeItem.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (itemTop < containerTop) {
        container.scrollTop = itemTop - 20;
      } else if (itemBottom > containerBottom) {
        container.scrollTop = itemBottom - container.clientHeight + 20;
      }
    }
  }, [lectureId]);

  const onNavigate = (item) => {
    if (item.locked) {
      return;
    }
    if (sidebarRef.current) {
      scrollPosition.current = sidebarRef.current.scrollTop;
    }
    setIsVideoLoaded(false);
    navigate(`/course/${courseId}/lectures/${item.id}`);
  };

  const handleVideoEnd = () => {
    const currentLectureIndex = lectures?.courseContent?.findIndex(
      (item) => item.id === lectureId && !item.completed
    );
    if (currentLectureIndex !== -1) {
      const nextLecture = lectures?.courseContent[currentLectureIndex + 1];
      dispatch(
        unlockNextLecture({
          courseId,
          lectureId: nextLecture ? nextLecture?.id : null,
          preLectureId: lectureId,
        })
      );
    }
  };

  const onLoadVideo = async (videoId) => {
    try {
      const response = await axiosInstance.get(
        `/course/getSecureVideo/${videoId}`
      );
      if (response.data) {
        setIsVideoLoaded(false);
        setVideoUrl(response.data?.videoUrl);
        setIsVideoLoaded(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  if (isLoading && !lectures?.title) return <LoadingOverlay isLoading={isLoading} />;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 antialiased">
      {/* Top Navbar */}
      <NavbarLecture
        title={lectures?.title}
        completedLessons={lectures?.completedLectures}
        totalLessons={lectures?.totalLectures}
      />

      {/* Slim Animated Top Progress Bar when Switching Lessons */}
      {isLoading && (
        <div className="fixed top-16 left-0 right-0 h-1 z-50 overflow-hidden bg-slate-900">
          <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 animate-pulse w-full shadow-lg shadow-cyan-500/50" />
        </div>
      )}

      {/* Main Container */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto pb-12">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Column: Video Section + Details */}
          <div className="w-full lg:w-3/4 flex flex-col space-y-6">
            
            {/* Video Player Box */}
            <div className="relative w-full h-[85vh] bg-black">
              {!isVideoLoaded && lectures?.uploadType !== 'link' && (
                <div className="w-full h-full cursor-pointer flex justify-center items-center bg-black group">
                  <div
                    className="w-[90%] h-[90%] z-10"
                    onClick={() => onLoadVideo(lectures?.videoId)}
                  >
                    <img
                      src={lectures?.thumbnailUrl}
                      alt="Video thumbnail"
                      className="w-[100%] h-full"
                    />
                  </div>
                  <div className="absolute z-20">
                    <div
                      onClick={() => onLoadVideo(lectures?.videoId)}
                      className="flex justify-center items-center p-4 bg-red-600 rounded-full transition-all duration-300"
                    >
                      <RxVideo
                        color="white"
                        size={30}
                        className="group-hover:scale-150 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              )}
              {lectures?.uploadType !== 'link' && isVideoLoaded && videoUrl && (
                <VideoPlayer
                  key={videoUrl}
                  videoUrl={videoUrl}
                  onEnded={handleVideoEnd}
                />
              )}
              {lectures?.uploadType === 'link' && (
                <YouTubePlayer
                  key={videoUrl}
                  videoUrl={lectures?.videoUrl}
                  onEnded={handleVideoEnd}
                />
              )}
            </div>

            {/* Lecture Details Under Video */}
            <div className="bg-[#131b2e]/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                    <FiPlayCircle size={13} /> Bài học hiện tại
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {lectures?.title || 'Chi tiết bài học'}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 text-sm font-medium transition-all shadow-sm group"
                  >
                    <FiSettings size={15} className="text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                    <span>Cài đặt video HD</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4 pt-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                  <FiFileText size={15} className="text-blue-400" />
                  <span>Mô tả bài học</span>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed bg-[#0b0f19]/50 p-4 rounded-xl border border-slate-800/50">
                  {lectures?.description ? (
                    <p className="whitespace-pre-line">{lectures.description}</p>
                  ) : (
                    <p className="text-slate-500 italic">Không có mô tả chi tiết cho bài học này.</p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sidebar Curriculum Playlist */}
          <div className="w-full lg:w-1/4 sticky top-20 h-[85vh] flex flex-col">
            <div className="bg-[#131b2e]/80 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-sm flex flex-col h-full overflow-hidden">
              
              {/* Sidebar Header */}
              <div className="pb-3 mb-2 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <FiLayers size={15} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white">Nội dung khóa học</h3>
                    <p className="text-[11px] text-slate-400">
                      {lectures?.courseContent?.length || 0} bài học
                    </p>
                  </div>
                </div>

                {role === 'ADMIN' && (
                  <button
                    onClick={() => navigate(`/course/add-lecture/${courseId}`)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all"
                  >
                    <FaPlus size={9} /> Thêm bài
                  </button>
                )}
              </div>

              {/* Playlist Items */}
              <ul
                ref={sidebarRef}
                className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
              >
                {lectures?.courseContent?.map((item, index) => {
                  const isActive = item.id === lectureId;
                  const lessonIndex = index + 1 < 10 ? `0${index + 1}` : index + 1;

                  return (
                    <li
                      onClick={() => onNavigate(item)}
                      key={index}
                      ref={isActive ? activeLectureRef : null}
                      className={`cursor-pointer flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600/20 border-l-4 border-l-blue-500 border-blue-500/50 shadow-md shadow-blue-950/40 text-white'
                          : item.locked
                          ? 'bg-slate-900/30 border-slate-800/30 text-slate-500 cursor-not-allowed opacity-50'
                          : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800/60 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 w-full relative">
                        <span
                          className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0 ${
                            isActive
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {lessonIndex}
                        </span>

                        <div className="flex-1 overflow-hidden pr-6">
                          <span
                            className={`font-medium text-xs sm:text-sm line-clamp-2 block leading-snug ${
                              isActive ? 'text-blue-200 font-semibold' : ''
                            }`}
                            title={item.title}
                          >
                            {item.title}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400">
                            <RxVideo color={isActive ? '#60a5fa' : '#9ca3af'} size={13} />
                            <span>{formatSecondsToMMSS(item.duration)}</span>
                          </div>
                        </div>

                        {isActive && isLoading ? (
                          <div className="w-3.5 h-3.5 border-2 border-blue-400/30 border-t-cyan-400 rounded-full animate-spin absolute right-0 top-1/2 -translate-y-1/2 shrink-0" />
                        ) : item.completed ? (
                          <FaCheckCircle
                            size={14}
                            className="text-emerald-400 absolute right-0 top-1/2 transform -translate-y-1/2 shrink-0"
                            title="Đã hoàn thành"
                          />
                        ) : item.locked ? (
                          <FaLock
                            size={12}
                            className="text-slate-600 absolute right-0 top-1/2 transform -translate-y-1/2 shrink-0"
                            title="Bài học bị khóa"
                          />
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Sidebar Footer Tip */}
              <div className="pt-2.5 mt-2 border-t border-slate-800/80 text-center">
                <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                  <FiInfo size={11} />
                  <span>Hoàn thành bài học để mở khóa bài tiếp theo</span>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* HD Video Modal */}
      <SettingVideoHD
        isOpen={open}
        closeModal={() => {
          setOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
}

export default LectureDetail;
