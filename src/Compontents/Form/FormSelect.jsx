import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

const FormSelect = ({
  name,
  label,
  options = [],
  placeholder = 'Chọn...',
  required = false,
  className = '',
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;

  return (
    <div className={`space-y-1 ${className} flex flex-col justify-between`}>
      {label && (
        <label className="block text-sm mb-1 font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={required ? { required: 'Trường này là bắt buộc' } : {}}
        render={({ field }) => {
          const selectedOption =
            options.find((opt) => opt.value === field.value) || null;
          return (
            <Select
              {...field}
              value={selectedOption}
              options={options}
              placeholder={placeholder}
              className="text-sm"
              onChange={(option) => field.onChange(option?.value)}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: error ? '#ef4444' : '#d1d5db',
                  borderRadius: '0.5rem',
                  minHeight: '2.5rem',
                }),
              }}
            />
          );
        }}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FormSelect;
