import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { LoadingButton } from '../../Compontents/Loading';
import { useIsRequestPending } from '../../Hooks/useStatus';
import HomeLayout from '../../Layouts/HomeLayout';
import { addCourseLectures } from '../../Redux/Slices/LectureSlice';

function AddCourseLectures() {
  const { courseId } = useParams();
  const isLoading = useIsRequestPending('course', 'addCourseLectures');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    id: courseId,
    lecture: undefined,
    title: '',
    description: '',
    videoSrc: '',
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  function handleVideo(e) {
    const video = e.target.files[0];
    const source = window.URL.createObjectURL(video);
    console.log(source);
    setUserInput({
      ...userInput,
      lecture: video,
      videoSrc: source,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!userInput.lecture || !userInput.title || !userInput.description) {
      toast.error('All fields are mandatory');
      return;
    }
    const response = await dispatch(addCourseLectures(userInput));
    if (response?.payload?.success) {
      navigate(-1);
      setUserInput({
        id: courseId,
        lecture: undefined,
        title: '',
        description: '',
        videoSrc: '',
      });
    }
  }
  useEffect(() => {
    if (!courseId) navigate('/courses');
  }, []);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 mx-5 sm:mx-16 md:mx-20">
        <div className="flex flex-col gap-5 p-2 shadow-[0_0_10px_black] w-[80vw] md:w-96  rounded-lg">
          <header className="flex items-center justify-center relative">
            <button
              className="absolute left-2 text-2xl text-green-500"
              onClick={() => navigate(-1)}
            >
              <AiOutlineArrowLeft />
            </button>
            <h1 className="text-xl text-yellow-500 font-semibold">
              Tạo mới bài học
            </h1>
          </header>
          <form onSubmit={onFormSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="title"
              placeholder="Nhập tiêu đề bài học"
              onChange={handleInputChange}
              className="bg-transparent px-3 py-1 border"
              value={userInput.title}
            />
            <textarea
              type="text"
              name="description"
              placeholder="Nhập mô tả bài học"
              onChange={handleInputChange}
              className="bg-transparent px-3 py-1 border resize-none overflow-y-scroll h-36"
              value={userInput.description}
            />
            {userInput.videoSrc ? (
              <video
                muted
                src={userInput.videoSrc}
                controls
                controlsList="nodownload nofullscreen"
                disablePictureInPicture
                className="object-fill rounded-tl-lg rounded-tr-lg w-full"
              ></video>
            ) : (
              <div className="h-48 border flex items-center justify-center cursor-pointer">
                <label
                  className="font-semibold text-cl cursor-pointer"
                  htmlFor="lecture"
                >
                  Chọn video
                </label>
                <input
                  type="file"
                  className="hidden"
                  id="lecture"
                  name="lecture"
                  onChange={handleVideo}
                  accept="video/mp4 video/x-mp4 video/*"
                />
              </div>
            )}
            <LoadingButton isLoading={isLoading} label="Tạo bài học" />
          </form>
        </div>
      </div>
    </HomeLayout>
  );
}
export default AddCourseLectures;
