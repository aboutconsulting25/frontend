'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { formatFileSize } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUpload?: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
}

type UploadStatus = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

export function FileUpload({
  onFileSelect,
  onUpload,
  accept = '.pdf,.doc,.docx',
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
}: FileUploadProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<UploadStatus>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `파일 크기가 너무 큽니다. 최대 ${formatFileSize(maxSize)}까지 업로드할 수 있습니다.`;
    }
    
    const allowedExtensions = accept.split(',').map(ext => ext.trim().toLowerCase());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return `지원하지 않는 파일 형식입니다. (${accept})`;
    }
    
    return null;
  };

  const handleFile = (selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setStatus('error');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setStatus('selected');
    onFileSelect(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !onUpload) return;

    setStatus('uploading');
    try {
      await onUpload(file);
      setStatus('success');
    } catch {
      setError('업로드 중 오류가 발생했습니다.');
      setStatus('error');
    }
  };

  const handleRemove = () => {
    setFile(null);
    setStatus('idle');
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {status === 'idle' || status === 'error' ? (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400',
            status === 'error' && 'border-red-300 bg-red-50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              'p-4 rounded-full',
              status === 'error' ? 'bg-red-100' : 'bg-blue-100'
            )}>
              <Upload className={cn(
                'h-8 w-8',
                status === 'error' ? 'text-red-600' : 'text-blue-600'
              )} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                파일을 드래그하거나 클릭하여 업로드하세요
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {accept} (최대 {formatFileSize(maxSize)})
              </p>
            </div>
          </div>
          {error && (
            <div className="mt-4 flex items-center justify-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              'p-3 rounded-lg',
              status === 'success' ? 'bg-green-100' : 'bg-gray-100'
            )}>
              {status === 'success' ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <File className="h-6 w-6 text-gray-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file?.name}
              </p>
              <p className="text-xs text-gray-500">
                {file && formatFileSize(file.size)}
              </p>
            </div>
            {status !== 'uploading' && (
              <button
                onClick={handleRemove}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>

          {status === 'uploading' && (
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-pulse w-2/3" />
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">업로드 중...</p>
            </div>
          )}

          {status === 'selected' && onUpload && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleUpload}>
                업로드 시작
              </Button>
            </div>
          )}

          {status === 'success' && (
            <p className="mt-4 text-sm text-green-600 text-center">
              업로드가 완료되었습니다!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
