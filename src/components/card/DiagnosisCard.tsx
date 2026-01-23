import { ReactNode } from 'react';

interface DiagnosisCardProps {
  summary: string;
  children: ReactNode;
  className?: string;
}

export default function DiagnosisCard({
  summary,
  children,
  className = '',
}: DiagnosisCardProps) {
  return (
    <div className={`bg-white border border-[#00000026] rounded-xl p-5 ${className}`}>
      <div className="flex items-start gap-2">
        <span className="text-primary-500">✓</span>
        <p className="text-sm font-medium text-gray-900">{summary}</p>
      </div>
      <div className="my-4 border-t border-[#F7F7F7]" />
      <div className="text-sm text-gray-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
