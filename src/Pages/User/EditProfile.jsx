import { useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import HomeLayout from '../../Layouts/HomeLayout';
import { getuserData, updateProfile } from '../../Redux/Slices/AuthSlice';

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({
    previewImage: '',
    fullName: '',
    avatar: undefined,
    userId: useSelector((state) => state?.auth?.data?._id),
  });

  function handleImageUpload(e) {
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener('load', function () {
        setData({
          ...data,
          previewImage: this.result,
          avatar: uploadedImage,
        });
      });
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!data.fullName || !data.avatar) {
      toast.error('Tất cả các trường đều là bắt buộc');
      return;
    }
    if (data.fullName.length < 5) {
      toast.error('Tên không được ít hơn 5 ký tự');
      return;
    }

    const fromData = new FormData();
    fromData.append('fullName', data.fullName);
    fromData.append('avatar', data.avatar);

    await dispatch(updateProfile(fromData));

    await dispatch(getuserData());

    navigate('/user/profile');
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={onFormSubmit}
          className="flex flex-col items-center justify-center gap-5 rounded-lg p-4 text-white w-80 min-h-[26rem] shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-semibold">
            Chỉnh Sửa Hồ Sơ
          </h1>
          <label className="cursor-pointer" htmlFor="image_uploads">
            {data.previewImage ? (
              <img
                className="w-28 h-28 rounded-full m-auto"
                src={data.previewImage}
                alt="Avatar Preview"
              />
            ) : (
              <BsPersonCircle className="w-28 h-28 rounded-full m-auto" />
            )}
          </label>
          <input
            onChange={handleImageUpload}
            className="hidden"
            type="file"
            id="image_uploads"
            name="image_uploads"
            accept=".jpg, .png, .svg,.jpeg"
          />

          <div className="w-full flex flex-col gap-1">
            <label htmlFor="fullName" className="font-semibold">
              Họ và Tên
            </label>
            <input
              type="text"
              required
              name="fullName"
              id="fullName"
              placeholder="Nhập họ và tên của bạn..."
              className="bg-transparent px-2 py-1 border"
              onChange={handleInputChange}
              value={data.fullName}
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-yellow-600 hover:bg-yellow-500 py-2 font-semibold text-lg cursor-pointer transition-all ease-in-out duration-300 rounded-sm"
          >
            Cập Nhật Hồ Sơ
          </button>
          <Link to="/user/profile">
            <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-3">
              <AiOutlineArrowLeft />
              Quay lại hồ sơ
            </p>
          </Link>
        </form>
      </div>
    </HomeLayout>
  );
}

export default EditProfile;
