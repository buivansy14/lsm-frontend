import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CourseCard from '../../Compontents/CourseCard';
import HomeLayout from '../../Layouts/HomeLayout';
import { getAllCourse, getAllCourseUser } from '../../Redux/Slices/CourseSlice';

function CourseList() {
  const dispatch = useDispatch();
  const { courseData, inactiveCourses, activeCourses } = useSelector(
    (state) => state.course
  );
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  async function loadCourses() {
    if (isLoggedIn) {
      await dispatch(getAllCourseUser());
    } else {
      await dispatch(getAllCourse());
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  const renderCourses = () => {
    if (isLoggedIn) {
      if (inactiveCourses.length === 0 && activeCourses.length === 0) {
        return (
          <p className="text-lg text-gray-300 text-center pb-6">
            Hiện tại không có khóa học nào!
          </p>
        );
      }
      return (
        <div className="flex flex-wrap justify-center items-center gap-16 mx-auto text-center mb-10">
          {[...inactiveCourses, ...activeCourses]?.map((element) => (
            <CourseCard key={element._id} data={element} />
          ))}
        </div>
      );
    } else {
      if (courseData.length === 0) {
        return (
          <p className="text-lg text-gray-300 text-center pb-6">
            Hiện tại không có khóa học nào!
          </p>
        );
      }
      return (
        <div className="flex flex-wrap justify-center items-center gap-16 mx-auto text-center mb-10">
          {courseData?.map((element) => (
            <CourseCard key={element._id} data={element} />
          ))}
        </div>
      );
    }
  };

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 flex flex-col gap-10 text-white">
        <h1 className="text-center text-3xl font-semibold">
          <span className="font-bold text-yellow-500">Danh sách khóa học</span>
        </h1>
        {renderCourses()}
      </div>
    </HomeLayout>
  );
}

export default CourseList;
