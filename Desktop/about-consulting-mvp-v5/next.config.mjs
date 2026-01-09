/** @type {import('next').NextConfig} */
const nextConfig = {
  // API 프록시 설정 - 실제 서버가 활성화되면 사용
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://13.53.39.217/:path*',
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
