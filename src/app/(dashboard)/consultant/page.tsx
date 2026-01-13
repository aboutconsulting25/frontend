'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mvpService } from '@/services/api';
import type { DesiredUniversity, MajorTrack } from '@/types';

interface RegisteredStudent {
  id: string;
  name: string;
  school?: string;
  grade?: number;
  targetUniversity?: string;
  targetMajor?: string;
  status: 'pending' | 'analyzing' | 'completed' | 'reviewed';
  registeredAt: string;
  documentId?: string;
  reportId?: string;
}

export default function ConsultantPage() {
  const router = useRouter();
  const [students, setStudents] = useState<RegisteredStudent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 로컬 스토리지에서 학생 목록 로드
  useEffect(() => {
    const loadStudents = () => {
      try {
        const saved = localStorage.getItem('registered_students');
        if (saved) {
          setStudents(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load students:', e);
      }
      setIsLoading(false);
    };
    loadStudents();
  }, []);

  // 학생 저장
  const saveStudents = useCallback((newStudents: RegisteredStudent[]) => {
    setStudents(newStudents);
    localStorage.setItem('registered_students', JSON.stringify(newStudents));
  }, []);

  // 새 학생 등록 핸들러
  const handleStudentRegistered = (student: RegisteredStudent) => {
    const newStudents = [student, ...students];
    saveStudents(newStudents);
    setIsModalOpen(false);
    // 바로 결과 페이지로 이동
    router.push(`/consultant/result/${student.id}`);
  };

  // 학생 클릭 핸들러
  const handleStudentClick = (student: RegisteredStudent) => {
    router.push(`/consultant/result/${student.id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 text-[11px] bg-gray-100 text-gray-600 rounded-full">대기</span>;
      case 'analyzing':
        return <span className="px-2.5 py-1 text-[11px] bg-amber-100 text-amber-700 rounded-full">분석중</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-[11px] bg-green-100 text-green-700 rounded-full">완료</span>;
      case 'reviewed':
        return <span className="px-2.5 py-1 text-[11px] bg-blue-100 text-blue-700 rounded-full">검토완료</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-[#1B7F9E] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[22px] font-bold text-gray-900">김선생 담당 학생</h1>
          <p className="text-[14px] text-gray-500 mt-1">컨설턴트의 담당 학생을 관리합니다.</p>
        </div>

        {/* Content */}
        {students.length === 0 ? (
          // 빈 상태 - 피그마 디자인
          <div className="flex flex-col items-center justify-center py-24">
            <h2 className="text-[18px] font-semibold text-gray-900 mb-2">등록된 생활기록부가 없습니다.</h2>
            <p className="text-[14px] text-gray-500 mb-8">학생의 생활기록부를 등록하여 합격 예상 대학을 확인하세요.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 bg-[#1B7F9E] text-white text-[14px] font-medium rounded-lg hover:bg-[#166a84] transition"
            >
              생활기록부 등록하기
            </button>
          </div>
        ) : (
          // 학생 목록
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-[#1B7F9E] text-white text-[13px] font-medium rounded-lg hover:bg-[#166a84] transition"
              >
                + 신규 학생 등록
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FDF6E3]">
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-700">이름</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-700">학교</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-700">학년</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-700">희망 대학</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-700">희망 학과</th>
                    <th className="px-4 py-3 text-center text-[12px] font-semibold text-gray-700">상태</th>
                    <th className="px-4 py-3 text-center text-[12px] font-semibold text-gray-700">등록일</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      onClick={() => handleStudentClick(student)}
                      className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="px-4 py-3 text-[13px] text-gray-900 font-medium">{student.name}</td>
                      <td className="px-4 py-3 text-[13px] text-gray-600">{student.school || '-'}</td>
                      <td className="px-4 py-3 text-[13px] text-gray-600">{student.grade ? `${student.grade}학년` : '-'}</td>
                      <td className="px-4 py-3 text-[13px] text-gray-600">{student.targetUniversity || '-'}</td>
                      <td className="px-4 py-3 text-[13px] text-gray-600">{student.targetMajor || '-'}</td>
                      <td className="px-4 py-3 text-center">{getStatusBadge(student.status)}</td>
                      <td className="px-4 py-3 text-[12px] text-gray-500 text-center">
                        {new Date(student.registeredAt).toLocaleDateString('ko-KR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 안내 박스 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-blue-900 mb-1">학생 배정 안내</h4>
              <ul className="text-[12px] text-blue-800 space-y-1">
                <li>• 학생 배정은 학원 관리자가 진행합니다.</li>
                <li>• 학생이 배정되면 알림을 받으실 수 있습니다.</li>
                <li>• 문의사항은 관리자에게 문의하세요.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 등록 모달 */}
      {isModalOpen && (
        <RegisterModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleStudentRegistered}
        />
      )}
    </DashboardLayout>
  );
}

// ============================================
// 등록 모달 컴포넌트 - 피그마 디자인 기반
// ============================================
interface RegisterModalProps {
  onClose: () => void;
  onSuccess: (student: RegisteredStudent) => void;
}

function RegisterModal({ onClose, onSuccess }: RegisterModalProps) {
  const [activeTab, setActiveTab] = useState<'pdf' | 'image'>('pdf');
  const [name, setName] = useState('');
  const [majorTrack, setMajorTrack] = useState<MajorTrack | ''>('');
  const [desiredUniversities, setDesiredUniversities] = useState<DesiredUniversity[]>(
    Array(6).fill({ university: '', department: '' })
  );
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagePages, setImagePages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState('');

  const handleUniversityChange = (index: number, field: 'university' | 'department', value: string) => {
    setDesiredUniversities(prev => {
      const newList = [...prev];
      newList[index] = { ...newList[index], [field]: value };
      return newList;
    });
  };

  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
    } else {
      setError('PDF 파일만 업로드 가능합니다.');
    }
  };

  const handleImageSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImagePages(prev => {
        const newPages = [...prev];
        newPages[index] = file;
        return newPages;
      });
    }
  };

  const addImagePage = () => {
    setImagePages(prev => [...prev, null as unknown as File]);
  };

  const removeImagePage = (index: number) => {
    setImagePages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // 유효성 검사
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    if (!majorTrack) {
      setError('계열을 선택해주세요.');
      return;
    }
    if (activeTab === 'pdf' && !pdfFile) {
      setError('PDF 파일을 업로드해주세요.');
      return;
    }
    if (activeTab === 'image' && imagePages.filter(Boolean).length === 0) {
      setError('이미지를 업로드해주세요.');
      return;
    }

    const validUniversities = desiredUniversities.filter(u => u.university && u.department);
    if (validUniversities.length === 0) {
      setError('최소 1개의 희망 대학/학과를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // PDF 파일 또는 이미지 -> 실제 API 호출
      const fileToUpload = activeTab === 'pdf' ? pdfFile! : imagePages[0]; // 이미지 모드는 첫 번째 파일만 (추후 확장)

      const result = await mvpService.registerSaenggibu(
        {
          name: name.trim(),
          major_track: majorTrack,
          desired_universities: validUniversities,
          file: fileToUpload,
          use_mock: false, // 실제 AI 분석 사용
        },
        (p, msg) => {
          setProgress(p);
          setProgressMessage(msg);
        }
      );

      if (result.success) {
        // 성공 시 학생 정보 반환
        const newStudent: RegisteredStudent = {
          id: result.data.student_id,
          name: result.data.student_name,
          targetUniversity: validUniversities[0]?.university,
          targetMajor: validUniversities[0]?.department,
          status: 'completed',
          registeredAt: new Date().toISOString(),
          documentId: result.data.document_id,
          reportId: result.data.report_id,
        };
        onSuccess(newStudent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '등록 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-[18px] font-bold text-gray-900">생활기록부 등록하기</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 py-3 text-[14px] font-medium border-b-2 transition ${
              activeTab === 'pdf'
                ? 'text-[#1B7F9E] border-[#1B7F9E]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            PDF
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-3 text-[14px] font-medium border-b-2 transition ${
              activeTab === 'image'
                ? 'text-[#1B7F9E] border-[#1B7F9E]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            이미지
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-4">
          {/* 이름 입력 */}
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-gray-700 mb-2">이름</label>
            <input
              type="text"
              placeholder="김학생"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 text-[13px] border border-gray-300 rounded-lg focus:border-[#1B7F9E] focus:outline-none"
            />
          </div>

          {/* 계열 선택 */}
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-gray-700 mb-2">계열</label>
            <select
              value={majorTrack}
              onChange={(e) => setMajorTrack(e.target.value as MajorTrack)}
              className="w-full h-10 px-3 text-[13px] border border-gray-300 rounded-lg focus:border-[#1B7F9E] focus:outline-none bg-white"
            >
              <option value="">선택하세요</option>
              <option value="SCIENCE">자연계</option>
              <option value="HUMANITIES">인문계</option>
              <option value="ART">예체능</option>
            </select>
          </div>

          {/* 희망 대학/학과 - 6개 */}
          {['첫 번째', '두 번째', '세 번째', '네 번째', '다섯 번째', '여섯 번째'].map((label, index) => (
            <div key={index} className="mb-4">
              <label className="block text-[13px] font-medium text-gray-700 mb-2">{label} 희망 대학/학과</label>
              <input
                type="text"
                placeholder="대학을 입력하세요"
                value={desiredUniversities[index]?.university || ''}
                onChange={(e) => handleUniversityChange(index, 'university', e.target.value)}
                className="w-full h-10 px-3 text-[13px] border border-gray-300 rounded-lg mb-2 focus:border-[#1B7F9E] focus:outline-none"
              />
              <input
                type="text"
                placeholder="학과를 입력하세요"
                value={desiredUniversities[index]?.department || ''}
                onChange={(e) => handleUniversityChange(index, 'department', e.target.value)}
                className="w-full h-10 px-3 text-[13px] border border-gray-300 rounded-lg focus:border-[#1B7F9E] focus:outline-none"
              />
            </div>
          ))}

          {/* 파일 업로드 */}
          {activeTab === 'pdf' ? (
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-gray-700 mb-2">생기부 PDF 파일</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
                  pdfFile ? 'border-[#1B7F9E] bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {pdfFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-8 h-8 text-[#1B7F9E]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <div className="text-left">
                      <p className="text-[13px] font-medium text-gray-900">{pdfFile.name}</p>
                      <p className="text-[12px] text-gray-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => setPdfFile(null)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfSelect}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <svg className="w-10 h-10 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-[13px] text-gray-600">PDF 파일을 선택하거나 드래그하세요</p>
                      <p className="text-[11px] text-gray-400 mt-1">최대 50MB</p>
                    </label>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-gray-700 mb-2">생기부 이미지 (페이지별)</label>
              <div className="space-y-3">
                {imagePages.map((file, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-[12px] text-gray-500 w-16">페이지 {index + 1}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(index, e)}
                      className="flex-1 text-[12px] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-medium file:bg-[#1B7F9E] file:text-white hover:file:bg-[#166a84]"
                    />
                    {imagePages.length > 1 && (
                      <button onClick={() => removeImagePage(index)} className="text-red-500 hover:text-red-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addImagePage}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-[12px] text-gray-500 hover:border-gray-400 hover:text-gray-600"
                >
                  + 페이지 추가
                </button>
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[12px] text-red-600">{error}</p>
            </div>
          )}

          {/* 진행 상황 */}
          {isSubmitting && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] text-gray-600">{progressMessage}</span>
                <span className="text-[12px] text-[#1B7F9E] font-medium">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1B7F9E] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 bg-[#1B7F9E] text-white text-[14px] font-medium rounded-lg hover:bg-[#166a84] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '분석 중...' : '등록하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
