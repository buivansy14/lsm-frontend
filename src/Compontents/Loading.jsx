export const LoadingButton = ({ isLoading, label, className = '' }) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 shadow-md ${
        isLoading
          ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-80'
          : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-amber-500/20 hover:scale-[1.01] active:scale-99'
      } ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
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
          <span>Đang xử lý...</span>
        </div>
      ) : (
        label
      )}
    </button>
  );
};
