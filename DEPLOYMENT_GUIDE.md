# 🚀 About Consulting MVP - 완전 배포 가이드

---

## 📑 목차

1. [Git Branch 기존 프로젝트 대체](#1-git-branch-기존-프로젝트-대체)
2. [백엔드 서버 연결](#2-백엔드-서버-연결)
3. [Vercel 배포 및 도메인 연결](#3-vercel-배포-및-도메인-연결)

---

## 1. Git Branch 기존 프로젝트 대체

### 방법 A: 기존 브랜치 완전 대체 (권장)

```bash
# 1. 기존 프로젝트 폴더로 이동
cd your-existing-project

# 2. 현재 상태 백업 (선택사항)
git branch backup-$(date +%Y%m%d)

# 3. 기존 파일 모두 삭제 (.git 폴더 제외)
#    Windows PowerShell:
Get-ChildItem -Exclude .git | Remove-Item -Recurse -Force

#    Mac/Linux:
find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} +

# 4. 새 프로젝트 파일 복사
#    다운로드한 zip 파일 압축 해제 후 모든 파일을 이 폴더로 복사

# 5. 변경사항 확인
git status

# 6. 모든 변경사항 스테이징
git add .

# 7. 커밋
git commit -m "refactor: Figma 디자인 기반 전체 리팩토링 v2.0"

# 8. 원격 저장소에 푸시
git push origin main
```

### 방법 B: 새 브랜치 생성 후 병합

```bash
# 1. 기존 프로젝트 폴더로 이동
cd your-existing-project

# 2. 새 브랜치 생성
git checkout -b feature/figma-refactor

# 3. 기존 파일 삭제 (.git 제외)
find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} +

# 4. 새 파일 복사 (zip 압축 해제 후)

# 5. 커밋
git add .
git commit -m "refactor: Figma 디자인 기반 전체 리팩토링"

# 6. 새 브랜치 푸시
git push origin feature/figma-refactor

# 7. GitHub에서 Pull Request 생성 또는 직접 병합
git checkout main
git merge feature/figma-refactor
git push origin main
```

### 방법 C: 새 레포지토리로 시작

```bash
# 1. 새 폴더 생성
mkdir about-consulting-v2
cd about-consulting-v2

# 2. zip 파일 압축 해제

# 3. Git 초기화
git init
git add .
git commit -m "init: About Consulting MVP v2.0"

# 4. 새 GitHub 레포지토리 생성 후 연결
git remote add origin https://github.com/YOUR_USERNAME/about-consulting-v2.git
git branch -M main
git push -u origin main
```

---

## 2. 백엔드 서버 연결

### 2.1 현재 구조 이해

```
[브라우저] → [Next.js 서버 (Proxy)] → [백엔드 서버]
   ↓              ↓                        ↓
localhost:3000  /api/*              http://13.53.39.217
```

**왜 Proxy가 필요한가?**
- 브라우저의 CORS 정책 때문에 다른 도메인으로 직접 요청 불가
- Next.js가 중간에서 대신 요청을 전달

### 2.2 설정 파일들

#### `next.config.mjs` (이미 설정됨)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://13.53.39.217/:path*', // 백엔드 서버
      },
    ];
  },
};

export default nextConfig;
```

#### `src/services/api.ts` (Mock/Real 전환)

```typescript
// 🔵 데모 모드 (Mock 데이터 사용)
export const USE_MOCK_API = true;

// 🟢 실제 서버 연결
export const USE_MOCK_API = false;
```

### 2.3 실제 서버 연결 방법

#### Step 1: Mock 모드 비활성화

```typescript
// src/services/api.ts 파일 열기
export const USE_MOCK_API = false;  // true → false로 변경
```

#### Step 2: 서버 주소 확인

```javascript
// next.config.mjs
destination: 'http://13.53.39.217/:path*'  // 실제 백엔드 주소
```

#### Step 3: 환경 변수로 관리 (권장)

1. `.env.local` 파일 생성:
```env
NEXT_PUBLIC_API_URL=http://13.53.39.217
```

2. `next.config.mjs` 수정:
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

### 2.4 API 엔드포인트 정리

| 기능 | Method | Endpoint | 설명 |
|-----|--------|----------|------|
| 로그인 | POST | `/api/auth/login/` | 이메일/비밀번호 |
| 학생 생성 | POST | `/api/students/` | 학생 정보 등록 |
| 대학 추가 | POST | `/api/students/{id}/universities/` | 희망 대학 등록 |
| 문서 업로드 | POST | `/api/documents/upload/` | PDF 업로드 |
| 분석 시작 | POST | `/api/documents/{id}/analyze/` | AI 분석 요청 |
| 결과 조회 | GET | `/api/analysis/{id}/` | 분석 결과 조회 |

### 2.5 서버 연결 테스트

```bash
# 백엔드 서버 상태 확인
curl http://13.53.39.217/health

