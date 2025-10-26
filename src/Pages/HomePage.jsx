import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import homeimg from '../Assets/Images/homePageMainImage.png';
import HomeLayout from '../Layouts/HomeLayout';

function HomePage() {
  const { t } = useTranslation();

  return (
    <HomeLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 text-white flex flex-col md:flex-row items-center justify-center gap-10 sm:h-[90vh]">
        <div className="mt-16 sm:mt-0 flex flex-col justify-center md:w-1/2 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-semibold">
            {t('home_title')}
            <span className=" text-yellow-500 font-bold">
              {' '}
              {t('lbl_best')}
            </span>{' '}
          </h1>
          <p className="text-lg sm:text-xl text-gray-200">
            {t('home_description')}
          </p>
          <div className="space-x-6">
            <Link to="/courses">
              <button className="bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                {t('btn_courses')}
              </button>
            </Link>

            <Link to="/contact">
              <button className="border border-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                {t('btn_contact_us')}
              </button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 flex items-center justify-center">
          <img src={homeimg} alt="homepage image" />
        </div>
      </div>
    </HomeLayout>
  );
}

export default HomePage;
