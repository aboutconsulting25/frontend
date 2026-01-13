'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/consultant', label: '컨설턴트' },
    { href: '/consultant', label: '학생 관리' },
    { href: '#', label: '입시 정보' },
  ];

  return (
    <header className="h-[60px] bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="h-full max-w-[1280px] mx-auto px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/consultant" className="flex items-center">
          <Image
            src="/images/logo-black.png"
            alt="About Consulting"
            width={100}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Center Navigation */}
        <nav className="flex items-center gap-12">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-[15px] font-medium transition-colors ${
                pathname === item.href
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <span className="text-[14px] text-gray-700 font-medium">
            {user?.name || '김대표'} 원장님
          </span>
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user?.profileImage ? (
              <Image src={user.profileImage} alt="Profile" width={36} height={36} />
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 text-[13px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
