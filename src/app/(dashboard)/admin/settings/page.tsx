'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import {
  Settings,
  Bell,
  Shield,
  Database,
  Mail,

  Save,
  RefreshCw,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const tabs = [
    { id: 'general', label: '일반 설정', icon: Settings },
    { id: 'notification', label: '알림 설정', icon: Bell },
    { id: 'security', label: '보안 설정', icon: Shield },
    { id: 'data', label: '데이터 관리', icon: Database },
    { id: 'email', label: '이메일 설정', icon: Mail },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">시스템 설정</h1>
          <p className="text-gray-500 mt-1">시스템 환경을 설정합니다</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 bg-white rounded-lg border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">일반 설정</h2>
                
                <div className="space-y-4">
                  <Input
                    label="서비스명"
                    defaultValue="About Consulting"
                  />
                  <Input
                    label="관리자 이메일"
                    type="email"
                    defaultValue="admin@aboutconsulting.kr"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      서비스 언어
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="ko">한국어</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      타임존
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Asia/Seoul">Asia/Seoul (KST)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notification' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">알림 설정</h2>
                
                <div className="space-y-4">
                  {[
                    { label: '새 회원 가입 알림', defaultChecked: true },
                    { label: '결제 완료 알림', defaultChecked: true },
                    { label: '분석 완료 알림', defaultChecked: true },
                    { label: '시스템 오류 알림', defaultChecked: true },
                    { label: '마케팅 알림', defaultChecked: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2">
                      <span className="text-gray-700">{item.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={item.defaultChecked}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">보안 설정</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">2단계 인증</p>
                      <p className="text-sm text-gray-500">로그인 시 추가 인증을 요구합니다</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      세션 만료 시간 (분)
                    </label>
                    <input
                      type="number"
                      defaultValue={30}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      비밀번호 최소 길이
                    </label>
                    <input
                      type="number"
                      defaultValue={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">데이터 관리</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">데이터 백업</p>
                        <p className="text-sm text-gray-500">마지막 백업: 2024-12-26 03:00</p>
                      </div>
                      <Button variant="outline" leftIcon={<RefreshCw className="h-4 w-4" />}>
                        백업 실행
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">캐시 초기화</p>
                        <p className="text-sm text-gray-500">시스템 캐시를 삭제합니다</p>
                      </div>
                      <Button variant="outline">
                        캐시 삭제
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-700">데이터 초기화</p>
                        <p className="text-sm text-red-600">모든 데이터를 삭제합니다 (복구 불가)</p>
                      </div>
                      <Button variant="destructive">
                        초기화
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">이메일 설정</h2>
                
                <div className="space-y-4">
                  <Input
                    label="SMTP 서버"
                    defaultValue="smtp.gmail.com"
                  />
                  <Input
                    label="SMTP 포트"
                    defaultValue="587"
                  />
                  <Input
                    label="발신자 이메일"
                    type="email"
                    defaultValue="noreply@aboutconsulting.kr"
                  />
                  <Input
                    label="발신자 이름"
                    defaultValue="About Consulting"
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 pt-6 border-t flex justify-end">
              <Button onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                저장
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
