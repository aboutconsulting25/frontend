'use client';

type GradeType = 'internal' | 'mock';

interface GradeTypeTabsProps {
  activeType: GradeType;
  onTypeChange: (type: GradeType) => void;
}

export default function GradeTypeTabs({ activeType, onTypeChange }: GradeTypeTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <button
        onClick={() => onTypeChange('internal')}
        className={`py-4 text-lg font-medium rounded-lg border transition-colors ${
          activeType === 'internal'
            ? 'border-primary-500 text-primary-500 bg-white'
            : 'border-gray-200 text-gray-400 bg-white hover:border-gray-300'
        }`}
      >
        내신
      </button>
      <button
        onClick={() => onTypeChange('mock')}
        className={`py-4 text-lg font-medium rounded-lg border transition-colors ${
          activeType === 'mock'
            ? 'border-primary-500 text-primary-500 bg-white'
            : 'border-gray-200 text-gray-400 bg-white hover:border-gray-300'
        }`}
      >
        모의고사
      </button>
    </div>
  );
}

export type { GradeType };
