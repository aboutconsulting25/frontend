/**
 * 환경 설정
 * 
 * API 연동 방법:
 * 1. 실제 백엔드 서버 연동: NEXT_PUBLIC_USE_MOCK_API=false 환경변수 설정
 * 2. Mock 모드 (개발용): 기본값으로 Mock 사용
 * 
 * 백엔드 서버 실행:
 * cd server-main/backend && python manage.py runserver 0.0.0.0:8000
 */

export const config = {
  // API 설정
  api: {
    // Mock 모드 여부 (환경변수로 제어, 기본값: true)
    // 실제 서버 연동 시: NEXT_PUBLIC_USE_MOCK_API=false
    useMock: process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false',
    
    // API 기본 URL - 실제 서버 연동 시 직접 호출
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    
    // 실제 서버 URL (배포 환경)
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://13.53.39.217',
    
    // Mock 지연 시간 (ms)
    mockDelay: 400,
  },
  
  // 앱 정보
  app: {
    name: 'About Consulting',
    version: '2.0.0',
    description: 'AI 기반 입시 컨설팅 플랫폼',
  },
} as const;

// 타입 내보내기
export type Config = typeof config;
