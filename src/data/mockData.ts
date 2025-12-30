import {
  User,
  Student,
  Consultant,
  SalesManager,
  Document,
  AnalysisResult,
  Payment,
  Report,
} from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'admin-1',
    name: '김관리자',
    email: 'admin@aboutconsulting.kr',
    role: 'admin',
    createdAt: '2024-01-01',
    phone: '010-1234-5678',
    organization: 'About Consulting',
  },
  {
    id: 'sales-1',
    name: '이영업',
    email: 'sales@aboutconsulting.kr',
    role: 'sales_manager',
    createdAt: '2024-02-01',
    phone: '010-2345-6789',
    organization: 'About Consulting',
  },
  {
    id: 'consultant-1',
    name: '박컨설턴트',
    email: 'consultant@aboutconsulting.kr',
    role: 'consultant',
    createdAt: '2024-03-01',
    phone: '010-3456-7890',
    organization: 'About Consulting',
  },
  {
    id: 'student-1',
    name: '오정민',
    email: 'jungmin@student.kr',
    role: 'student',
    createdAt: '2024-06-01',
    phone: '010-4567-8901',
  },
];

// Mock Students
export const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: '오정민',
    email: 'jungmin@student.kr',
    phone: '010-4567-8901',
    school: '서울고등학교',
    grade: 3,
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
    consultantId: 'consultant-1',
    status: 'pending',
    createdAt: '2024-07-01',
    targetUniversity: '카이스트',
    targetMajor: '전기전자공학과',
  },
  {
    id: 'student-4',
    name: '박학생',
    email: 'park@student.kr',
    phone: '010-7890-1234',
    school: '대원외국어고등학교',
    grade: 2,
    consultantId: 'consultant-2',
    status: 'reviewed',
    createdAt: '2024-07-15',
    targetUniversity: '고려대학교',
    targetMajor: '국제학부',
  },
  {
    id: 'student-5',
    name: '최학생',
    email: 'choi@student.kr',
    phone: '010-8901-2345',
    school: '용인외국어고등학교',
    grade: 3,
    consultantId: 'consultant-2',
    status: 'completed',
    createdAt: '2024-08-01',
    targetUniversity: '성균관대학교',
    targetMajor: '소프트웨어학과',
  },
];

// Mock Consultants
export const mockConsultants: Consultant[] = [
  {
    id: 'consultant-1',
    name: '박컨설턴트',
    email: 'consultant1@aboutconsulting.kr',
    phone: '010-3456-7890',
    specialty: '이공계열',
    studentCount: 3,
    salesManagerId: 'sales-1',
    status: 'active',
    createdAt: '2024-03-01',
  },
  {
    id: 'consultant-2',
    name: '최컨설턴트',
    email: 'consultant2@aboutconsulting.kr',
    phone: '010-4567-8901',
    specialty: '인문사회계열',
    studentCount: 2,
    salesManagerId: 'sales-1',
    status: 'active',
    createdAt: '2024-04-01',
  },
  {
    id: 'consultant-3',
    name: '정컨설턴트',
    email: 'consultant3@aboutconsulting.kr',
    phone: '010-5678-9012',
    specialty: '예체능계열',
    studentCount: 0,
    salesManagerId: 'sales-2',
    status: 'inactive',
    createdAt: '2024-05-01',
  },
];

// Mock Sales Managers
export const mockSalesManagers: SalesManager[] = [
  {
    id: 'sales-1',
    name: '이영업',
    email: 'sales1@aboutconsulting.kr',
    phone: '010-2345-6789',
    region: '서울/경기',
    consultantCount: 2,
    studentCount: 5,
    status: 'active',
    createdAt: '2024-02-01',
  },
  {
    id: 'sales-2',
    name: '김영업',
    email: 'sales2@aboutconsulting.kr',
    phone: '010-3456-7890',
    region: '충청/대전',
    consultantCount: 1,
    studentCount: 0,
    status: 'active',
    createdAt: '2024-03-01',
  },
];

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    studentId: 'student-1',
    fileName: '오정민_생활기록부_2024.pdf',
    fileSize: 2048000,
    uploadedAt: '2024-06-15',
    status: 'analyzed',
  },
  {
    id: 'doc-2',
    studentId: 'student-2',
    fileName: '김학생_생활기록부_2024.pdf',
    fileSize: 1536000,
    uploadedAt: '2024-06-20',
    status: 'analyzing',
  },
  {
    id: 'doc-3',
    studentId: 'student-3',
    fileName: '이학생_생활기록부_2024.pdf',
    fileSize: 1024000,
    uploadedAt: '2024-07-05',
    status: 'uploaded',
  },
];

