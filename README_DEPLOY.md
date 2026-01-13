# 📚 About Consulting MVP - 배포 가이드

이 문서는 About Consulting MVP 프로젝트의 **서버 연결**, **Vercel 배포**, **도메인 연결** 방법을 설명합니다.

---

## 📁 목차

1. [프로젝트 구조](#1-프로젝트-구조)
2. [로컬 개발 환경 설정](#2-로컬-개발-환경-설정)
3. [서버 연결 (Proxy 설정)](#3-서버-연결-proxy-설정)
4. [Vercel 배포](#4-vercel-배포)
5. [커스텀 도메인 연결](#5-커스텀-도메인-연결)
6. [트러블슈팅](#6-트러블슈팅)

---

## 1. 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/login/       # 로그인 페이지
│   └── (dashboard)/        # 대시보드 페이지들
│       └── consultant/
│           ├── page.tsx          # 대시보드 메인
│           ├── register/         # 학생 등록
│           └── result/[id]/      # 분석 결과
├── components/             # 재사용 컴포넌트
├── services/
│   └── api.ts              # API 서비스 (Mock/Real 전환 가능)
├── store/                  # Zustand 상태 관리
└── types/                  # TypeScript 타입 정의
```

---

## 2. 로컬 개발 환경 설정

### 2.1 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 2.2 Mock 모드 vs Real API 모드

`src/services/api.ts` 파일에서 모드를 전환합니다:

```typescript
// Mock 데이터 사용 (데모/개발용)
export const USE_MOCK_API = true;

// 실제 백엔드 연결 (프로덕션)
export const USE_MOCK_API = false;
```

---

## 3. 서버 연결 (Proxy 설정)

### 3.1 프록시가 필요한 이유

브라우저의 **CORS 정책** 때문에 프론트엔드(`localhost:3000`)에서 직접 백엔드(`http://13.53.39.217`)로 요청하면 차단됩니다.

**해결책:** Next.js의 `rewrites` 기능으로 프록시 설정

### 3.2 next.config.mjs 설정

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://13.53.39.217/:path*', // 백엔드 서버 주소
      },
    ];
  },
};

export default nextConfig;
```

### 3.3 환경 변수 설정 (선택)

`.env.local` 파일을 생성하여 환경별로 백엔드 URL을 관리할 수 있습니다:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://13.53.39.217
```

그리고 `next.config.mjs`를 수정:

```javascript
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://13.53.39.217'}/:path*`,
      },
    ];
  },
};
```

### 3.4 API 호출 방식

프론트엔드 코드에서는 항상 **상대 경로**로 API를 호출합니다:

```typescript
// ✅ 올바른 방법 (프록시를 통해 호출)
fetch('/api/auth/login/', { method: 'POST', body: ... })

// ❌ 잘못된 방법 (CORS 에러 발생)
fetch('http://13.53.39.217/auth/login/', { method: 'POST', body: ... })
```

---

## 4. Vercel 배포

### 4.1 사전 준비

1. [Vercel 계정](https://vercel.com) 생성
2. GitHub에 프로젝트 푸시
3. GitHub 계정을 Vercel에 연결

### 4.2 배포 단계

#### Step 1: 새 프로젝트 생성

1. Vercel 대시보드에서 **"Add New → Project"** 클릭
2. GitHub 저장소 선택
3. **"Import"** 클릭

#### Step 2: 프로젝트 설정

| 설정 항목 | 값 |
|---------|-----|
| Framework Preset | Next.js |
| Root Directory | `./` (기본값) |
| Build Command | `npm run build` |
| Output Directory | `.next` (자동 감지) |

#### Step 3: 환경 변수 설정

**Settings → Environment Variables**에서 추가:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `http://13.53.39.217` |

#### Step 4: 배포

**"Deploy"** 버튼 클릭 → 빌드 로그 확인 → 완료!

### 4.3 자동 배포

GitHub에 푸시하면 Vercel이 자동으로 재배포합니다:

- `main` 브랜치 → Production 배포
- 다른 브랜치 → Preview 배포

---

## 5. 커스텀 도메인 연결

### 5.1 Vercel에서 도메인 추가

1. **Settings → Domains**로 이동
2. 도메인 입력 (예: `about-consulting.com`)
3. **"Add"** 클릭

### 5.2 DNS 설정 (도메인 구매처에서)

#### A 레코드 설정 (Apex 도메인용)

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |

#### CNAME 설정 (서브도메인용)

| Type | Name | Value |
|------|------|-------|
| CNAME | www | `cname.vercel-dns.com` |

### 5.3 주요 도메인 업체별 설정 방법

#### 가비아 (Gabia)

1. 가비아 로그인 → **My가비아** → **도메인 관리**
2. 해당 도메인 클릭 → **DNS 관리** → **DNS 설정**
3. 레코드 추가:
   - 타입: A, 호스트: @, 값: 76.76.21.21
   - 타입: CNAME, 호스트: www, 값: cname.vercel-dns.com

#### GoDaddy

1. GoDaddy 로그인 → **My Products** → **도메인 관리**
2. **DNS** → **Manage Zones**
3. 레코드 추가 (위와 동일)

### 5.4 SSL 인증서

Vercel이 자동으로 **Let's Encrypt SSL 인증서**를 발급합니다. 별도 설정 불필요!

---

## 6. 트러블슈팅

### 6.1 CORS 에러

**증상:**
```
Access to fetch at 'http://13.53.39.217/...' has been blocked by CORS policy
```

**해결:**
1. `next.config.mjs`의 `rewrites` 설정 확인
2. API 호출 시 `/api/...` 형식 사용 확인
3. 개발 서버 재시작: `npm run dev`

### 6.2 API 연결 실패

**증상:**
```
API Error: 500 / Network Error
```

**해결:**
1. 백엔드 서버 상태 확인: `curl http://13.53.39.217/health`
2. `USE_MOCK_API = true`로 전환하여 Mock 데이터로 테스트
3. 백엔드 팀에 서버 상태 문의

### 6.3 Vercel 빌드 실패

**증상:**
```
Build failed: Module not found
```

**해결:**
1. 로컬에서 `npm run build` 실행하여 에러 확인
2. `package.json` 의존성 확인
3. TypeScript 에러 수정

### 6.4 도메인 연결 안됨

**증상:**
DNS 설정 후에도 도메인 접속 불가

**해결:**
1. DNS 전파 대기 (최대 48시간 소요)
2. DNS 확인: `nslookup your-domain.com`
3. Vercel Dashboard에서 도메인 상태 확인 (Valid/Invalid)

---

## 📞 지원

문제가 해결되지 않으면:

1. **GitHub Issues**에 문제 등록
2. **Vercel Support** 문의
3. 개발팀 Slack 채널 문의

---

**마지막 업데이트:** 2024년 1월
