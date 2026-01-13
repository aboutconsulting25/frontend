import type { Student } from '@/types';

// Dashboard용 Mock 학생 데이터
export const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: '오정민',
    email: 'jungmin@student.kr',
    phone: '010-4567-8901',
    school: '서울고등학교',
    grade: 3,
    majorTrack: 'SCIENCE',
    consultantId: 'consultant-1',
    status: 'completed',
    createdAt: '2024-06-01',
    targetUniversity: '서울대학교',
    targetMajor: '컴퓨터공학과',
  },
  {
    id: 'student-2',
    name: '김학생',
    email: 'kim@student.kr',
    phone: '010-5678-9012',
    school: '한국고등학교',
    grade: 2,
    majorTrack: 'HUMANITIES',
    consultantId: 'consultant-1',
    status: 'analyzing',
    createdAt: '2024-06-15',
    targetUniversity: '연세대학교',
    targetMajor: '경영학과',
  },
  {
    id: 'student-3',
    name: '이학생',
    email: 'lee@student.kr',
    phone: '010-6789-0123',
    school: '민족사관고등학교',
    grade: 3,
    majorTrack: 'SCIENCE',
    consultantId: 'consultant-1',
    status: 'pending',
    createdAt: '2024-07-01',
    targetUniversity: '카이스트',
    targetMajor: '전기전자공학과',
  },
  {
    id: 'student-4',
    name: '박서연',
    email: 'seoyeon@student.kr',
    phone: '010-7890-1234',
    school: '대원외국어고등학교',
    grade: 2,
    majorTrack: 'SCIENCE',
    consultantId: 'consultant-1',
    status: 'completed',
    createdAt: '2024-07-15',
    targetUniversity: '고려대학교',
    targetMajor: '의예과',
  },
  {
    id: 'student-5',
    name: '최윤서',
    email: 'yunseo@student.kr',
    phone: '010-8901-2345',
    school: '용인외국어고등학교',
    grade: 3,
    majorTrack: 'SCIENCE',
    consultantId: 'consultant-1',
    status: 'reviewed',
    createdAt: '2024-08-01',
    targetUniversity: '성균관대학교',
    targetMajor: '소프트웨어학과',
  },
];

// Helper function to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Get students by consultant
export async function getStudentsByConsultant(consultantId: string): Promise<Student[]> {
  await delay(500);
  return mockStudents.filter((s) => s.consultantId === consultantId);
}
