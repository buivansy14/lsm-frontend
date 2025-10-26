import { Link } from "react-router-dom";
import { FiHome, FiChevronRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const Breadcrumb = ({ items }) => {
   const { t } = useTranslation();
   return (
      <nav className="flex items-center flex-wrap text-sm text-gray-400 my-6">
         <Link
            to="/"
            className="flex items-center gap-1 text-gray-300 hover:text-yellow-400 transition"
         >
            <FiHome className="w-4 h-4" />
            <span>{t("lbl_home")}</span>
         </Link>

         {items.map((item, index) => (
            <div key={index} className="flex items-center">
               <FiChevronRight className="w-4 h-4 mx-2 text-gray-500" />
               {item.to ? (
                  <Link
                     to={item.to}
                     className="hover:text-yellow-400 transition text-gray-300"
                  >
                     {t(item.label)}
                  </Link>
               ) : (
                  <span className="text-yellow-400 font-medium">{t(item.label)}</span>
               )}
            </div>
         ))}
      </nav>
   );
};

export default Breadcrumb;
