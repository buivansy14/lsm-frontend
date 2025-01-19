import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '../Compontents/Loading';
import { useIsRequestPending } from '../Hooks/useStatus';
import HomeLayout from '../Layouts/HomeLayout';
import { login } from '../Redux/Slices/AuthSlice';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useIsRequestPending('auth', 'login');

  const [loginData, setloginData] = useState({
    email: '',
    password: '',
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setloginData({
      ...loginData,
      [name]: value,
    });
  }

  async function onLogin(event) {
    event.preventDefault();
    if (!loginData.email || !loginData.password) {
      console.log({ loginData });
      toast.error('Please fill all the details ');
      return;
    }

    //dispatch create account action
    const response = await dispatch(login(loginData));
    if (response?.payload?.success) {
      navigate('/');
      setloginData({
        email: '',
        password: '',
      });
    }
  }
  return (
    <HomeLayout>
      <div className=" flex items-center justify-center h-[90vh]">
        <form
          noValidate
          onSubmit={onLogin}
          className="flex flex-col justify-center gap-3 rounded-lg text-white p-6 shadow-[0_0_10px_black] "
        >
          <h1 className="text-center text-2xl font-bold">
            Chào mừng bạn đến với EduPlatform
          </h1>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              required
              name="email"
              id="email"
              placeholder="Enter your email...."
              className=" bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={loginData.email}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              name="password"
              id="password"
              placeholder="Enter your password...."
              className=" bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={loginData.password}
            />
          </div>

          <LoadingButton isLoading={isLoading} label="Đăng nhập" />

          <Link to={'/forget-password'}>
            <p className="text-center link text-accent cursor-pointer">
              Quên mật khẩu
            </p>
          </Link>

          <p className="text-center">
            Bạn chưa có tài khoản ?{' '}
            <Link to="/signup" className=" link  text-accent cursor-pointer">
              Đăng ký
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}
export default Login;
