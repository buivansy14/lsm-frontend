import { useFormContext } from 'react-hook-form';

const FormInput = ({
  name,
  label,
  type = 'text',
  placeholder = '',
  required = false,
  className = '',
  disabled = false,
  readonly = false,
  rows = 4, // cho textarea
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputClass = `w-full bg-white text-gray-900 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 transition-all 
    ${
      errors[name]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:ring-blue-500'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={name}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          readOnly={readonly}
          {...register(name, { required })}
          className={inputClass}
        />
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          autoComplete="off"
          disabled={disabled}
          readOnly={readonly}
          {...register(name, { required })}
          className={inputClass}
        />
      )}

      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name]?.message || 'Trường này bắt buộc phải nhập'}
        </p>
      )}
    </div>
  );
};

export default FormInput;
