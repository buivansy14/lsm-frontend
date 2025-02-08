import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaLock } from 'react-icons/fa';
import { RxVideo } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import LoadingOverlay from '../../Compontents/LoadingOverlay';
import NavbarLecture from '../../Compontents/NavbarLecture';
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
      const containerTop = container.scrollTop; // Vị trí cuộn hiện tại của container
      const containerBottom = containerTop + container.clientHeight; // Bottom của vùng hiển thị

      // Chỉ cuộn khi bài học bị ẩn trên hoặc dưới vùng nhìn thấy
      if (itemTop < containerTop) {
        container.scrollTop = itemTop - 20; // Cuộn lên trên (thêm margin nhỏ)
      } else if (itemBottom > containerBottom) {
        container.scrollTop = itemBottom - container.clientHeight + 20; // Cuộn xuống dưới (thêm margin nhỏ)
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

  if (isLoading) return <LoadingOverlay isLoading={isLoading} />;

  return (
    <div className="container mx-auto p-4">
      <NavbarLecture
        title={lectures?.title}
        completedLessons={lectures?.completedLectures}
        totalLessons={lectures?.totalLectures}
      />
      <div className="flex flex-col lg:flex-row">
        {/* Video Section */}
        <div className="lg:w-3/4">
          <div className="relative w-full h-[80vh] bg-black">
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

          <h2 className="mt-6 text-2xl font-semibold">{lectures?.title}</h2>
          <p className="text-white mt-2">{lectures?.description}</p>
        </div>

        {/* Fixed Sidebar */}
        <div
          className="lg:w-1/4 mt-6 lg:mt-0 lg:pl-8 sticky top-4 h-[80vh] overflow-y-auto"
          ref={sidebarRef}
        >
          <h2 className="font-semibold text-lg mb-4">Nội dung khóa học</h2>
          <ul className="space-y-2">
            {lectures?.courseContent?.map((item, index) => (
              <li
                onClick={() => onNavigate(item)}
                key={index}
                ref={item.id === lectureId ? activeLectureRef : null}
                className={`cursor-pointer flex items-center justify-between p-3 rounded-md shadow-sm transition-transform duration-300 w-[90%] ${
                  item.id === lectureId
                    ? 'bg-blue-200 hover:bg-blue-200'
                    : item.locked
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 w-full relative">
                  <div className="flex-1 overflow-hidden">
                    <span
                      className="font-medium text-sm text-gray-700 hover:text-gray-900 w-[95%] line-clamp-2 block"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        whiteSpace: 'normal',
                      }}
                      title={item.title}
                    >
                      {item.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <RxVideo color="red" />
                      <span className="text-gray-700 text-sm">
                        {formatSecondsToMMSS(item.duration)}
                      </span>
                    </div>
                  </div>

                  {item.completed && (
                    <FaCheckCircle
                      size={12}
                      color="green"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2"
                    />
                  )}
                  {item.locked && (
                    <FaLock
                      size={12}
                      color="gray"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2"
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
          {role === 'ADMIN' && (
            <button
              onClick={() => navigate(`/course/add-lecture/${courseId}`)}
              className="mt-4 btn btn-active bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-md text-lg text-white"
            >
              Thêm mới bài học{' '}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LectureDetail;
