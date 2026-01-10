/**
 * 환경 설정
 * 
 * 서버 연결 설정을 관리합니다.
 */

export const config = {
  // API 설정
  api: {
    // Mock 모드 여부 (true: 목업 데이터, false: 실제 서버)
    useMock: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || true,
    
    // API 기본 URL (next.config.mjs에서 프록시됨)
    baseUrl: '/api/v1',
    
    // 실제 서버 URL (프록시 대상)
    serverUrl: process.env.NEXT_PUBLIC_API_URL || 'http://13.53.39.217',
    
    // Mock 지연 시간 (ms)
    mockDelay: 800,
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
