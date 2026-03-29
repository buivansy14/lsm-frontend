import 'react-quill/dist/quill.snow.css';

import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';

import FormInput from '../../../Compontents/Form/FormInput';
import FormSelect from '../../../Compontents/Form/FormSelect';
import ImageUploadField from '../../../Compontents/Form/ImageUploadField';
import axiosInstance from '../../../Helpers/axiosinstance';
import { useLockBodyScroll } from '../../../Hooks/useLockBodyScroll';

const sizeClasses = {
  sm: 'w-[400px]',
  md: 'w-[600px]',
  lg: 'w-[800px]',
  xl: 'w-[1000px]',
  '2xl': 'w-[1200px]',
  full: 'w-[90vw]',
};

const CreateMarketplaceModal = ({
  onClose,
  onSubmit,
  loading,
  size = 'md',
  currentId,
}) => {
  const methods = useForm({
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      price: '',
      categoryId: '',
      image: '',
      tags: '',
      status: 'draft',
      typeFile: 'zip',
    },
    mode: 'onTouched',
  });
  const [categories, setCategories] = useState([]);
  const { handleSubmit, reset } = methods;

  useLockBodyScroll(open);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      images: data.images || [],
      tags: data.tags ? data.tags.split(',').map((tag) => tag.trim()) : [],
    });
    reset();
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/categories');
        setCategories(res.data.data || []);
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (currentId) {
      const fetchTool = async () => {
        try {
          const res = await axiosInstance.get(`/marketplace/${currentId}`);
          const tool = res.data.data;
          methods.reset({
            name: tool.name || '',
            tagline: tool.tagline || '',
            description: tool.description || '',
            price: tool.price + '' || '',
            categoryId: tool.categoryId || '',
            image: tool.image || '',
            tags: tool.tags ? tool.tags.join(', ') : '',
            status: tool.status || 'draft',
            demoUrl: tool.demoUrl || '',
            images: tool.images || [],
            size: tool.size || '',
            typeFile: tool.typeFile || '',
            downloadUrl: tool.downloadUrl || '',
            installationGuide: tool.installationGuide || '',
          });
        } catch (error) {
          console.error('Lỗi khi tải tool:', error);
        }
      };
      fetchTool();
    }
  }, [currentId, methods]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className={`p-6 bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] ${sizeClasses[size]}`}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {currentId ? 'Chỉnh sửa tool' : 'Tạo tool mới'}
        </h2>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormInput
              name="name"
              label="Tên tool"
              required
              placeholder="Nhập tên tool"
            />
            <FormInput
              name="tagline"
              label="Tagline"
              placeholder="Mô tả ngắn"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <Controller
                name="description"
                control={methods.control}
                render={({ field }) => (
                  <ReactQuill
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Nhập mô tả chi tiết..."
                    className="bg-white text-black rounded-md [&_.ql-editor]:min-h-[200px]"
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hướng dẫn cài đặt
              </label>
              <Controller
                name="installationGuide"
                control={methods.control}
                render={({ field }) => (
                  <ReactQuill
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Nhập hướng dẫn cài đặt chi tiết..."
                    className="bg-white text-black rounded-md [&_.ql-editor]:min-h-[200px]"
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="size"
                label="Kích thước file (vd: 15MB, 200KB)"
                placeholder="Nhập kích thước file"
                required
              />
              <FormSelect
                name="typeFile"
                label="Loại file"
                options={[
                  { value: 'pdf', label: 'PDF' },
                  { value: 'zip', label: 'ZIP' },
                  { value: 'exe', label: 'EXE' },
                  { value: 'excel', label: 'Excel' },
                ]}
                placeholder="Chọn loại file"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="price"
                label="Giá (₫)"
                type="number"
                placeholder="0 nếu miễn phí"
                required
              />
              <FormSelect
                name="categoryId"
                label="Danh mục"
                options={categories.map((cat) => ({
                  value: cat._id,
                  label: cat.name,
                }))}
                placeholder="Chọn danh mục"
                required
              />
            </div>
            <FormInput
              name="demoUrl"
              label="Demo URL"
              placeholder="https://example.com/image.png"
              required
            />
            <ImageUploadField
              label="Chọn ảnh demo"
              name="image"
              required
              control={methods.control}
            />
            <FormInput
              name="downloadUrl"
              label="URL tải về"
              placeholder="https://example.com/image.png"
              required
            />

            <ImageUploadField
              label="Chọn danh sách ảnh"
              name="images"
              control={methods.control}
              multiple
              maxFiles={6}
            />

            {/* Tags */}
            <FormInput
              name="tags"
              label="Tags (cách nhau bằng dấu phẩy)"
              placeholder="tool, react, frontend"
            />

            {/* Status */}
            <FormSelect
              name="status"
              label="Trạng thái"
              options={[
                { value: 'draft', label: 'Nháp' },
                { value: 'published', label: 'Đã xuất bản' },
                { value: 'archived', label: 'Lưu trữ' },
              ]}
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
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Đang tạo...' : currentId ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default CreateMarketplaceModal;