// Mock Analysis Results
export const mockAnalysisResults: AnalysisResult[] = [
  {
    id: 'analysis-1',
    documentId: 'doc-1',
    summary: '오정민 학생은 수학과 과학 분야에서 탁월한 성취를 보이고 있으며, 특히 정보 과목에서 두각을 나타내고 있습니다. 동아리 활동과 봉사활동에서도 리더십을 발휘하며 균형 잡힌 학교생활을 하고 있습니다.',
    strengths: [
      '수학, 과학 교과 성적 우수 (1등급 유지)',
      '정보 동아리 회장으로서 리더십 발휘',
      '교내 과학탐구대회 금상 수상',
      '자기주도학습 능력 우수',
      '진로에 대한 명확한 목표 의식',
    ],
    weaknesses: [
      '영어 과목 성적 다소 불안정 (2~3등급)',
      '예체능 분야 활동 부족',
      '교외 활동 경험 제한적',
    ],
    recommendations: [
      '영어 원서 읽기를 통한 영어 실력 향상 권장',
      '소프트웨어 관련 교외 프로그램 참여 추천',
      '과학 분야 심화 탐구 활동 확대',
      '진로와 연계된 봉사활동 지속',
    ],
    subjectAnalysis: [
      { subject: '국어', grade: '2등급', score: 85, feedback: '문학 작품 분석 능력 우수', trend: 'stable' },
      { subject: '수학', grade: '1등급', score: 95, feedback: '미적분, 기하 영역 탁월', trend: 'up' },
      { subject: '영어', grade: '3등급', score: 75, feedback: '독해력 향상 필요', trend: 'down' },
      { subject: '과학', grade: '1등급', score: 92, feedback: '물리, 화학 심화 학습 권장', trend: 'up' },
      { subject: '정보', grade: '1등급', score: 98, feedback: '알고리즘, 코딩 능력 뛰어남', trend: 'stable' },
    ],
    activityAnalysis: [
      {
        category: '동아리',
        title: '코딩 동아리 회장',
        description: '교내 코딩 동아리에서 2년간 회장으로 활동',
        evaluation: '리더십과 전문성 모두 우수하게 발휘',
        score: 95,
      },
      {
        category: '봉사활동',
        title: '교육 봉사',
        description: '지역 아동센터 코딩 교육 봉사 (80시간)',
        evaluation: '진로와 연계된 의미 있는 봉사활동',
        score: 90,
      },
      {
        category: '수상실적',
        title: '과학탐구대회 금상',
        description: '교내 과학탐구대회 금상 수상',
        evaluation: '탐구 능력과 발표력 우수',
        score: 92,
      },
    ],
    overallScore: 88,
    createdAt: '2024-06-20',
  },
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: 'payment-1',
    userId: 'student-1',
    userName: '오정민',
    amount: 500000,
    status: 'completed',
    method: '카드결제',
    createdAt: '2024-06-01',
    description: '기본 컨설팅 패키지',
  },
  {
    id: 'payment-2',
    userId: 'student-2',
    userName: '김학생',
    amount: 300000,
    status: 'completed',
    method: '계좌이체',
    createdAt: '2024-06-15',
    description: '생기부 분석 서비스',
  },
  {
    id: 'payment-3',
    userId: 'student-3',
    userName: '이학생',
    amount: 500000,
    status: 'pending',
    method: '카드결제',
    createdAt: '2024-07-01',
    description: '기본 컨설팅 패키지',
  },
  {
    id: 'payment-4',
    userId: 'student-4',
    userName: '박학생',
    amount: 800000,
    status: 'completed',
    method: '카드결제',
    createdAt: '2024-07-15',
    description: '프리미엄 컨설팅 패키지',
  },
  {
    id: 'payment-5',
    userId: 'student-5',
    userName: '최학생',
    amount: 500000,
    status: 'refunded',
    method: '계좌이체',
    createdAt: '2024-08-01',
    description: '기본 컨설팅 패키지',
  },
];

// Mock Reports
export const mockReports: Report[] = [
  {
    id: 'report-1',
    studentId: 'student-1',
    studentName: '오정민',
    consultantId: 'consultant-1',
    consultantName: '박컨설턴트',
    title: '2024학년도 생활기록부 분석 리포트',
    content: `
# 학생 정보
- 이름: 오정민
- 학교: 서울고등학교
- 학년: 3학년
- 목표 대학: 서울대학교 컴퓨터공학과

# 종합 평가
오정민 학생은 수학과 과학 분야에서 탁월한 성취를 보이고 있으며, 특히 정보 과목에서 두각을 나타내고 있습니다.

# 강점 분석
1. 수학, 과학 교과 성적 우수
2. 정보 동아리 회장으로서 리더십 발휘
3. 교내 과학탐구대회 금상 수상

# 개선 필요 사항
1. 영어 과목 성적 향상 필요
2. 예체능 분야 활동 확대 권장

# 추천 전략
1. 영어 원서 읽기를 통한 영어 실력 향상
2. 소프트웨어 관련 교외 프로그램 참여
    `,
    status: 'published',
    createdAt: '2024-06-25',
    updatedAt: '2024-06-28',
  },
];

// Helper functions to simulate API calls
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate fetching data with delay
export async function fetchMockData<T>(data: T, delayMs: number = 500): Promise<T> {
  await delay(delayMs);
  return data;
}

// Get user by ID
export async function getUserById(id: string): Promise<User | undefined> {
  await delay(300);
  return mockUsers.find(user => user.id === id);
}

// Get students by consultant ID
export async function getStudentsByConsultantId(consultantId: string): Promise<Student[]> {
  await delay(300);
  return mockStudents.filter(student => student.consultantId === consultantId);
}

// Get analysis result by document ID
export async function getAnalysisResultByDocumentId(documentId: string): Promise<AnalysisResult | undefined> {
  await delay(500);
  return mockAnalysisResults.find(result => result.documentId === documentId);
}

// Simulate file upload
export async function uploadDocument(studentId: string, file: File): Promise<Document> {
  await delay(1500);
  const newDoc: Document = {
    id: `doc-${Date.now()}`,
    studentId,
    fileName: file.name,
    fileSize: file.size,
    uploadedAt: new Date().toISOString(),
    status: 'uploaded',
  };
  return newDoc;
}

// Simulate starting analysis
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function startAnalysis(_documentId: string): Promise<{ status: string }> {
  await delay(1000);
  return { status: 'analyzing' };
}
