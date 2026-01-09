import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'About Consulting - AI 생기부 분석 서비스',
  description: '학생의 생활기록부를 AI가 분석하고, 전문 컨설턴트가 맞춤형 리포트를 제공합니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-neutral-50">{children}</body>
    </html>
  );
}
