# About Consulting Frontend v2.0

> AI 기반 입시 컨설팅 플랫폼 - 서버 연동 준비 완료

## 🚀 Quick Start

```bash
# 설치
npm install

# 개발 서버 (Mock 모드)
npm run dev

# 빌드
npm run build
```

## 📋 주요 기능

- ✅ 학생 등록 및 생기부 PDF 업로드
- ✅ AI 분석 결과 4탭 뷰어 (생기부 원본/분석, 성적, 종합)
- ✅ 분석 결과 PDF 다운로드
- ✅ 서버 API 연동 준비 완료 (Mock/Real 전환)

## 🔧 서버 연결

```typescript
// src/config/index.ts
export const config = {
  api: {
    useMock: false,  // false로 변경하면 실제 서버 연결
    serverUrl: 'http://13.53.39.217',
  },
};
```

## 📖 문서

상세한 가이드는 [`docs/GUIDE.md`](./docs/GUIDE.md)를 참조하세요:

- 프론트엔드 구조 안내
- Git 브랜치 관리
- 서버 연결 방법
- Vercel 배포 가이드
- 도메인 설정

## 🛠 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (상태 관리)
- Recharts (차트)

## 📁 프로젝트 구조

```
src/
├── app/          # 페이지 (login, consultant, result)
├── components/   # 공통 컴포넌트
├── config/       # 환경 설정
├── services/     # API 서비스
├── types/        # TypeScript 타입
├── data/         # Mock 데이터
└── store/        # Zustand 스토어
```

## 📝 License

Private - About Consulting
