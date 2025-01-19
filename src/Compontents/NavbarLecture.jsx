import { FiArrowLeft } from 'react-icons/fi'; // Icon Back
import { useNavigate } from 'react-router-dom';

import LessonProgress from './LessonProgress'; // Component tiến độ

const NavbarLecture = ({ title, completedLessons, totalLessons }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-full bg-[#1d232a] shadow-inner z-50 flex items-center px-4 py-3 justify-between">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-semibold mr-4"
        >
          <FiArrowLeft size={20} className="mr-2" />
        </button>
        <h1 className="text-lg font-bold text-white">{title}</h1>
      </div>

      <div className="flex items-center justify-end w-1/3">
        {' '}
        <LessonProgress
          completedLessons={completedLessons}
          totalLessons={totalLessons}
        />
      </div>
    </div>
  );
};

export default NavbarLecture;
