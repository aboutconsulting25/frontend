'use client';

interface GradeChangeCardProps {
  change: number;
  message?: string;
}

export default function GradeChangeCard({ change, message }: GradeChangeCardProps) {
  const isNegative = change < 0;
  const displayValue = change > 0 ? `+${change.toFixed(2)}` : change.toFixed(2);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
      <h3 className="text-base font-medium text-gray-900 mb-4">등급 변화</h3>

      <div className="flex-1 flex items-center justify-center">
        <span
          className={`text-6xl font-bold ${
            isNegative ? 'text-gray-900' : 'text-green-600'
          }`}
        >
          {displayValue}
        </span>
      </div>

      {message && (
        <div className="mt-4 py-3 px-4 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-700 text-center">{message}</p>
        </div>
      )}
    </div>
  );
}
