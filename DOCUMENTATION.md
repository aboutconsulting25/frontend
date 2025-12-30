# About Consulting - 프론트엔드 개발 문서

## Intro...

**About Consulting**은 AI 기반 생활기록부 분석 서비스입니다.  
학생이 생기부를 업로드하면 AI가 분석하고, 컨설턴트가 리포트를 작성하여 전달합니다.

---

## 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 14.x |
| 언어 | TypeScript | 5.x |
| 스타일링 | Tailwind CSS | 3.x |
| 상태관리 | Zustand | 4.x |
| PDF 생성 | html2canvas + jspdf | - |
| 아이콘 | Lucide React | - |

---

## 디렉토리 구조

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 인증 관련 페이지
│   │   └── login/
│   ├── (dashboard)/              # 대시보드 페이지들
│   │   ├── admin/                # 관리자
│   │   ├── sales-manager/        # 영업관리자
│   │   ├── representative/       # 대표컨설턴트
│   │   ├── consultant/           # A컨설턴트
│   │   └── student/              # 학생
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # 루트 (리다이렉트)
│
├── components/
│   ├── common/                   # 공통 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── dashboard/
│   │   └── StatCard.tsx
│   ├── forms/
│   │   └── FileUpload.tsx
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── tables/
│       └── DataTable.tsx
│
├── data/
│   └── mockData.ts               # Mock 데이터 + API 시뮬레이션
│
├── hooks/                        # 커스텀 훅 (추후 확장)
│
├── lib/
│   └── utils.ts                  # 유틸리티 함수
│
├── store/
│   └── authStore.ts              # Zustand 인증 상태
│
├── types/
│   └── index.ts                  # TypeScript 타입 정의
│
└── public/
    └── images/
        ├── logo.png              # 시그니처 로고
        ├── logo-black.png        # 흑백 로고
        └── logo-white.png        # 흰색 로고
```

---

## 페이지 목록 (총 18개)

### 공통
| 경로 | 설명 |
|------|------|
| `/login` | 로그인 페이지 |

### 관리자 (Admin)
| 경로 | 설명 |
|------|------|
| `/admin` | 대시보드 - 통계, 결제내역, 회원목록 |
| `/admin/users` | 회원 관리 - 검색, 필터, 추가/수정/삭제 |
| `/admin/payments` | 결제 관리 - 결제 내역 조회 |
| `/admin/settings` | 시스템 설정 - 일반/알림/보안/데이터/이메일 |

### 영업관리자 (Sales Manager)
| 경로 | 설명 |
|------|------|
| `/sales-manager` | 대시보드 - 컨설턴트/학생 탭 전환 |

### 대표컨설턴트 (Representative)
| 경로 | 설명 |
|------|------|
| `/representative` | 대시보드 - 컨설턴트 관리, 학생 배정 |

### A컨설턴트 (Consultant)
| 경로 | 설명 |
|------|------|
| `/consultant` | 대시보드 - 담당 학생 목록, 상태별 통계 |
| `/consultant/students` | 학생 관리 - 학생 검색/필터 |
| `/consultant/analysis` | 분석 관리 - 생기부 분석 현황 |
| `/consultant/reports` | 리포트 관리 - 리포트 목록/상태 |
| `/consultant/[studentId]` | 학생 상세 - 기본정보/업로드/분석결과/리포트 |

### 학생 (Student)
| 경로 | 설명 |
|------|------|
| `/student` | 대시보드 - 진행 상황 타임라인 |
| `/student/upload` | 생기부 업로드 - 드래그앤드롭 |
| `/student/results` | 분석 결과 - AI 분석 내용 조회 |
| `/student/reports` | 리포트 조회 - PDF 다운로드 |

---

## 인증 시스템

### 역할 (Role)
```typescript
type UserRole = 'admin' | 'sales_manager' | 'consultant' | 'student';
```

### 라우팅
- 로그인 성공 시 역할에 맞는 대시보드로 자동 이동
- 사이드바 메뉴는 역할에 따라 자동 필터링
- 미인증 접근 시 `/login`으로 리다이렉트

### 테스트 계정
| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| 관리자 | admin@aboutconsulting.kr | password123 |
| 영업관리자 | sales@aboutconsulting.kr | password123 |
| 컨설턴트 | consultant@aboutconsulting.kr | password123 |
| 학생 | jungmin@student.kr | password123 |

---

## 공통 컴포넌트

### Button
```tsx
<Button variant="default" size="md" isLoading={false}>
  버튼
