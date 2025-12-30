'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Image
              src="/images/logo-white.png"
              alt="About Consulting"
              width={120}
              height={32}
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              AI 기반 생활기록부 분석 서비스로 학생들의 진로 설계와 
              대입 컨설팅을 지원합니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">서비스</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  생기부 분석
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  컨설팅 서비스
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  리포트 발급
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">고객센터</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-400">이메일</span>
                <p className="text-white">contact@aboutconsulting.kr</p>
              </li>
              <li>
                <span className="text-gray-400">운영시간</span>
                <p className="text-white">평일 09:00 - 18:00</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} About Consulting. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
              이용약관
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
