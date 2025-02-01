import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { isEmail } from '../../Helpers/regexMatcher';
import HomeLayout from '../../Layouts/HomeLayout';
import { forgetPassword } from '../../Redux/Slices/AuthSlice';

function ForgetPassword() {
  const dispatch = useDispatch();

  const [data, setData] = useState({
    email: '',
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // checking for the empty field
    if (!data.email) {
      toast.error('All fields are mandatory');
      return;
    }

    // email validation using regex
    if (!isEmail(data.email)) {
      toast.error('Invaild email id  ');
      return;
    }

    // calling the api from auth slice
    const response = await dispatch(forgetPassword(data));
    if (response?.payload?.success) {
      setData({
        email: '',
      });
    }
  };

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        {/* forget password card */}
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center gap-6 rounded-lg p-4 text-white w-[400px] h-[26rem] shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Quên mật khẩu</h1>

          <p>
            Nhập email đã đăng ký của bạn, chúng tôi sẽ gửi cho bạn một liên kết
            xác minh vào email đã đăng ký của bạn, từ đó bạn có thể đặt lại mật
            khẩu của mình
          </p>

          <div className="flex flex-col gap-1">
            <input
              required
              type="email"
              name="email"
              id="email"
              placeholder="Nhập email đã đăng ký của bạn"
              className="bg-transparent px-2 py-1 border"
              value={data.email}
              onChange={(event) => setData({ email: event.target.value })}
            />
          </div>

          <button
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
            type="submit"
          >
            Nhận liên kết xác minh
          </button>

          <p className="text-center">
            Bạn đã có tài khoản ?{' '}
            <Link to={'/login'} className="link text-accent cursor-pointer">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}
export default ForgetPassword;
