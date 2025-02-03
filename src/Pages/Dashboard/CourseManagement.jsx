import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import axiosInstance from '../../Helpers/axiosinstance';
import HomeLayout from '../../Layouts/HomeLayout';

const CourseManagement = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    orderDisplay: 1,
  });

  useEffect(() => {
    getCourseInfo(id);
  }, [id]);

  const getCourseInfo = async (id) => {
    try {
      const res = await axiosInstance.get(`/course/getInfo/${id}`);
      if (res.data) {
        setCourse(res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải khóa học');
    }
  };

  const handleEditClick = (lesson) => {
    setSelectedLesson(lesson);
    setSelectedLessonId(lesson._id);

    setFormData({
      title: lesson.title,
      description: lesson.description,
      orderDisplay: lesson.orderDisplay,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.orderDisplay) {
      toast.error('Tất cả các trường là bắt buộc');
      return;
    }

    try {
      const res = await axiosInstance.put(
        `/course/${id}/lesson/${selectedLesson._id}`,
        { ...formData, orderDisplay: Number(formData?.orderDisplay) }
      );
      if (res.data) {
        toast.success('Cập nhật bài học thành công');
        setSelectedLesson(null);
        getCourseInfo(id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật bài học');
    }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <HomeLayout>
      <div className="flex p-6 w-full justify-between">
        <div className="flex-1 pr-6">
          <h2 className="text-3xl text-white">{course.title}</h2>

          <h3 className="mt-6 text-2xl font-semibold">Bài Học</h3>
          <ul className="space-y-4 mt-4 sticky top-4 h-[60vh] overflow-y-auto">
            {course.lectures && course.lectures.length > 0 ? (
              course.lectures.map((lesson, index) => (
                <li
                  onClick={() => handleEditClick(lesson)}
                  key={index}
                  className={`bg-white p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer ${
                    selectedLessonId === lesson._id ? 'bg-blue-400' : ''
                  }`}
                >
                  <div>
                    <h4
                      className={`text-lg ${
                        selectedLessonId === lesson._id
                          ? 'text-blue-700'
                          : 'text-gray-700'
                      }`}
                    >
                      {lesson.title}
                    </h4>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500">Chưa có bài học nào.</p>
            )}
          </ul>
        </div>

        {/* Sidebar: Chỉnh sửa bài học */}
        {selectedLesson && (
          <div className="w-1/3 bg-gray-700 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Chỉnh sửa bài học
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-lg text-white">Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  className="bg-transparent px-3 py-1 border w-full rounded-md text-gray-100"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-lg text-gray-100">Mô tả</label>
                <textarea
                  name="description"
                  className="bg-transparent px-3 py-1 border w-full rounded-md h-36 resize-none text-gray-100"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-lg text-gray-100">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  name="orderDisplay"
                  className="bg-transparent px-3 py-1 border w-full rounded-md text-gray-100"
                  value={formData.orderDisplay}
                  onChange={handleInputChange}
                />
              </div>

              <button
                type="submit"
                className="bg-yellow-500 text-white px-4 py-2 rounded-md"
              >
                Lưu thay đổi
              </button>
            </form>
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default CourseManagement;
