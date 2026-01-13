'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mvpService } from '@/services/api';
import type { DesiredUniversity } from '@/types';

interface StudentForm {
  name: string;
  school: string;
  grade: string;
  phone: string;
  email: string;
}

interface UniversityRow {
  id: number;
  priority: number;
  university: string;
  major: string;
  admissionType: string;
}

const initialUniversities: UniversityRow[] = [
  { id: 1, priority: 1, university: '서울대학교', major: '컴퓨터공학과', admissionType: '학생부종합' },
  { id: 2, priority: 2, university: '연세대학교', major: '컴퓨터과학과', admissionType: '학생부종합' },
  { id: 3, priority: 3, university: '고려대학교', major: '컴퓨터학과', admissionType: '학생부종합' },
  { id: 4, priority: 4, university: '성균관대학교', major: '소프트웨어학과', admissionType: '학생부종합' },
  { id: 5, priority: 5, university: '한양대학교', major: '컴퓨터소프트웨어학부', admissionType: '학생부종합' },
  { id: 6, priority: 6, university: '서강대학교', major: '컴퓨터공학과', admissionType: '학생부종합' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  // Step 1: Student Info
  const [studentForm, setStudentForm] = useState<StudentForm>({
    name: '김시연',
    school: '한국고등학교',
    grade: '3',
    phone: '010-1234-5678',
    email: 'student@example.com',
  });

  // Step 2: Universities
  const [universities, setUniversities] = useState<UniversityRow[]>(initialUniversities);

  // Step 3: PDF Upload
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleStudentChange = (field: keyof StudentForm, value: string) => {
    setStudentForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUniversityChange = (id: number, field: keyof UniversityRow, value: string | number) => {
    setUniversities(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const analysisSteps = [
    '학생 정보 등록',
    '대학 정보 등록',
    '문서 업로드',
    'AI 분석 중',
    '분석 완료',
  ];

  const handleSubmit = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStep(0);

    try {
      // Transform universities for API
      const desiredUniversities: DesiredUniversity[] = universities.map(u => ({
        university: u.university,
        department: u.major,
      }));

      const result = await mvpService.registerSaenggibu(
        {
          name: studentForm.name,
          major_track: 'SCIENCE', // TODO: Add to form
          desired_universities: desiredUniversities,
          file: uploadedFile,
          use_mock: true,
        },
        (progress, message) => {
          setAnalysisProgress(progress);
          setProgressMessage(message);
          
          // Update step based on progress
          if (progress < 20) setAnalysisStep(0);
          else if (progress < 40) setAnalysisStep(1);
          else if (progress < 60) setAnalysisStep(2);
          else if (progress < 90) setAnalysisStep(3);
          else setAnalysisStep(4);
        }
      );

      // Navigate to result page with IDs in query params
      const params = new URLSearchParams({
        student_id: result.data.student_id,
        report_id: result.data.report_id,
      });
      router.push(`/consultant/result/${result.data.document_id}?${params.toString()}`);
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
    }
  };

  // Analysis Loading Screen
  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="w-full max-w-md px-6 text-center">
          {/* Spinner */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="text-[14px] font-medium text-gray-900 mb-2">
              AI 분석 진행 중
            </div>
            <div className="text-[13px] text-gray-500 mb-4">
              {progressMessage || '잠시만 기다려주세요...'}
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <div className="mt-2 text-[12px] text-gray-400">
              {analysisProgress}%
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {analysisSteps.map((stepName, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-3 px-4 py-2 rounded ${
                  idx < analysisStep 
                    ? 'bg-green-50 text-green-600' 
                    : idx === analysisStep 
                      ? 'bg-primary-50 text-primary-500' 
                      : 'text-gray-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-medium ${
                  idx < analysisStep 
                    ? 'bg-green-500 text-white' 
                    : idx === analysisStep 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {idx < analysisStep ? '✓' : idx + 1}
                </div>
                <span className="text-[13px]">{stepName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-[800px] mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-[18px] font-semibold text-gray-900">신규 학생 등록</h1>
          <p className="mt-1 text-[13px] text-gray-500">학생 정보를 입력하고 생기부를 업로드하세요.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-medium ${
                s < step 
                  ? 'bg-green-500 text-white' 
                  : s === step 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {s < step ? '✓' : s}
              </div>
              <span className={`text-[13px] ${s === step ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {s === 1 ? '학생 정보' : s === 2 ? '희망 대학' : 'PDF 업로드'}
              </span>
              {s < 3 && <div className="w-12 h-px bg-gray-300 ml-2" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white border border-gray-200 rounded p-6">
          {/* Step 1: Student Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-[14px] font-medium text-gray-900 mb-4">학생 기본 정보</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-gray-600 mb-1.5">이름 *</label>
                  <input
                    type="text"
                    value={studentForm.name}
                    onChange={(e) => handleStudentChange('name', e.target.value)}
                    className="w-full h-9 px-3 text-[13px] border border-gray-300 rounded focus:border-primary-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-gray-600 mb-1.5">학교 *</label>
                  <input
                    type="text"
                    value={studentForm.school}
                    onChange={(e) => handleStudentChange('school', e.target.value)}
                    className="w-full h-9 px-3 text-[13px] border border-gray-300 rounded focus:border-primary-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] text-gray-600 mb-1.5">학년 *</label>
                  <select
                    value={studentForm.grade}
                    onChange={(e) => handleStudentChange('grade', e.target.value)}
                    className="w-full h-9 px-3 text-[13px] border border-gray-300 rounded focus:border-primary-500 focus:outline-none"
                  >
                    <option value="1">1학년</option>
                    <option value="2">2학년</option>
                    <option value="3">3학년</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] text-gray-600 mb-1.5">연락처</label>
                  <input
                    type="tel"
                    value={studentForm.phone}
                    onChange={(e) => handleStudentChange('phone', e.target.value)}
                    className="w-full h-9 px-3 text-[13px] border border-gray-300 rounded focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-gray-600 mb-1.5">이메일</label>
                  <input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => handleStudentChange('email', e.target.value)}
                    className="w-full h-9 px-3 text-[13px] border border-gray-300 rounded focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Universities */}
          {step === 2 && (
            <div>
              <h2 className="text-[14px] font-medium text-gray-900 mb-4">희망 대학 및 학과</h2>
              
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="bg-primary-500 text-white">
                    <th className="px-3 py-2 text-left font-medium w-16">순위</th>
                    <th className="px-3 py-2 text-left font-medium">대학</th>
                    <th className="px-3 py-2 text-left font-medium">학과</th>
                    <th className="px-3 py-2 text-left font-medium w-32">전형</th>
                  </tr>
                </thead>
                <tbody>
                  {universities.map((uni) => (
                    <tr key={uni.id} className="border-b border-gray-200">
                      <td className="px-3 py-2 text-center font-medium text-gray-900">{uni.priority}</td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={uni.university}
                          onChange={(e) => handleUniversityChange(uni.id, 'university', e.target.value)}
                          className="w-full h-8 px-2 text-[12px] border border-gray-300 rounded focus:border-primary-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={uni.major}
                          onChange={(e) => handleUniversityChange(uni.id, 'major', e.target.value)}
                          className="w-full h-8 px-2 text-[12px] border border-gray-300 rounded focus:border-primary-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={uni.admissionType}
                          onChange={(e) => handleUniversityChange(uni.id, 'admissionType', e.target.value)}
                          className="w-full h-8 px-2 text-[12px] border border-gray-300 rounded focus:border-primary-500 focus:outline-none"
                        >
                          <option value="학생부종합">학생부종합</option>
                          <option value="학생부교과">학생부교과</option>
                          <option value="논술">논술</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Step 3: PDF Upload */}
          {step === 3 && (
            <div>
              <h2 className="text-[14px] font-medium text-gray-900 mb-4">학교생활기록부 업로드</h2>
              
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging 
                    ? 'border-primary-500 bg-primary-50' 
                    : uploadedFile 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {uploadedFile ? (
                  <div>
                    <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-[13px] font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="mt-1 text-[12px] text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="mt-3 text-[12px] text-red-500 hover:text-red-600"
                    >
                      파일 삭제
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-[13px] text-gray-600">
                      PDF 파일을 드래그하거나{' '}
                      <label className="text-primary-500 hover:text-primary-600 cursor-pointer">
                        클릭하여 선택
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </p>
                    <p className="mt-1 text-[12px] text-gray-400">최대 10MB</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
              className="h-9 px-4 text-[13px] text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              이전
            </button>
            
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="h-9 px-4 bg-primary-500 hover:bg-primary-600 text-white text-[13px] font-medium rounded transition-colors"
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!uploadedFile}
                className="h-9 px-6 bg-accent hover:bg-accent-dark disabled:bg-gray-300 text-white text-[13px] font-medium rounded transition-colors"
              >
                분석 시작
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
