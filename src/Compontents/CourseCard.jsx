import { FaClock, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { convertSecondsToDuration, insertDashEveryTwoChars } from '../Utils';

function CourseCard({ data }) {
  const navigate = useNavigate();
  const lectureId = data?.lectures?.[0]?._id;

  const onNavigate = () => {
    const isActive = data?.isActive;
    if (!isActive) return;
    navigate(`/course/${data._id}/lectures/${lectureId}`);
  };

  return (
    <div
      className={`text-white w-[320px] h-[365px] shadow-lg rounded-xl cursor-pointer group overflow-hidden 
      bg-[#f7f7f7] transition-all ease-in-out duration-300 relative`}
    >
      {/* Ảnh thumbnail */}
      <div className="overflow-hidden">
        <img
          className={`h-40 w-full rounded-t-xl object-cover transition-transform duration-300 
          ${data?.isActive ? 'group-hover:scale-110' : 'opacity-50'}`}
          src={data?.thumbnail?.secure_url}
          alt="course thumbnail"
        />
      </div>

      {/* Nội dung khóa học */}
      <div className="p-5 space-y-1">
        <h2
          className={`text-lg text-start font-bold line-clamp-2 ${
            data?.isActive ? 'text-yellow-400' : 'text-gray-600'
          }`}
        >
          {data?.title}
        </h2>
        <p
          className="text-sm text-start text-gray-600 h-[40px] overflow-hidden text-ellipsis"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            whiteSpace: 'normal',
          }}
        >
          {data?.description}
        </p>

        <div className="flex justify-between">
          <p className="flex items-center text-sm text-gray-600">
            <FaUsers className="mr-1 text-gray-300" size={18} />
            {data?.totalStudents || 0} học viên
          </p>

          <p className="flex items-center text-sm font-medium text-gray-600">
            <FaClock className="mr-1 text-gray-300" size={18} />
            {convertSecondsToDuration(data?.totalDuration)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {data?.oldPrice && (
            <p className="text-sm text-gray-400 line-through">
              {data.oldPrice.toLocaleString()}đ
            </p>
          )}
          <p className="text-sm font-bold text-yellow-500">
            {data?.price ? `${data.price.toLocaleString()}đ` : 'Liên hệ'}
          </p>
        </div>
      </div>

      {!data?.isActive && (
        <div className="absolute w-full text-white text-sm flex justify-between px-4">
          <div className="bg-red-400 py-1 px-4 rounded-md">Chưa kích hoạt</div>
          <div
            className="bg-yellow-600 py-1 px-4 rounded-md"
            onClick={() =>
              navigate(
                `/gioi-thieu-khoa-hoc/${insertDashEveryTwoChars(data?._id)}`
              )
            }
          >
            Chi tiết
          </div>
        </div>
      )}
      {data?.isActive && (
        <div
          onClick={onNavigate}
          className="absolute left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-sm py-1 px-4 rounded-md"
        >
          Học ngay
        </div>
      )}
    </div>
  );
}

export default CourseCard;
