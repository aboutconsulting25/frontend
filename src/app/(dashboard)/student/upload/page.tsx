'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FileUpload } from '@/components/forms/FileUpload';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import {
  FileText,
  Clock,

  AlertCircle,
  Trash2,
  Eye,
} from 'lucide-react';
import { mockDocuments, delay } from '@/data/mockData';
import { formatDate, formatFileSize } from '@/lib/utils';

export default function StudentUploadPage() {
  const [uploadedFiles, setUploadedFiles] = React.useState(
    mockDocuments.filter(d => d.studentId === 'student-1')
  );

  const handleFileUpload = async (file: File) => {
    await delay(2000);
    
    const newDoc = {
      id: `doc-${Date.now()}`,
      studentId: 'student-1',
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded' as const,
    };
    
    setUploadedFiles(prev => [...prev, newDoc]);
  };

  const handleDelete = (docId: string) => {
    if (confirm('파일을 삭제하시겠습니까?')) {
      setUploadedFiles(prev => prev.filter(d => d.id !== docId));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">생기부 업로드</h1>
          <p className="text-gray-500 mt-1">생활기록부 파일을 업로드하세요</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">파일 업로드</h2>
          
          <FileUpload
            onFileSelect={(file) => console.log('Selected:', file.name)}
            onUpload={handleFileUpload}
            accept=".pdf"
            maxSize={20 * 1024 * 1024}
          />

          {/* Upload Guidelines */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              업로드 안내
            </h3>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>• PDF 형식의 생활기록부만 업로드 가능합니다</li>
              <li>• 파일 크기는 최대 20MB까지 가능합니다</li>
              <li>• 학기별로 별도의 파일을 업로드할 수 있습니다</li>
              <li>• 업로드된 파일은 AI가 자동으로 분석합니다</li>
              <li>• 분석에는 보통 1~2일이 소요됩니다</li>
            </ul>
          </div>
        </div>

        {/* Uploaded Files */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">업로드된 파일</h2>

          {uploadedFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>업로드된 파일이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadedFiles.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      doc.status === 'analyzed' ? 'bg-green-100' :
                      doc.status === 'analyzing' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      <FileText className={`h-6 w-6 ${
                        doc.status === 'analyzed' ? 'text-green-600' :
                        doc.status === 'analyzing' ? 'text-blue-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.fileName}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{formatFileSize(doc.fileSize)}</span>
                        <span>•</span>
                        <span>{formatDate(doc.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={doc.status} />
                    
                    <div className="flex items-center gap-1">
                      {doc.status === 'analyzed' && (
                        <Button variant="ghost" size="sm" title="결과 보기">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {doc.status === 'uploaded' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(doc.id)}
                          title="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress Info */}
        {uploadedFiles.some(d => d.status === 'analyzing') && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-yellow-600 animate-pulse" />
              <div>
                <p className="font-medium text-yellow-800">분석이 진행 중입니다</p>
                <p className="text-sm text-yellow-700">
                  분석이 완료되면 알림을 보내드립니다. 분석 결과는 &quot;분석 결과&quot; 메뉴에서 확인하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
