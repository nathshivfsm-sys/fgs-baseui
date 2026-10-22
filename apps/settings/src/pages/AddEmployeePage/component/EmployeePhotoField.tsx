import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { ImportIcon } from '@cms/ui';
import {
  PHOTO_CHANGE_LABEL,
  PHOTO_ON_FILE_LABEL,
  PHOTO_UPLOAD_LABEL,
  PHOTO_UPLOADING_LABEL,
} from '../constant';
import type { EmployeePhotoFieldProps } from '../types';

export const EmployeePhotoField = ({
  hasStoredPhoto,
  isUploading,
  onFileSelected,
  previewUrl,
}: EmployeePhotoFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewBroken, setPreviewBroken] = useState(false);

  useEffect(() => {
    setPreviewBroken(false);
  }, [previewUrl]);

  const showPreview = previewUrl != null && !previewBroken;

  const label = isUploading
    ? PHOTO_UPLOADING_LABEL
    : showPreview
      ? PHOTO_CHANGE_LABEL
      : hasStoredPhoto
        ? PHOTO_ON_FILE_LABEL
        : PHOTO_UPLOAD_LABEL;

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    onFileSelected(file);
  };

  const handlePreviewError = () => {
    setPreviewBroken(true);
  };

  return (
    <>
      <button
        className="flex min-h-[64px] w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-md border border-dashed border-border bg-surface px-2 py-2 text-foreground-subtle transition-colors hover:border-action hover:text-action disabled:pointer-events-none disabled:opacity-60"
        data-testid="employee-photo-field"
        disabled={isUploading}
        onClick={handlePhotoClick}
        type="button"
      >
        {showPreview ? (
          <img
            alt="Employee photo"
            className="h-24 w-full rounded object-contain"
            data-testid="employee-photo-preview"
            onError={handlePreviewError}
            src={previewUrl}
          />
        ) : (
          <ImportIcon aria-hidden className="size-[18px]" />
        )}
        <span className="text-[11px] leading-[16.5px]">{label}</span>
      </button>
      <input
        accept="image/*"
        className="sr-only"
        onChange={handlePhotoChange}
        ref={fileInputRef}
        type="file"
      />
    </>
  );
};