# 로그인 테스트
curl -X POST http://13.53.39.217/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 2.6 트러블슈팅

#### CORS 에러
```
Access to fetch has been blocked by CORS policy
```
**해결**: API 호출 시 `/api/...` 형식 사용 확인

#### 연결 실패
```
ECONNREFUSED 또는 Network Error
```
**해결**: 
1. 백엔드 서버 실행 상태 확인
2. `USE_MOCK_API = true`로 변경하여 데모 모드로 테스트

---

## 3. Vercel 배포 및 도메인 연결

### 3.1 Vercel 배포

#### Step 1: GitHub에 코드 푸시
```bash
git add .
git commit -m "deploy: production ready"
git push origin main
```

#### Step 2: Vercel 연결

1. [vercel.com](https://vercel.com) 접속 및 로그인
2. **"Add New → Project"** 클릭
3. GitHub 저장소 선택 → **"Import"**

#### Step 3: 프로젝트 설정

| 설정 | 값 |
|-----|-----|
| Framework Preset | Next.js (자동 감지) |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `.next` |

#### Step 4: 환경 변수 설정

**Settings → Environment Variables**에서 추가:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `http://13.53.39.217` |

#### Step 5: 배포
**"Deploy"** 버튼 클릭 → 완료!

배포 URL 예시: `https://your-project.vercel.app`

---

### 3.2 커스텀 도메인 연결

#### Step 1: Vercel에서 도메인 추가

1. Vercel 프로젝트 → **Settings** → **Domains**
2. 도메인 입력 (예: `aboutconsulting.co.kr`)
3. **"Add"** 클릭

#### Step 2: DNS 설정 안내 확인

Vercel이 필요한 DNS 레코드를 알려줍니다:

```
A Record:     @ → 76.76.21.21
CNAME Record: www → cname.vercel-dns.com
```

---

### 3.3 도메인 업체별 DNS 설정

#### 가비아 (Gabia)

1. [가비아](https://www.gabia.com) 로그인
2. **My가비아** → **도메인 관리** → 해당 도메인 선택
3. **DNS 관리** → **DNS 설정**
4. 레코드 추가:

| 타입 | 호스트 | 값 |
|-----|-------|-----|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

5. **확인** 클릭

#### 카페24

1. [카페24](https://www.cafe24.com) 로그인
2. **나의서비스관리** → **도메인 관리**
3. 해당 도메인 → **네임서버/DNS 관리** → **DNS 관리**
4. 레코드 추가 (위와 동일)

#### GoDaddy

1. [GoDaddy](https://www.godaddy.com) 로그인
2. **My Products** → 도메인 선택 → **DNS**
3. **Add Record** 클릭하여 레코드 추가

#### 호스팅케이알

1. [호스팅케이알](https://www.hosting.kr) 로그인
2. **도메인 관리** → 해당 도메인 → **DNS 설정**
3. 레코드 추가

---

### 3.4 SSL 인증서 (자동)

✅ Vercel이 **자동으로 Let's Encrypt SSL 인증서**를 발급합니다.
- 별도 설정 불필요
- 도메인 연결 후 몇 분 내 HTTPS 활성화

---

### 3.5 배포 후 체크리스트

- [ ] `https://your-domain.com` 접속 확인
- [ ] 로그인 기능 테스트
- [ ] 학생 등록 플로우 테스트
- [ ] 분석 결과 페이지 확인
- [ ] PDF 다운로드 테스트
- [ ] 모바일 반응형 확인

---

## 📞 문제 해결

### DNS 전파 대기

도메인 설정 후 **최대 24~48시간** 소요될 수 있습니다.

확인 방법:
```bash
# DNS 전파 확인
nslookup your-domain.com

# 또는 온라인 도구
# https://www.whatsmydns.net/
```

### Vercel 빌드 실패

```bash
# 로컬에서 먼저 빌드 테스트
npm run build

# 에러 확인 후 수정
```

### API 연결 실패 (Production)

Vercel 환경에서는 `rewrites`가 서버리스 함수로 동작합니다.
백엔드 서버가 **HTTPS**가 아니면 Mixed Content 에러 발생 가능.

**해결 방법**:
1. 백엔드에 SSL 인증서 설정
2. 또는 별도의 API Gateway 사용

---

## 🎉 완료!

이제 프로젝트가 성공적으로 배포되었습니다.

- **로컬 개발**: `npm run dev`
- **프로덕션**: `https://your-domain.com`

문의사항이 있으시면 언제든 말씀해주세요!
