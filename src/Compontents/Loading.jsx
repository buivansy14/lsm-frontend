export const LoadingButton = ({ isLoading, label }) => {
  return (
    <button
      type="submit"
      className={`mt-2 ${
        isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-yellow-600 hover:bg-yellow-500'
      } py-2 font-semibold text-lg cursor-pointer transition-all ease-in-out duration-300 rounded-sm`}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-white mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          Đang xử lý...
        </div>
      ) : (
        label
      )}
    </button>
  );
};
