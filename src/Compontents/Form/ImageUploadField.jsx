import { useEffect, useRef, useState } from 'react';
import { useController } from 'react-hook-form';

export default function ImageUploadField({
  name,
  control,
  multiple = false,
  maxFiles,
  accept = 'image/*',
  previewSize = 150,
  className = '',
  label = '',
  required = false,
}) {
  const {
    field: { value, onChange },
    fieldState,
  } = useController({
    name,
    control,
    defaultValue: multiple ? [] : null,
    rules: {
      validate: (v) => {
        if (required) {
          if (multiple)
            return (v && v.length > 0) || 'Vui lòng chọn ít nhất 1 ảnh';
          return (
            v instanceof File || typeof v === 'string' || 'Vui lòng chọn ảnh'
          );
        }
        return true;
      },
    },
  });

  const [items, setItems] = useState(() => {
    if (!value) return [];
    if (multiple && Array.isArray(value)) {
      return value
        .map((item) => {
          if (item instanceof File) {
            return { file: item, url: URL.createObjectURL(item) };
          } else if (typeof item === 'string') {
            return { file: null, url: item };
          }
          return null;
        })
        .filter(Boolean);
    }
    if (!multiple) {
      if (value instanceof File) {
        return [{ file: value, url: URL.createObjectURL(value) }];
      } else if (typeof value === 'string') {
        return [{ file: null, url: value }];
      }
    }
    return [];
  });

  const inputRef = useRef(null);

  // Keep form value in sync whenever items change
  useEffect(() => {
    if (multiple) {
      onChange(items.map((i) => i.file || i.url));
    } else {
      onChange(items[0]?.file || items[0]?.url || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((i) => {
        if (i.url.startsWith('blob:')) URL.revokeObjectURL(i.url);
      });
    };
  }, [items]);

  function handleFiles(fileList) {
    if (!fileList) return;
    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith('image/'),
    );
    if (files.length === 0) return;

    if (multiple) {
      let next = [
        ...items,
        ...files.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
      ];
      if (maxFiles) next = next.slice(0, maxFiles);
      // revoke old URLs for files we removed due to maxFiles
      setItems((prev) => {
        // revoke any urls that won't be in next but are in prev
        const keepFiles = new Set(next.map((n) => n.file));
        prev.forEach((p) => {
          if (p.file && !keepFiles.has(p.file) && p.url.startsWith('blob:')) {
            URL.revokeObjectURL(p.url);
          }
        });
        return next;
      });
    } else {
      // single
      // revoke previous
      items.forEach((i) => {
        if (i.url.startsWith('blob:')) URL.revokeObjectURL(i.url);
      });
      const f = files[0];
      setItems([{ file: f, url: URL.createObjectURL(f) }]);
    }
  }

  function onPickClick() {
    inputRef.current?.click();
  }

  function handleInputChange(e) {
    handleFiles(e.target.files);
    // reset input so selecting the same file again triggers change
    e.target.value = null;
  }

  function removeIndex(idx) {
    setItems((prev) => {
      const removed = prev[idx];
      if (removed && removed.url.startsWith('blob:')) {
        URL.revokeObjectURL(removed.url);
      }
      const next = prev.filter((_, i) => i !== idx);
      return next;
    });
  }

  function clearAll() {
    setItems((prev) => {
      prev.forEach((p) => {
        if (p.url.startsWith('blob:')) URL.revokeObjectURL(p.url);
      });
      return [];
    });
  }

  return (
    <div className={`prose-sm ${className}`}>
      {label && (
        <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleInputChange}
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPickClick}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:shadow-sm focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V8.414A2 2 0 0016.414 7L12 2.586A2 2 0 0010.586 2H4z" />
          </svg>
          <span>
            {multiple ? 'Chọn ảnh' : items.length ? 'Thay ảnh' : 'Chọn ảnh'}
          </span>
        </button>

        {items.length > 0 && (
          <>
            <button
              type="button"
              onClick={clearAll}
              className="px-3 py-2 rounded-md border hover:bg-gray-50"
            >
              Xóa tất cả
            </button>
            <span className="text-sm text-gray-500">
              {items.length} ảnh đã chọn
            </span>
          </>
        )}
      </div>

      {fieldState?.error && (
        <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
      )}

      {/* previews */}
      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {items.map((it, idx) => (
            <div
              key={idx}
              className="relative rounded overflow-hidden border"
              style={{ width: previewSize, height: previewSize }}
            >
              <img
                src={it.url}
                alt={`preview-${idx}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                className="block"
              />
              <button
                type="button"
                onClick={() => removeIndex(idx)}
                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow"
                title="Xóa"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
