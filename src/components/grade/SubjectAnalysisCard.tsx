'use client';

interface SubjectAnalysisCardProps {
  subject: string;
  courseName?: string;
  grade?: string;
  conversionFrom?: number;
  conversionTo?: number;
  description: string;
}

export default function SubjectAnalysisCard({
  subject,
  courseName,
  grade,
  conversionFrom,
  conversionTo,
  description,
}: SubjectAnalysisCardProps) {
  const hasConversion = conversionFrom !== undefined && conversionTo !== undefined;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* 과목명과 등급 */}
      <div className="mb-4">
        <span className="text-primary-500 font-medium">
          {subject}
          {courseName && `: ${courseName}`}
          {grade && ` (${grade})`}
        </span>
      </div>

      {/* 9등급제 환산 */}
      {hasConversion && (
        <div className="mb-3">
          <p className="text-base font-bold text-gray-900">
            9등급제 환산 시: {conversionFrom}등급 → {conversionTo}등급
          </p>
        </div>
      )}

      {/* 설명 */}
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
