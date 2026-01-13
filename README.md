# About Consulting Frontend v2.0

> AI 기반 입시 컨설팅 플랫폼 - 실제 서버 연동 지원

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
- ✅ 희망 대학/학과 6개 등록
- ✅ 분석 결과 PDF 다운로드
- ✅ 실제 백엔드 API 연동 지원

## 🔧 실제 API 연동 (시연용)

### 1. 백엔드 서버 실행

```bash
cd server-main/backend

# 가상환경 설정
python -m venv venv
source venv/bin/activate

# 의존성 설치
pip install -r requirements/development.txt

# DB 마이그레이션 및 서버 실행
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### 2. 환경변수 설정

`.env.example`을 `.env.local`로 복사:

```bash
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. 시연 흐름

1. http://localhost:3000/consultant 접속
2. "생활기록부 등록하기" 버튼 클릭
3. 학생 정보 및 생기부 PDF 업로드
4. AI 분석 결과 확인 (생기부/성적/종합)

## 📡 API 엔드포인트

| 기능 | 메서드 | 엔드포인트 |
|------|--------|-----------|
| 생기부 등록 | POST | `/api/v1/mvp/register-saenggibu/` |
| 생기부 분석 | GET | `/api/v1/documents/{id}/latest-analysis/` |
| 성적 분석 | GET | `/api/v1/grades/student-grade-analysis/` |
| 종합 분석 | GET | `/api/v1/reports/{id}/comprehensive-analysis/` |

## 📖 문서

상세한 가이드는 [`docs/GUIDE.md`](./docs/GUIDE.md)를 참조하세요.

## 🛠 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (상태 관리)

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
