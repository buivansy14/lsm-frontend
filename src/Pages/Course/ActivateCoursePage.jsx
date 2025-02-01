import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import Modal from '../../Compontents/Modal';
import HomeLayout from '../../Layouts/HomeLayout';
import { activateCourseForUser } from '../../Redux/Slices/CourseProgress';
import { getCoursesWithUsers } from '../../Redux/Slices/CourseSlice';
import CourseActivationList from './CourseActivationList';

const ActivateCoursePage = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { courseWithUser } = useSelector((state) => state?.course);
  const [unregisteredUsers, setUnregisteredUsers] = useState([]);

  const dispatch = useDispatch();
  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser('');
  };

  const handleSelectChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const confirmAction = () => {
    if (!selectedUser) {
      toast.error('Vui lòng chọn người dùng trước!');
      return;
    }
    try {
      dispatch(
        activateCourseForUser({
          userId: selectedUser,
          courseId: selectedCourse?.courseId,
        })
      )
        .unwrap()
        .then(() => {
          toast.success('Kích hoạt khóa học thành công!');
          dispatch(getCoursesWithUsers());
        });
    } catch (error) {
      console.error(error);
      toast.error('Kích hoạt khóa học thất bại!');
    }
    closeModal();
  };

  const handleActivateCourse = (course) => {
    setIsOpen(true);
    setSelectedCourse(course);
    setUnregisteredUsers(course?.unregisteredUsers || []);
  };

  useEffect(() => {
    dispatch(getCoursesWithUsers());
  }, []);

  return (
    <HomeLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Kích hoạt khóa học cho người dùng
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <CourseActivationList
              courses={courseWithUser}
              onActivateCourse={handleActivateCourse}
              selectedCourseId={selectedCourse}
            />
          </div>
        </div>
        <Modal
          title="Kích hoạt khóa học"
          isOpen={isOpen}
          onClose={closeModal}
          onConfirm={confirmAction}
        >
          <p className="text-gray-800 font-medium mb-4">
            Tên khóa học: {selectedCourse?.courseTitle}
          </p>
          <div className="flex items-center gap-4">
            <label className="block mb-2 text-gray-800 font-medium">
              Chọn tài khoản:
            </label>
            <select
              value={selectedUser}
              required
              onChange={handleSelectChange}
              className="w-[70%] px-3 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                -- Chọn người dùng --
              </option>
              {unregisteredUsers.map((user, index) => (
                <option key={index} value={user?._id}>
                  {user?.email}
                </option>
              ))}
            </select>
          </div>
        </Modal>
      </div>
    </HomeLayout>
  );
};

export default ActivateCoursePage;
