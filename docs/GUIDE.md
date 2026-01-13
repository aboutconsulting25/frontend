# About Consulting Frontend - 종합 가이드

> AI 기반 입시 컨설팅 플랫폼 프론트엔드 v2.0

---

## 📚 목차

1. [프론트엔드 안내](#1-프론트엔드-안내)
2. [Git 브랜치 관리](#2-git-브랜치-관리)
3. [서버 연결 가이드](#3-서버-연결-가이드)
4. [Vercel 배포 가이드](#4-vercel-배포-가이드)
5. [도메인 설정](#5-도메인-설정)
6. [문제 해결](#6-문제-해결)

---

## 1. 프론트엔드 안내

### 기술 스택

| 기술 | 버전 | 용도 |
|-----|------|-----|
| Next.js | 14.2.x | React 프레임워크 |
| TypeScript | 5.x | 타입 안전성 |
| Tailwind CSS | 3.x | 스타일링 |
| Zustand | 4.x | 상태 관리 |
| Recharts | 2.x | 차트 (성적 분석) |

### 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지
│   │   └── login/         
│   ├── (dashboard)/       # 대시보드 페이지
│   │   └── consultant/    
│   │       ├── page.tsx           # 학생 목록
│   │       ├── register/          # 학생 등록
│   │       └── result/[id]/       # 분석 결과
│   ├── layout.tsx
│   ├── page.tsx           # 랜딩 → 로그인 리다이렉트
│   └── globals.css
│
├── components/
│   └── layout/            # 공통 레이아웃
│       ├── Header.tsx
│       ├── DashboardLayout.tsx
│       └── Footer.tsx
│
├── config/
│   └── index.ts           # 환경 설정 (Mock/Real 전환)
│
├── services/
│   └── api.ts             # API 서비스 (서버 통신)
│
├── types/
│   ├── api.ts             # API 타입 정의
│   └── index.ts
│
├── data/
│   ├── mockData.ts        # 학생 목업 데이터
│   └── mockAnalysis.ts    # 분석 결과 목업
│
└── store/
    └── index.ts           # Zustand 스토어
```

### 주요 페이지

| 경로 | 설명 |
|-----|------|
| `/login` | 로그인 페이지 |
| `/consultant` | 담당 학생 목록 (Empty State 포함) |
| `/consultant/register` | 신규 학생 등록 + PDF 업로드 |
| `/consultant/result/[id]` | 4탭 분석 결과 뷰어 |

### 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

### Mock 모드 vs 서버 연결

`src/config/index.ts`:

```typescript
export const config = {
  api: {
    useMock: true,  // true: 목업 데이터, false: 실제 서버
    // ...
  },
};
```

---

## 2. Git 브랜치 관리

### 기존 main 브랜치를 feature/mvp-v1으로 이동

```bash
# 1. 로컬 저장소로 이동
cd [your-repository]

# 2. 최신 코드 가져오기
git fetch origin
git checkout main
git pull origin main

# 3. 기존 main을 feature/mvp-v1 브랜치로 복사
git checkout -b feature/mvp-v1
git push origin feature/mvp-v1

# 4. main으로 돌아가기
git checkout main
```

### 새 프론트엔드 코드를 main으로 교체

```bash
# 5. 기존 파일 모두 삭제 (.git 제외)
find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} +

# 6. 새 프론트엔드 코드 복사
#    (about-consulting-server-ready.zip 압축 해제 후)
cp -r [새코드경로]/* .
cp -r [새코드경로]/.* . 2>/dev/null || true

# 7. 커밋 및 푸시
git add .
git commit -m "refactor: MVP v2.0 - 서버 연동 준비 완료

- 서버 API 구조에 맞게 전체 리팩토링
- 타입 정의 서버와 동기화
- Mock/Real API 전환 구조
- 4탭 분석 결과 뷰어 구현"

git push origin main
```

### 브랜치 구조 (완료 후)

```
main          ← 새로운 서버 연동 버전 (v2.0)
feature/mvp-v1 ← 기존 코드 백업
```

---

## 3. 서버 연결 가이드

### 서버 API 엔드포인트

| 기능 | 메서드 | 엔드포인트 |
|-----|-------|-----------|
| MVP 원포인트 | POST | `/api/v1/mvp/register-saenggibu/` |
| 생기부 분석 | GET | `/api/v1/documents/{doc_id}/latest-analysis/` |
| 성적 분석 | GET | `/api/v1/grades/student-grade-analysis/?student_id=xxx` |
| 종합 분석 | GET | `/api/v1/reports/{report_id}/comprehensive-analysis/` |

### Step 1: Mock 모드 비활성화

`src/config/index.ts`:

```typescript
export const config = {
  api: {
    useMock: false,  // ← false로 변경
    baseUrl: '/api/v1',
    serverUrl: process.env.NEXT_PUBLIC_API_URL || 'http://13.53.39.217',
    mockDelay: 800,
  },
  // ...
};
```

### Step 2: 환경 변수 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_API_URL=http://13.53.39.217
NEXT_PUBLIC_USE_MOCK_API=false
```

### Step 3: Proxy 설정 (next.config.mjs)

이미 설정됨:

```javascript
async rewrites() {
  const API_SERVER = process.env.NEXT_PUBLIC_API_URL || 'http://13.53.39.217';
  return [
    {
      source: '/api/v1/:path*',
      destination: `${API_SERVER}/api/v1/:path*`,
    },
  ];
}
```

### Step 4: 서버 연결 테스트

```bash
# 서버 상태 확인
curl http://13.53.39.217/api/v1/mvp/register-saenggibu/ -X OPTIONS -v

# Swagger 문서 확인
open http://13.53.39.217/api/docs/

# 프론트엔드 실행 후 테스트
npm run dev
# → 브라우저에서 학생 등록 테스트
```

### CORS 이슈 해결

서버에서 CORS 설정이 필요한 경우:

```python
# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://your-domain.com",
]
```

---

## 4. Vercel 배포 가이드

### Step 1: GitHub 연결

1. [Vercel](https://vercel.com) 로그인
2. "Add New" → "Project"
3. GitHub 저장소 선택
4. "Import"

### Step 2: 빌드 설정

| 설정 | 값 |
|-----|-----|
| Framework Preset | Next.js |
| Root Directory | `.` |
| Build Command | `npm run build` |
| Output Directory | `.next` |

### Step 3: 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `http://13.53.39.217` |
| `NEXT_PUBLIC_USE_MOCK_API` | `false` |

### Step 4: 배포

"Deploy" 버튼 클릭 → 자동 빌드 및 배포

### 자동 배포 (CI/CD)

- `main` 브랜치 푸시 시 자동 배포
- Pull Request 시 Preview 배포 생성

---

## 5. 도메인 설정

### Vercel 도메인 연결

1. Vercel 대시보드 → Project → Settings → Domains
2. "Add" 클릭 → 도메인 입력 (예: `consulting.example.com`)
3. DNS 설정 안내 확인

### DNS 설정 (Gabia 기준)

| 타입 | 호스트 | 값 |
|-----|-------|-----|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

### 기타 도메인 업체

**Cafe24:**
- 도메인 관리 → DNS 설정 → 레코드 추가

**GoDaddy:**
- DNS Management → Add Record

**호스팅KR:**
- 도메인 관리 → 네임서버/DNS → DNS 설정

### SSL 인증서

- Vercel이 자동으로 Let's Encrypt SSL 인증서 발급
- 도메인 연결 후 24시간 내 HTTPS 활성화

### DNS 전파 확인

```bash
# 터미널에서 확인
nslookup consulting.example.com

# 온라인 도구
# https://www.whatsmydns.net/
```

---

## 6. 문제 해결

### 빌드 실패

```bash
# 캐시 삭제 후 재빌드
rm -rf .next node_modules
npm install
npm run build
```

### API 연결 안됨

1. **CORS 에러**: 서버 CORS 설정 확인
2. **Network 에러**: 서버 IP/포트 확인
3. **404 에러**: API 경로 확인 (`/api/v1/...`)

```bash
# 서버 연결 테스트
curl -X POST http://13.53.39.217/api/v1/mvp/register-saenggibu/ \
  -H "Content-Type: multipart/form-data" \
  -F "name=테스트" \
  -F "major_track=SCIENCE" \
  -F "desired_universities=[{\"university\":\"서울대\",\"department\":\"컴공\"}]" \
  -F "file=@test.pdf"
```

### 환경 변수 적용 안됨

- Vercel: 환경 변수 변경 후 **재배포** 필요
- 로컬: `.env.local` 파일 변경 후 **서버 재시작**

### 타입 에러

```bash
# 타입 체크
npx tsc --noEmit
```

---

## 📞 지원

- **서버 API 문서**: http://13.53.39.217/api/docs/
- **Vercel 문서**: https://vercel.com/docs
- **Next.js 문서**: https://nextjs.org/docs
