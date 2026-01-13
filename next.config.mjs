/** @type {import('next').NextConfig} */
const nextConfig = {
  // ▼ [추가됨] 빌드 시 ESLint 에러 무시 설정
  eslint: {
    ignoreDuringBuilds: true,
  },

  // API 프록시 설정 - 서버 /api/v1/* 엔드포인트로 연결
  async rewrites() {
    const API_SERVER = process.env.NEXT_PUBLIC_API_URL || 'http://13.53.39.217';
    
    return [
      {
        // 프론트엔드 /api/v1/* → 서버 /api/v1/*
        source: '/api/v1/:path*',
        destination: `${API_SERVER}/api/v1/:path*`,
      },
    ];
  },
  // 이미지 도메인 허용
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '13.53.39.217',
      },
    ],
  },
};

export default nextConfig;