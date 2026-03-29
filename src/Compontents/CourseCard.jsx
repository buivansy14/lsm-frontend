import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { getImageUrl } from '../Helpers/imageHelper';
import { insertDashEveryTwoChars } from '../Utils';

function CourseCard({ data }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lectureId = data?.lectures?.[0]?._id;

  const onNavigate = () => {
    const isActive = data?.isActive;
    if (!isActive) return;
    navigate(`/course/${data._id}/lectures/${lectureId}`);
  };

  return (
    <div
      className={`text-white w-[450px] shadow-lg rounded-xl cursor-pointer group overflow-hidden 
      bg-[#f7f7f7] transition-all ease-in-out duration-300 relative`}
    >
      {/* Ảnh thumbnail */}
      <div className="overflow-hidden">
        <img
          className={`h-56 w-full rounded-t-xl object-cover transition-transform duration-300 
          ${data?.isActive ? 'group-hover:scale-110' : 'opacity-50'}`}
          src={getImageUrl(data?.thumbnail?.secure_url)}
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
          className="text-sm text-start text-gray-600 overflow-hidden text-ellipsis"
          // style={{
          //   display: '-webkit-box',
          //   WebkitLineClamp: 2,
          //   WebkitBoxOrient: 'vertical',
          //   whiteSpace: 'normal',
          // }}
        >
          {data?.description}
        </p>
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
        <div className="absolute text-white text-sm flex gap-2 px-4  bottom-[16px] right-[10px]">
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
          className="absolute transform bottom-[16px] right-[10px] bg-red-600 text-white text-sm rounded-md p-2"
        >
          {t('lbl_learn_now')}
        </div>
      )}
    </div>
  );
}

export default CourseCard;
