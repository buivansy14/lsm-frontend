import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormInput from '../../../Compontents/Form/FormInput';

const CreateCategoryModal = ({ onClose, onSubmit, current }) => {
  const methods = useForm({
    defaultValues: { name: '', description: '' },
    mode: 'onTouched',
  });
  const { handleSubmit, reset } = methods;

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  useEffect(() => {
    if (current) {
      methods.reset({
        name: current.name || '',
        description: current.description || '',
      });
    }
  }, [current]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[500px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {current ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
        </h2>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormInput
              name="name"
              label="Tên danh mục"
              required
              placeholder="Nhập tên danh mục"
            />
            <FormInput
              name="description"
              label="Mô tả"
              placeholder="Mô tả ngắn gọn"
              type="textarea"
            />

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {current ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
