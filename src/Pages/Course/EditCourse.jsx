import { useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import HomeLayout from '../../Layouts/HomeLayout';
import { updateCourse } from '../../Redux/Slices/CourseSlice';

function EditCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [userInput, setUserInput] = useState({
    id: state?._id,
    title: state?.title,
    category: state?.category,
    description: state?.description,
    createdBy: state?.createdBy,
    thumbnail: null,
    previewImage: state.thumbnail?.secure_url,
    oldPrice: state?.oldPrice,
    price: state?.price,
  });

  function handleImageUpload(e) {
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener('load', function () {
        setUserInput({
          ...userInput,
          previewImage: this.result,
          thumbnail: uploadedImage,
        });
      });
    }
  }

  function handleUserInput(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  async function OnFormSubmit(e) {
    e.preventDefault();
    if (!userInput.title || !userInput.description || !userInput.category) {
      toast.error('All fields are mandatory');
      return;
    }

    const response = await dispatch(updateCourse(userInput));
    if (response?.payload?.success) {
      setUserInput({
        title: '',
        category: '',
        description: '',
        oldPrice: 0,
        price: 0,
        thumbnail: null,
      });
      navigate('/courses');
    }
  }
  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={OnFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 mt-5 text-white w-[80vw] md:w-[700px] sm:my-10   relative shadow-[0_0_10px_black]  "
        >
          <div>
            <Link
              to={'/'}
              className=" absolute left-2  text-lg text-accent cursor-pointer"
            >
              <AiOutlineArrowLeft />
            </Link>
          </div>

          <h1 className=" text-center text-2xl font-bold">
            Chỉnh sửa khóa học
          </h1>

          <main className=" grid lg:grid-cols-2 grid-cols-1 gap-x-10">
            <div>
              <div>
                <label htmlFor="image_uploads" className="  cursor-pointer">
                  {userInput.previewImage ? (
                    <img
                      className=" w-full h-44 m-auto border"
                      src={userInput.previewImage}
                    />
                  ) : (
                    <div className=" w-full h-44 m-auto flex items-center justify-center border">
                      <h1 className=" font-bold text-lg"> Tải ảnh</h1>
                    </div>
                  )}
                </label>
                <input
                  className="hidden"
                  type="file"
                  id="image_uploads"
                  accept=".jpg, .jpeg, .png"
                  name="image_uploads"
                  onChange={handleImageUpload}
                />
              </div>

              <div className=" flex  flex-col gap-1">
                <label className=" text-lg font-semibold" htmlFor="title">
                  Tiêu đề
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Nhập tiêu đề"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.title}
                  onChange={handleUserInput}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className=" flex  flex-col gap-1">
                <label className=" text-lg font-semibold" htmlFor="createdBy">
                  Tác giả
                </label>
                <input
                  required
                  type="text"
                  name="createdBy"
                  id="createdBy"
                  placeholder="Nhập tác giả"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.createdBy}
                  onChange={handleUserInput}
                />
              </div>
              <div className=" flex  flex-col gap-1">
                <label className=" text-lg font-semibold" htmlFor="category">
                  Danh mục
                </label>
                <input
                  required
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Nhập danh mục"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.category}
                  onChange={handleUserInput}
                />
              </div>
              <div className=" flex  flex-col gap-1">
                <label className=" text-lg font-semibold" htmlFor="category">
                  Giá cũ
                </label>
                <input
                  required
                  type="number"
                  name="oldPrice"
                  id="oldPrice"
                  placeholder="Nhập giá cũ"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.oldPrice}
                  onChange={handleUserInput}
                />
              </div>
              <div className=" flex  flex-col gap-1">
                <label className=" text-lg font-semibold" htmlFor="category">
                  Giá mới
                </label>
                <input
                  required
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Nhập giá mới"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.price}
                  onChange={handleUserInput}
                />
              </div>
              <div className=" flex  flex-col gap-1">
                <label className=" text-lg font-semibold" htmlFor="description">
                  Mô tả
                </label>
                <textarea
                  required
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Nhập mô tả"
                  className="bg-transparent px-2 py-1  h-24 overflow-scroll resize-none border"
                  value={userInput.description}
                  onChange={handleUserInput}
                />
              </div>
            </div>
          </main>

          <button
            type="submit"
            className="w-full bg-yellow-600 text-lg hover:bg-yellow-500 transition-all duration-300 ease-in-out py-2 rounded-sm font-semibold"
          >
            Cập nhật khóa học
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}
export default EditCourse;
