import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Footer from '../Compontents/Footer.jsx';
import Header from '../Compontents/Header';
import { logout } from '../Redux/Slices/AuthSlice';

function HomeLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //for checking if user is logged in
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const fullName = useSelector((state) => state?.auth?.data?.fullName);

  // for displaying the options acc to role
  //   const role = useSelector((state) => state?.auth?.role);

  async function handleLogout(e) {
    e.preventDefault();

    const res = await dispatch(logout());
    if (res?.payload?.sucess) navigate('/');
  }
  return (
    <div className="min-h-[90vh]">
      <Header
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        fullName={fullName}
      />
      {children}
      <Footer />
    </div>
  );
}

export default HomeLayout;
