import './App.css';

import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import RequireAuth from './Compontents/Auth/RequireAuth.jsx';
import { LoadingProvider } from './Context/LoadingProvider.jsx';
import axiosInstance from './Helpers/axiosinstance.js';
import AboutUs from './Pages/AboutUs.jsx';
import CategoryAdminPage from './Pages/Admin/Category/CategoryAdminPage.jsx';
import MarketplaceAdminPage from './Pages/Admin/Marketplace/MarketplaceAdminPage.jsx';
import AdminSettingPage from './Pages/Admin/SettingManagement.jsx';
import TransactionManagement from './Pages/Admin/TransactionManagement.jsx';
import TranslationManagement from './Pages/Admin/TranslationManagement.jsx';
import UserManagement from './Pages/Admin/UserManagement.jsx';
import Contact from './Pages/Contact.jsx';
import ActivateCoursePage from './Pages/Course/ActivateCoursePage.jsx';
import CourseList from './Pages/Course/CourseList.jsx';
import CreateCourse from './Pages/Course/CreateCourse.jsx';
import EditCourse from './Pages/Course/EditCourse.jsx';
import LectureDetail from './Pages/Course/LectureDetail.jsx';
import AddCourseLectures from './Pages/Dashboard/AddLectures.jsx';
import AdminDashboard from './Pages/Dashboard/AdminDashboard.jsx';
import CourseManagement from './Pages/Dashboard/CourseManagement.jsx';
import Denied from './Pages/Denied.jsx';
import HomePage from './Pages/HomePage.jsx';
import LandingPage from './Pages/LandingPage.jsx';
import Login from './Pages/Login.jsx';
import NotFound from './Pages/NotFound.jsx';
import ChangePassword from './Pages/Password/ChangePassword.jsx';
import ForgetPassword from './Pages/Password/ForgetPassword.jsx';
import ResetPassword from './Pages/Password/ResetPassword.jsx';
import PaymentPage from './Pages/PaymentPage.jsx';
import PaymentSuccessPage from './Pages/PaymentSuccessPage.jsx';
import Signup from './Pages/Signup.jsx';
import ToolDetail from './Pages/Tool/ToolDetail/ToolDetail.jsx';
import ToolList from './Pages/Tool/ToolList/ToolList.jsx';
import EditProfile from './Pages/User/EditProfile.jsx';
import Profile from './Pages/User/Profile.jsx';

function App() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        alert('🚫 Không thể mở DevTools');
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get('/settings');
        const all = res.data?.data || [];
        const mapped = Object.fromEntries(all.map((s) => [s.key, s.value]));
        setSettings(mapped);
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <LoadingProvider>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/about" element={<AboutUs />}></Route>
        <Route path="/courses" element={<CourseList />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/denied" element={<Denied />}></Route>
        <Route
          path="/gioi-thieu-khoa-hoc/:courseId"
          element={<LandingPage />}
        ></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forget-password" element={<ForgetPassword />}></Route>
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route
          path="/marketplace"
          element={
            settings.marketplace_enabled ? (
              <ToolList />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/marketplace/:id"
          element={
            settings.marketplace_enabled ? (
              <ToolDetail />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route element={<RequireAuth allowedRoles={['ADMIN']} />}>
          <Route path="/course/create" element={<CreateCourse />}></Route>
          <Route path="/course/edit" element={<EditCourse />}></Route>
          <Route
            path="/course/add-lecture/:courseId"
            element={<AddCourseLectures />}
          ></Route>
          <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
          <Route
            path="/admin/quan-ly-nguoi-dung"
            element={<UserManagement />}
          ></Route>
          <Route
            path="/admin/quan-ly-giao-dich"
            element={<TransactionManagement />}
          ></Route>
          <Route
            path="/admin/course-progress"
            element={<ActivateCoursePage />}
          ></Route>
          <Route
            path="/admin/course/:id"
            element={<CourseManagement />}
          ></Route>
          <Route
            path="/admin/translation"
            element={<TranslationManagement />}
          ></Route>
          <Route
            path="/admin/marketplace"
            element={<MarketplaceAdminPage />}
          ></Route>
          <Route
            path="/admin/categories"
            element={<CategoryAdminPage />}
          ></Route>
          <Route path="/admin/setting" element={<AdminSettingPage />}></Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={['ADMIN', 'USER']} />}>
          <Route path="/payment" element={<PaymentPage />}></Route>
          <Route path="/user/profile" element={<Profile />}></Route>
          <Route path="/user/editprofile" element={<EditProfile />}></Route>
          <Route path="/change-password" element={<ChangePassword />}></Route>
          <Route path="/course/edit" element={<EditCourse />}></Route>
          <Route
            path="/course/:courseId/lectures/:lectureId"
            element={<LectureDetail />}
          ></Route>
          <Route
            path="/thanh-toan-thanh-cong"
            element={<PaymentSuccessPage />}
          ></Route>{' '}
        </Route>

        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </LoadingProvider>
  );
}

export default App;
