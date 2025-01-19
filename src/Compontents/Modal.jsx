const Modal = ({ isOpen, onClose, title, children, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <form
      onSubmit={onConfirm}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white w-[90%] sm:w-[500px] rounded-lg shadow-lg p-6 relative">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          {title}
        </h2>

        <div className="mt-4 text-sm text-gray-600">{children}</div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all mr-2"
          >
            Đóng
          </button>
          {onConfirm && (
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-md transition-all"
            >
              Xác nhận
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default Modal;
