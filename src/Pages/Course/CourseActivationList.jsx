import { FaUser } from 'react-icons/fa';

const CourseActivationList = ({
  courses,
  onActivateCourse,
  selectedCourseId,
}) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 pb-3">
        Danh sách khóa học
      </h2>
      <ul className="space-y-4">
        {courses.map((course) => (
          <li
            key={course._id}
            className={`py-4 px-6 flex flex-col rounded-lg cursor-pointer transition-all ${
              selectedCourseId === course._id
                ? 'bg-green-100 border-l-4 border-green-500'
                : 'hover:bg-green-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-800">
                {course.courseTitle}
              </span>
              <button
                className="bg-yellow-500 hover:bg-yellow-400 text-white px-5 py-2 rounded-lg transition-all"
                onClick={() => onActivateCourse(course)}
              >
                Kích hoạt
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {course.users && course.users.length > 0 ? (
                course.users.map((user) => (
                  <span
                    key={user.userId}
                    className="bg-blue-500 text-white px-2 py-2 rounded-full text-xs font-medium flex items-center gap-2 hover:bg-blue-400 transition-all"
                  >
                    <FaUser size={14} className="text-white" /> {user.email}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  Chưa có người dùng đăng ký
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseActivationList;
