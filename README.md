# About Consulting - AI 생활기록부 분석 플랫폼

AI 기반 고등학교 생활기록부 분석 및 컨설팅 플랫폼입니다.

## 프로젝트 개요

학생의 생활기록부를 AI(RAG 모델)가 분석하고, 컨설턴트가 검토/수정한 뒤 최종 리포트를 PDF로 제공하는 서비스입니다.

## 기술 스택

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **PDF Export:** html2canvas + jspdf
- **Icons:** Lucide React

## 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 인증 관련 라우트
│   │   └── login/               # 로그인 페이지
│   ├── (dashboard)/             # 대시보드 라우트
│   │   ├── admin/              # 관리자 대시보드
│   │   ├── sales-manager/      # 영업관리자 대시보드
│   │   ├── consultant/         # 컨설턴트 대시보드
│   │   │   └── [studentId]/    # 학생 상세 페이지
│   │   └── student/            # 학생 대시보드
│   ├── globals.css             # 전역 스타일
│   ├── layout.tsx              # 루트 레이아웃
│   └── page.tsx                # 루트 페이지 (리다이렉트)
├── components/                   # 재사용 컴포넌트
│   ├── common/                  # 공통 UI 컴포넌트
│   │   ├── Button.tsx          # 버튼 컴포넌트
│   │   ├── Input.tsx           # 인풋 컴포넌트
│   │   ├── Card.tsx            # 카드 컴포넌트
│   │   └── Badge.tsx           # 배지/상태 컴포넌트
│   ├── dashboard/               # 대시보드 전용 컴포넌트
│   │   └── StatCard.tsx        # 통계 카드
│   ├── forms/                   # 폼 관련 컴포넌트
│   │   └── FileUpload.tsx      # 파일 업로드
│   ├── layout/                  # 레이아웃 컴포넌트
│   │   ├── DashboardLayout.tsx # 대시보드 레이아웃
│   │   ├── Header.tsx          # 헤더
│   │   └── Sidebar.tsx         # 사이드바
│   └── tables/                  # 테이블 컴포넌트
│       └── DataTable.tsx       # 데이터 테이블
├── data/                         # 데이터
│   └── mockData.ts             # Mock 데이터
├── hooks/                        # 커스텀 훅
├── lib/                          # 유틸리티
│   └── utils.ts                # 유틸리티 함수
├── store/                        # 상태 관리
│   └── authStore.ts            # 인증 스토어 (Zustand)
└── types/                        # TypeScript 타입
    └── index.ts                # 타입 정의
```

## 사용자 역할

| 역할 | 설명 | 주요 기능 |
|------|------|----------|
| **Admin** | 시스템 관리자 | 전체 회원 관리, 결제 관리, 시스템 설정 |
| **Sales Manager** | 영업 관리자 | 컨설턴트 관리, 학생 현황 모니터링 |
| **Consultant** | 컨설턴트 | 학생 관리, 생기부 분석 결과 검토/수정, 리포트 작성 |
| **Student** | 학생 | 생기부 업로드, 분석 결과 조회, 리포트 다운로드 |

## 시작하기

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 테스트 계정

모든 계정의 비밀번호: `password123`

| 역할 | 이메일 |
|------|--------|
| 관리자 | admin@aboutconsulting.kr |
| 영업관리자 | sales@aboutconsulting.kr |
| 컨설턴트 | consultant@aboutconsulting.kr |
| 학생 | jungmin@student.kr |

## 주요 화면

### 1. 로그인 페이지
- 이메일/비밀번호 로그인
- 테스트 계정 빠른 선택 기능

### 2. 관리자 대시보드
- 전체 통계 (회원 수, 결제 현황 등)
- 최근 결제 내역
- 회원 목록

### 3. 영업관리자 대시보드
- 담당 컨설턴트 목록
- 학생 현황 테이블
- 실적 현황

### 4. 컨설턴트 대시보드
- 담당 학생 목록
- 학생별 분석 상태 관리
- 학생 상세 페이지:
  - 기본 정보 조회
  - 생기부 업로드
  - AI 분석 결과 확인/수정
  - PDF 리포트 내보내기

### 5. 학생 대시보드
- 생기부 업로드
- 진행 상황 타임라인
- 분석 결과 요약
- 리포트 다운로드

## 핵심 기능

### 파일 업로드
- 드래그 앤 드롭 지원
- 파일 유효성 검사 (크기, 형식)
- 업로드 상태 표시

### AI 분석 결과 뷰어
- 종합 점수 표시
- 강점/약점 분석
- 교과별 분석 테이블
- 추천 사항

### 리포트 에디터
- 분석 결과 직접 수정
- 실시간 미리보기
- PDF 내보내기 (html2canvas + jspdf)

## API 연동 준비

현재 Mock 데이터를 사용 중입니다. 아래 데이터 실제 API로 교체 예정

- `src/data/mockData.ts` - Mock 함수들을 실제 API 호출로 교체
- `src/store/authStore.ts` - 로그인 로직을 실제 API로 교체

## 디자인 시스템

### 색상
- Primary: Blue (#2563EB)
- Background: Gray (#F9FAFB)
- Text: Gray-900 (#111827)
