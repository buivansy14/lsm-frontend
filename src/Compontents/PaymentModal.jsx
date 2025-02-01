import { LoadingButton } from './Loading';

const Modal = ({ isOpen, onClose, isLoading, onSubmit, info }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-full">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg relative p-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Khóa học Tekla Open API
          </h2>
          <button
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit}>
          {/* Nội dung chính */}
          <div className="flex flex-col md:flex-row gap-6 py-6">
            {/* Cột bên trái */}
            <div className="flex-[0.7]">
              <p className="text-gray-600 leading-6 mb-4">
                Khóa học Tekla API Pro này là nền tảng vững chắc để phát triển
                các ứng dụng tùy chỉnh trên phần mềm Tekla Structures. Mục tiêu
                là giúp bạn làm chủ việc tự động hóa và tùy chỉnh trong Tekla
                thông qua việc am hiểu sâu sắc về Tekla Open API.
              </p>

              <h3 className="font-semibold text-lg mb-2">
                Bạn nhận được gì từ khóa học này?
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>
                  Hiểu sâu sắc về cấu trúc và hoạt động của Tekla Open API
                </li>
                <li>
                  Thành thạo tư duy lập trình và kỹ thuật tự động hóa trong
                  Tekla
                </li>
                <li>
                  Xây dựng các plugin và công cụ tùy chỉnh cho Tekla Structures
                </li>
                <li>
                  Hiểu và làm việc với mô hình BIM, tích hợp dữ liệu qua API
                </li>
                <li>
                  Phát triển các ứng dụng hỗ trợ quy trình thiết kế và quản lý
                  dự án
                </li>
                <li>
                  Đầu tư xứng đáng với những kỹ năng bạn nhận được từ khóa học!
                </li>
              </ul>
            </div>

            {/* Cột bên phải */}
            <div className="flex-[0.3] p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Chi tiết thanh toán
              </h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Khóa học Tekla API</span>
                <span className="line-through text-gray-500">
                  {info?.oldPrice?.toLocaleString() + 'đ'}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Giá ưu đãi hôm nay</span>
                <span className="font-semibold text-red-600">
                  {info?.price?.toLocaleString() + 'đ'}
                </span>
              </div>

              <div className="flex justify-between font-semibold text-lg text-gray-800 mb-6">
                <span>TỔNG</span>
                <span> {info?.price?.toLocaleString() + 'đ'}</span>
              </div>

              <LoadingButton
                isLoading={isLoading}
                label="Tiếp tục thanh toán"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
