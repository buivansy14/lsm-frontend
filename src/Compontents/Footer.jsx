import { BsFacebook, BsYoutube } from 'react-icons/bs';

function Footer() {
  return (
    <>
      <footer className=" relative left-0 bottom-0 sm:h-[10vh] h-[15vh] py-5 sm:px-20  sm:pb-2 flex flex-col sm:flex-row items-center justify-between text-white bg-gray-900">
        <section>
          <p className="text-sm">
            © 2025 Tekla API Course. All rights reserved.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            📞 Hotline: <a href="tel:0947895039" className="text-slate-200 hover:text-yellow-400">0947 895 039</a> | 📧 Email: <a href="mailto:sybuivan1429@gmail.com" className="text-slate-200 hover:text-yellow-400">sybuivan1429@gmail.com</a>
          </p>
        </section>
        <section className="flex  items-center justify-center gap-5 text-2xl text-white">
          <a
            className="hover:text-yellow-500 transition-all ease-in-out duration-300"
            href="https://www.facebook.com/groups/1322148082249707"
            target="_blank"
            rel="noreferrer"
          >
            <BsFacebook />
          </a>
          <a
            className="hover:text-yellow-500 transition-all ease-in-out duration-300"
            href="https://www.youtube.com/@TEKLAOPENAPIVIETNAM"
            target="_blank"
            rel="noreferrer"
          >
            <BsYoutube />
          </a>
        </section>
      </footer>
    </>
  );
}
export default Footer;
