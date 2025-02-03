import { BsFacebook, BsYoutube } from 'react-icons/bs';

function Footer() {
  return (
    <>
      <footer className=" relative left-0 bottom-0 sm:h-[10vh] h-[15vh] py-5 sm:px-20  sm:pb-2 flex flex-col sm:flex-row items-center justify-between text-white bg-gray-900">
        <section>
          <p className="text-sm">
            © 2025 Tekla API Course. All rights reserved.
          </p>
          <p className="mt-2 text-sm">
            📞 Hotline: 0947 895 039 | 📧 Email: sybuivan1429@gmal.com
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