</Button>
```
- variant: `default` | `outline` | `ghost` | `secondary` | `destructive`
- size: `sm` | `md` | `lg`

### Input
```tsx
<Input label="이름" placeholder="입력하세요" error="에러 메시지" />
```

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
  </CardHeader>
  <CardContent>내용</CardContent>
</Card>
```

### Badge / StatusBadge
```tsx
<StatusBadge status="completed" />  // 완료 (초록)
<StatusBadge status="pending" />    // 대기중 (노랑)
<StatusBadge status="analyzing" />  // 분석중 (파랑)
```

### DataTable
```tsx
<DataTable
  columns={[
    { key: 'name', title: '이름' },
    { key: 'status', title: '상태', render: (v) => <Badge>{v}</Badge> }
  ]}
  data={items}
  onRowClick={(row) => console.log(row)}
/>
```

### FileUpload
```tsx
<FileUpload
  onFileSelect={(file) => console.log(file)}
  onUpload={async (file) => await uploadFile(file)}
  accept=".pdf"
  maxSize={20 * 1024 * 1024}  // 20MB
/>
```

---

## 데이터 타입

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
  createdAt: string;
}
```

### Student
```typescript
interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  grade: number;
  targetUniversity?: string;
  targetMajor?: string;
  consultantId: string;
  status: 'pending' | 'analyzing' | 'completed' | 'reviewed';
  createdAt: string;
}
```

### Document
```typescript
interface Document {
  id: string;
  studentId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: 'uploaded' | 'analyzing' | 'analyzed';
}
```

### AnalysisResult
```typescript
interface AnalysisResult {
  id: string;
  studentId: string;
  documentId: string;
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  subjectAnalysis: SubjectAnalysis[];
  activityAnalysis: ActivityAnalysis[];
  recommendations: string[];
  createdAt: string;
}
```

---

## API 연동

### 현재 status
- `src/data/mockData.ts`에서 Mock 데이터 반환
- 실제 API와 동일한 인터페이스로 설계됨

### 연동
`mockData.ts`의 함수들을 실제 API 호출로 교체:

```typescript
// Before (Mock)
export async function getStudentsByConsultantId(consultantId: string) {
  await delay(300);
  return mockStudents.filter(s => s.consultantId === consultantId);
}

// After (실제 API)
export async function getStudentsByConsultantId(consultantId: string) {
  const response = await fetch(`/api/consultants/${consultantId}/students`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}
```

### 필요한 API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/login` | 로그인 |
| GET | `/api/users` | 회원 목록 |
| GET | `/api/students` | 학생 목록 |
| GET | `/api/consultants/:id/students` | 컨설턴트별 학생 |
| POST | `/api/documents/upload` | 파일 업로드 |
| GET | `/api/analysis/:studentId` | 분석 결과 |
| PUT | `/api/analysis/:id` | 분석 결과 수정 |
| GET | `/api/reports/:id` | 리포트 조회 |
| GET | `/api/payments` | 결제 내역 |

---

## 실행 방법

### 개발 서버
```bash
npm install
npm run dev
# http://localhost:3000
```

### 빌드
```bash
npm run build
npm start
```

### 환경 변수 (추후 필요)
```env
NEXT_PUBLIC_API_URL=https://api.aboutconsulting.kr
```

---

## 추후 작업 목록

### API 연동 시
- [ ] 인증 API 연결 (로그인/로그아웃/토큰 갱신)
- [ ] 각 페이지 API 연결
- [ ] 에러 핸들링 (401, 403, 500 등)
- [ ] 로딩 상태 개선
- [ ] 파일 업로드 연동

### 개선 사항
- [ ] 반응형 최적화 (모바일/태블릿)
- [ ] 다크모드 지원
- [ ] 알림 기능 (웹소켓/SSE)
- [ ] 국제화 (i18n)
- [ ] E2E 테스트 추가

---

## 담당자

| 파트 | 담당 |
|------|------|
| 프론트엔드 | 재은 |
| 백엔드 | 혜교 |
| AI | 이나, 태인 |
| 기획 | 정민 |

---

## 버전 히스토리

| 버전 | 날짜 | 내용 |
|------|------|------|
| 0.1.0 | 2025-12-27 | 초기 개발 완료 (18페이지) |
| 0.1.1 | 2025-12-30 | 로고 적용, 푸터 추가, 문서화 |

---

*마지막 업데이트: 2025-12-30*
